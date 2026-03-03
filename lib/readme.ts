import { GraphQLClient, gql } from "graphql-request";
import { auth } from "@/auth";
import { getGitHubAccountByEmail } from "@/lib/github-account";
import { hasPrivateRepoScope } from "@/lib/github-permissions";

const GITHUB_ENDPOINT = "https://api.github.com/graphql";

// --- Types ---

interface TreeEntry {
  name: string;
  type: "blob" | "tree";
  object?: {
    entries?: TreeEntry[];
    byteSize?: number;
  } | null;
}

interface RepoContextResponse {
  repository: {
    name: string;
    description: string | null;
    stargazerCount: number;
    forkCount: number;
    primaryLanguage: { name: string } | null;
    licenseInfo: { name: string; spdxId: string } | null;
    hasIssuesEnabled: boolean;
    issues: { totalCount: number };
    repositoryTopics: { nodes: Array<{ topic: { name: string } }> };

    // README variants
    readme: { text: string } | null;
    readmeMD: { text: string } | null;
    readmeLower: { text: string } | null;

    // Config files
    packageJson: { text: string } | null;
    pyproject: { text: string } | null;
    requirements: { text: string } | null;
    cargoToml: { text: string } | null;
    goMod: { text: string } | null;
    dockerfile: { text: string } | null;
    composerJson: { text: string } | null;
    gemfile: { text: string } | null;

    // File tree
    rootTree: {
      entries: TreeEntry[];
    } | null;
  } | null;
}

interface SourceFileResponse {
  repository: {
    [key: string]: { text: string } | null;
  } | null;
}

export interface RepoContext {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
  topics: string[];
  issueCount: number;
  readme: string | null;
  configFiles: {
    packageJson: string | null;
    pyproject: string | null;
    requirements: string | null;
    cargoToml: string | null;
    goMod: string | null;
    dockerfile: string | null;
    composerJson: string | null;
    gemfile: string | null;
  };
  fileTree: string;
  sourceFiles: Array<{ path: string; content: string }>;
  confidenceScore: number;
}

// --- GraphQL Queries ---

const REPO_CONTEXT_QUERY = gql`
  query GetRepoContext($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      description
      stargazerCount
      forkCount
      primaryLanguage {
        name
      }
      licenseInfo {
        name
        spdxId
      }
      hasIssuesEnabled
      issues(first: 1) {
        totalCount
      }
      repositoryTopics(first: 10) {
        nodes {
          topic {
            name
          }
        }
      }

      # README variants
      readme: object(expression: "HEAD:README.md") {
        ... on Blob {
          text
        }
      }
      readmeMD: object(expression: "HEAD:README.MD") {
        ... on Blob {
          text
        }
      }
      readmeLower: object(expression: "HEAD:readme.md") {
        ... on Blob {
          text
        }
      }

      # Config files - these reveal project structure better than source
      packageJson: object(expression: "HEAD:package.json") {
        ... on Blob {
          text
        }
      }
      pyproject: object(expression: "HEAD:pyproject.toml") {
        ... on Blob {
          text
        }
      }
      requirements: object(expression: "HEAD:requirements.txt") {
        ... on Blob {
          text
        }
      }
      cargoToml: object(expression: "HEAD:Cargo.toml") {
        ... on Blob {
          text
        }
      }
      goMod: object(expression: "HEAD:go.mod") {
        ... on Blob {
          text
        }
      }
      dockerfile: object(expression: "HEAD:Dockerfile") {
        ... on Blob {
          text
        }
      }
      composerJson: object(expression: "HEAD:composer.json") {
        ... on Blob {
          text
        }
      }
      gemfile: object(expression: "HEAD:Gemfile") {
        ... on Blob {
          text
        }
      }

      # File tree (depth 2)
      rootTree: object(expression: "HEAD:") {
        ... on Tree {
          entries {
            name
            type
            object {
              ... on Tree {
                entries {
                  name
                  type
                }
              }
              ... on Blob {
                byteSize
              }
            }
          }
        }
      }
    }
  }
`;

// --- Entrypoint Patterns by Language ---

