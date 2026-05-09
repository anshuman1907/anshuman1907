// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function readGithubRepository(): string | undefined {
  const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  return env?.GITHUB_REPOSITORY;
}

/** GitHub Project Pages: https://USER.github.io/REPO/ requires base /REPO/ */
function pagesBase(): string {
  const ref = readGithubRepository();
  if (ref && ref.includes("/")) {
    return `/${ref.split("/")[1]}/`;
  }
  return "./";
}

export default defineConfig({
  base: pagesBase(),
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
