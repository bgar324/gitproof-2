/**
 * Language color mapping based on GitHub's language colors
 * https://github.com/ozh/github-colors
 */

const LANGUAGE_COLORS: Record<string, string> = {
  // JavaScript ecosystem
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  "TSX": "#3178c6",
  "JSX": "#f1e05a",
  Vue: "#41b883",
  Svelte: "#ff3e00",

  // Python
  Python: "#3572A5",

  // Java ecosystem
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Scala: "#c22d40",

  // C family
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",

  // Ruby
  Ruby: "#701516",

  // Go
  Go: "#00ADD8",

  // Rust
  Rust: "#dea584",

  // PHP
  PHP: "#4F5D95",

  // Swift
  Swift: "#F05138",

  // Shell
  Shell: "#89e051",
  Bash: "#89e051",

  // Web
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",

  // Markup
  Markdown: "#083fa1",

  // Elixir
  Elixir: "#6e4a7e",

  // Lua
  Lua: "#000080",

  // R
  R: "#198CE7",

  // Dart
  Dart: "#00B4AB",

  // Haskell
  Haskell: "#5e5086",

  // Clojure
  Clojure: "#db5855",

  // Objective-C
  "Objective-C": "#438eff",

  // Perl
  Perl: "#0298c3",

  // Erlang
  Erlang: "#B83998",

  // Julia
  Julia: "#a270ba",

  // Zig
  Zig: "#ec915c",

  // Nim
  Nim: "#ffc200",

  // Crystal
  Crystal: "#000100",

  // V
  V: "#4f87c4",

  // Solidity
  Solidity: "#AA6746",

  // Assembly
  Assembly: "#6E4C13",

  // CMake
  CMake: "#DA3434",

  // Makefile
  Makefile: "#427819",

  // Dockerfile
  Dockerfile: "#384d54",

  // Default
  "Plain Text": "#6e7681",
  Text: "#6e7681",
};

/**
 * Get the color for a programming language
 * @param language - The programming language name
 * @returns Hex color string
 */
export function getLanguageColor(language: string | null | undefined): string {
  if (!language) return LANGUAGE_COLORS["Plain Text"];

  // Try exact match first
  if (LANGUAGE_COLORS[language]) {
    return LANGUAGE_COLORS[language];
  }

  // Try case-insensitive match
  const normalized = language.toLowerCase();
  const match = Object.keys(LANGUAGE_COLORS).find(
    key => key.toLowerCase() === normalized
  );

  if (match) {
    return LANGUAGE_COLORS[match];
  }

  // Default to grey
  return LANGUAGE_COLORS["Plain Text"];
}