const ENTRYPOINT_PATTERNS: Record<string, string[]> = {
  TypeScript: [
    "src/index.ts",
    "src/main.ts",
    "src/App.tsx",
    "index.ts",
    "main.ts",
    "src/index.tsx",
    "app/page.tsx",
    "pages/index.tsx",
  ],
  JavaScript: [
    "src/index.js",
    "src/main.js",
    "src/App.jsx",
    "index.js",
    "main.js",
    "server.js",
    "app.js",
    "src/index.jsx",
  ],
  Python: [
    "main.py",
    "app.py",
    "src/main.py",
    "__main__.py",
    "app/__init__.py",
    "src/__init__.py",
    "cli.py",
    "run.py",
  ],
  Rust: ["src/main.rs", "src/lib.rs", "main.rs", "lib.rs"],
  Go: ["main.go", "cmd/main.go", "cmd/root.go", "pkg/main.go"],
  Ruby: ["lib/main.rb", "app.rb", "main.rb", "bin/main"],
  PHP: ["index.php", "src/index.php", "public/index.php", "app/index.php"],
  Java: [
    "src/main/java/Main.java",
    "src/Main.java",
    "Main.java",
    "App.java",
    "src/main/java/App.java",
  ],
  "C#": ["Program.cs", "src/Program.cs", "Main.cs"],
  Swift: ["Sources/main.swift", "main.swift", "App.swift"],
  Kotlin: ["src/main/kotlin/Main.kt", "Main.kt", "App.kt"],
};

// Files to explicitly avoid (noise, not signal)
const EXCLUDED_PATTERNS = [
  /test/i,
  /spec/i,
  /__test__/i,
  /\.test\./i,
  /\.spec\./i,
  /mock/i,
  /fixture/i,
  /internal\//i,
  /utils?\//i,
  /helpers?\//i,
  /types?\.(ts|js)$/i,
  /constants?\.(ts|js)$/i,
  /config\.(ts|js)$/i, // config files, not entrypoints
];

// --- Helper Functions ---

async function getClient(): Promise<GraphQLClient> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("No authenticated session found.");
  }

  const account = await getGitHubAccountByEmail(session.user.email);

  if (!account?.accessToken) {
    throw new Error("No GitHub access token found. Please re-authenticate.");
  }
  if (hasPrivateRepoScope(account.scope)) {
    throw new Error(
      "Legacy GitHub permissions detected. Open Settings and use Reconnect GitHub.",
    );
  }

  return new GraphQLClient(GITHUB_ENDPOINT, {
    headers: { authorization: `Bearer ${account.accessToken}` },
  });
}

function flattenTree(
  entries: TreeEntry[],
  prefix = ""
): Array<{ path: string; type: string }> {
  const result: Array<{ path: string; type: string }> = [];

  for (const entry of entries) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    result.push({ path, type: entry.type });

    if (entry.type === "tree" && entry.object?.entries) {
      result.push(...flattenTree(entry.object.entries, path));
    }
  }

  return result;
}

function formatFileTree(entries: TreeEntry[], indent = 0): string {
  const lines: string[] = [];
  const prefix = "  ".repeat(indent);

  for (const entry of entries) {
    const icon = entry.type === "tree" ? "/" : "";
    lines.push(`${prefix}${entry.name}${icon}`);

    if (entry.type === "tree" && entry.object?.entries && indent < 1) {
      // Only go 2 levels deep
      lines.push(formatFileTree(entry.object.entries, indent + 1));
    }
  }

  return lines.join("\n");
}

function computeConfidenceScore(
  language: string | null,
  configFiles: RepoContext["configFiles"],
  fileTree: Array<{ path: string; type: string }>
): number {
  let score = 0;

  // Has config file? (+1)
  const hasConfig =
    configFiles.packageJson ||
    configFiles.pyproject ||
    configFiles.requirements ||
    configFiles.cargoToml ||
    configFiles.goMod ||
    configFiles.composerJson ||
    configFiles.gemfile;
  if (hasConfig) score += 1;

  // Has unambiguous primary language? (+1)
  if (language && ENTRYPOINT_PATTERNS[language]) score += 1;

  // Has obvious entrypoint filenames? (+1)
  if (language) {
    const patterns = ENTRYPOINT_PATTERNS[language] || [];
    const filePaths = new Set(fileTree.map((f) => f.path));
    const hasEntrypoint = patterns.some((p) => filePaths.has(p));
    if (hasEntrypoint) score += 1;
  }

  return score;
}

