import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const githubRoot = fileURLToPath(new URL("./github-pages/", import.meta.url));

export default defineConfig({
  root: githubRoot,
  base: "./",
  publicDir: fileURLToPath(new URL("./public/", import.meta.url)),
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL("./docs/", import.meta.url)),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        pro: `${githubRoot}index.html`,
        starter: `${githubRoot}basic-guide.html`,
        landing: `${githubRoot}landing_page.html`,
      },
    },
  },
});
