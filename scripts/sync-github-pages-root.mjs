import { copyFile, cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const docsRoot = fileURLToPath(new URL("../docs/", import.meta.url));

const directories = ["assets", "brand"];
const files = [
  ".nojekyll",
  "index.html",
  "basic-guide.html",
  "landing_page.html",
  "favicon.svg",
  "file.svg",
  "globe.svg",
  "window.svg",
];

for (const directory of directories) {
  const destination = `${repositoryRoot}${directory}`;
  await rm(destination, { recursive: true, force: true });
  await cp(`${docsRoot}${directory}`, destination, { recursive: true });
}

for (const file of files) {
  await copyFile(`${docsRoot}${file}`, `${repositoryRoot}${file}`);
}