function selectEntrypoints(
  language: string | null,
  fileTree: Array<{ path: string; type: string }>
): string[] {
  if (!language) return [];

  const patterns = ENTRYPOINT_PATTERNS[language] || [];
  const filePaths = new Set(
    fileTree.filter((f) => f.type === "blob").map((f) => f.path)
  );

  const selected: string[] = [];

  for (const pattern of patterns) {
    if (filePaths.has(pattern)) {
      // Check against exclusion patterns
      const isExcluded = EXCLUDED_PATTERNS.some((regex) => regex.test(pattern));
      if (!isExcluded) {
        selected.push(pattern);
        if (selected.length >= 3) break; // Max 3 files
      }
    }
  }

  return selected;
}

function buildSourceFileQuery(files: string[]): string {
  const fragments = files
    .map((f, i) => {
      // GraphQL field names can't have special chars, so we alias them
      return `file${i}: object(expression: "HEAD:${f}") { ... on Blob { text } }`;
    })
    .join("\n      ");

  return `
    query GetSourceFiles($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        ${fragments}
      }
    }
  `;
}

// --- Main Export ---

export async function fetchRepoContext(
  repoUrl: string
): Promise<RepoContext | null> {
  // Parse owner/name from URL (https://github.com/owner/repo)
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }

  const [, owner, name] = match;
  const client = await getClient();

  // Step 1: Fetch structural context
  const data = await client.request<RepoContextResponse>(REPO_CONTEXT_QUERY, {
    owner,
    name,
  });

  if (!data.repository) {
    return null;
  }

  const repo = data.repository;
  const language = repo.primaryLanguage?.name || null;

  const configFiles = {
    packageJson: repo.packageJson?.text || null,
    pyproject: repo.pyproject?.text || null,
    requirements: repo.requirements?.text || null,
    cargoToml: repo.cargoToml?.text || null,
    goMod: repo.goMod?.text || null,
    dockerfile: repo.dockerfile?.text || null,
    composerJson: repo.composerJson?.text || null,
    gemfile: repo.gemfile?.text || null,
  };

  const treeEntries = repo.rootTree?.entries || [];
  const flatTree = flattenTree(treeEntries);
  const fileTreeFormatted = formatFileTree(treeEntries);

  const confidenceScore = computeConfidenceScore(
    language,
    configFiles,
    flatTree
  );

  // Step 2: Selectively fetch source files (only if confidence >= 2)
  let sourceFiles: Array<{ path: string; content: string }> = [];

  if (confidenceScore >= 2) {
    const entrypoints = selectEntrypoints(language, flatTree);

    if (entrypoints.length > 0) {
      const sourceQuery = buildSourceFileQuery(entrypoints);
      const sourceData = await client.request<SourceFileResponse>(sourceQuery, {
        owner,
        name,
      });

      if (sourceData.repository) {
        sourceFiles = entrypoints
          .map((path, i) => {
            const fileData = sourceData.repository?.[`file${i}`];
            if (fileData?.text) {
              // Truncate to 1000 chars max
              return {
                path,
                content: fileData.text.slice(0, 1000),
              };
            }
            return null;
          })
          .filter((f): f is { path: string; content: string } => f !== null);
      }
    }
  }

  return {
    name: repo.name,
    description: repo.description,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    language,
    license: repo.licenseInfo?.spdxId || repo.licenseInfo?.name || null,
    topics: repo.repositoryTopics.nodes.map((n) => n.topic.name),
    issueCount: repo.issues.totalCount,
    readme:
      repo.readme?.text || repo.readmeMD?.text || repo.readmeLower?.text || null,
    configFiles,
    fileTree: fileTreeFormatted,
    sourceFiles,
    confidenceScore,
  };
}

