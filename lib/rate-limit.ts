// CRITICAL FIX: GitHub API rate limit handling
// Prevents silent failures and provides user feedback

interface RateLimitState {
  isLimited: boolean;
  resetAt: Date | null;
  remaining: number;
}

// In-memory cache of rate limit state per user
// In production, this should use Redis or similar
const rateLimitCache = new Map<string, RateLimitState>();

export class GitHubRateLimitError extends Error {
  constructor(
    public resetAt: Date,
    public remaining: number = 0
  ) {
    const resetTime = resetAt.toLocaleTimeString();
    super(
      `GitHub API rate limit exceeded. Resets at ${resetTime}. Please try again later.`
    );
    this.name = "GitHubRateLimitError";
  }
}

/**
 * Check if user is currently rate limited
 */
export function checkRateLimit(userEmail: string): void {
  const cached = rateLimitCache.get(userEmail);

  if (cached?.isLimited && cached.resetAt) {
    const now = new Date();

    // If reset time has passed, clear the limit
    if (now >= cached.resetAt) {
      rateLimitCache.delete(userEmail);
      return;
    }

    // Still rate limited
    throw new GitHubRateLimitError(cached.resetAt, cached.remaining);
  }
}

/**
 * Parse GitHub GraphQL error for rate limit info
 */
export function parseGitHubError(error: any): {
  isRateLimit: boolean;
  resetAt: Date | null;
  remaining: number;
} {
  // GitHub GraphQL rate limit error structure
  if (error?.response?.errors) {
    const rateLimitError = error.response.errors.find(
      (e: any) => e.type === "RATE_LIMITED" || e.message?.includes("rate limit")
    );

    if (rateLimitError) {
      // Try to extract reset time from headers
      const resetHeader = error.response.headers?.["x-ratelimit-reset"];
      const remainingHeader = error.response.headers?.["x-ratelimit-remaining"];

      return {
        isRateLimit: true,
        resetAt: resetHeader ? new Date(parseInt(resetHeader) * 1000) : null,
        remaining: remainingHeader ? parseInt(remainingHeader) : 0,
      };
    }
  }

  // Check for REST API rate limit (status 403 with rate limit message)
  if (
    error?.status === 403 &&
    error?.message?.toLowerCase().includes("rate limit")
  ) {
    return {
      isRateLimit: true,
      resetAt: error.headers?.["x-ratelimit-reset"]
        ? new Date(parseInt(error.headers["x-ratelimit-reset"]) * 1000)
        : null,
      remaining: error.headers?.["x-ratelimit-remaining"]
        ? parseInt(error.headers["x-ratelimit-remaining"])
        : 0,
    };
  }

  return {
    isRateLimit: false,
    resetAt: null,
    remaining: 0,
  };
}

/**
 * Update rate limit cache when limit is hit
 */
export function setRateLimit(
  userEmail: string,
  resetAt: Date,
  remaining: number = 0
): void {
  rateLimitCache.set(userEmail, {
    isLimited: true,
    resetAt,
    remaining,
  });

  // Auto-clear after reset time
  const now = new Date();
  const ttl = resetAt.getTime() - now.getTime();

  if (ttl > 0) {
    setTimeout(() => {
      rateLimitCache.delete(userEmail);
    }, ttl);
  }
}

/**
 * Exponential backoff helper for retries
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry rate limit errors or auth errors
      const { isRateLimit } = parseGitHubError(error);
      if (isRateLimit || error.message?.includes("authentication")) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
