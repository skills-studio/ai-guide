import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("omits development preview metadata from the final Site", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.doesNotMatch(await response.text(), developmentPreviewMeta);
});

test("builds the three Stripe delivery entry points", async () => {
  const [landing, starter, pro] = await Promise.all([
    readFile(new URL("../docs/landing_page.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/basic-guide.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(landing, /AI CONTROL™ \| Практическа бизнес система/);
  assert.match(starter, /AI CONTROL™ Starter/);
  assert.match(starter, /noindex,nofollow/);
  assert.match(pro, /AI CONTROL™ Pro/);
  assert.match(pro, /noindex,nofollow/);
});

test("keeps all GitHub Pages assets relative to the repository path", async () => {
  const pages = await Promise.all([
    readFile(new URL("../docs/landing_page.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/basic-guide.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/index.html", import.meta.url), "utf8"),
  ]);

  for (const page of pages) {
    assert.match(page, /(?:src|href)="\.\/assets\//);
    assert.doesNotMatch(page, /(?:src|href)="\/assets\//);
  }
});

test("mirrors the complete GitHub Pages build at the repository root", async () => {
  const entryFiles = ["index.html", "basic-guide.html", "landing_page.html"];

  for (const entryFile of entryFiles) {
    const [docsEntry, rootEntry] = await Promise.all([
      readFile(new URL(`../docs/${entryFile}`, import.meta.url), "utf8"),
      readFile(new URL(`../${entryFile}`, import.meta.url), "utf8"),
    ]);

    assert.equal(rootEntry, docsEntry);
  }
});