// --- Package Manager Detection ---

export function detectPackageManager(configFiles: RepoContext["configFiles"]): {
  manager: string;
  installCommand: string;
  runCommand: string;
} | null {
  if (configFiles.packageJson) {
    // Check for specific lock files would be ideal, but we'll infer from package.json
    const pkg = JSON.parse(configFiles.packageJson);
    const hasWorkspaces = pkg.workspaces;

    if (pkg.packageManager?.startsWith("pnpm")) {
      return {
        manager: "pnpm",
        installCommand: "pnpm install",
        runCommand: "pnpm",
      };
    }
    if (pkg.packageManager?.startsWith("yarn")) {
      return {
        manager: "yarn",
        installCommand: "yarn",
        runCommand: "yarn",
      };
    }
    if (pkg.packageManager?.startsWith("bun")) {
      return {
        manager: "bun",
        installCommand: "bun install",
        runCommand: "bun",
      };
    }
    // Default to npm
    return {
      manager: "npm",
      installCommand: "npm install",
      runCommand: hasWorkspaces ? "npm run" : "npm run",
    };
  }

  if (configFiles.pyproject) {
    // Check for poetry vs pip
    if (configFiles.pyproject.includes("[tool.poetry]")) {
      return {
        manager: "poetry",
        installCommand: "poetry install",
        runCommand: "poetry run",
      };
    }
    return {
      manager: "pip",
      installCommand: "pip install -e .",
      runCommand: "python",
    };
  }

  if (configFiles.requirements) {
    return {
      manager: "pip",
      installCommand: "pip install -r requirements.txt",
      runCommand: "python",
    };
  }

  if (configFiles.cargoToml) {
    return {
      manager: "cargo",
      installCommand: "cargo build",
      runCommand: "cargo run",
    };
  }

  if (configFiles.goMod) {
    return {
      manager: "go",
      installCommand: "go mod download",
      runCommand: "go run",
    };
  }

  if (configFiles.composerJson) {
    return {
      manager: "composer",
      installCommand: "composer install",
      runCommand: "php",
    };
  }

  if (configFiles.gemfile) {
    return {
      manager: "bundler",
      installCommand: "bundle install",
      runCommand: "bundle exec",
    };
  }

  return null;
}

// --- Extract Scripts from package.json ---

export function extractNpmScripts(
  packageJson: string | null
): Record<string, string> {
  if (!packageJson) return {};

  try {
    const pkg = JSON.parse(packageJson);
    return pkg.scripts || {};
  } catch {
    return {};
  }
}

// --- Extract Dependencies Summary ---

export function extractDependenciesSummary(
  configFiles: RepoContext["configFiles"]
): string[] {
  const deps: string[] = [];

  if (configFiles.packageJson) {
    try {
      const pkg = JSON.parse(configFiles.packageJson);
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };
      // Get top 10 most notable deps
      const notable = Object.keys(allDeps)
        .filter(
          (d) =>
            !d.startsWith("@types/") &&
            !d.startsWith("eslint") &&
            !d.startsWith("prettier")
        )
        .slice(0, 10);
      deps.push(...notable);
    } catch {
      // ignore
    }
  }

  if (configFiles.pyproject) {
    // Extract from pyproject.toml (simplified)
    const depMatch = configFiles.pyproject.match(
      /dependencies\s*=\s*\[([\s\S]*?)\]/
    );
    if (depMatch) {
      const pyDeps = depMatch[1]
        .match(/"([^"]+)"/g)
        ?.map((d) => d.replace(/"/g, "").split(/[<>=]/)[0])
        .slice(0, 10);
      if (pyDeps) deps.push(...pyDeps);
    }
  }

  if (configFiles.requirements) {
    const lines = configFiles.requirements.split("\n");
    const reqDeps = lines
      .filter((l) => l.trim() && !l.startsWith("#"))
      .map((l) => l.split(/[<>=]/)[0].trim())
      .slice(0, 10);
    deps.push(...reqDeps);
  }

  return deps;
}
