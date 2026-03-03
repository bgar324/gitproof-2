const PRIVATE_REPO_SCOPES = new Set(["repo"]);

export function parseGitHubScopes(scope: string | null | undefined): string[] {
  if (!scope) return [];

  return scope
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

export function hasPrivateRepoScope(scope: string | null | undefined): boolean {
  return parseGitHubScopes(scope).some(
    (value) => PRIVATE_REPO_SCOPES.has(value) || value.startsWith("repo:"),
  );
}
