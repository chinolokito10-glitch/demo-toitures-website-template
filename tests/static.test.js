import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { renderSite } from "../scripts/render-site.js";
import { metadata } from "../scripts/metadata.js";

test("Vercel publishes only the static build with demo form configuration", async () => {
  const config = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url)),
  );
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, "dist");
  assert.equal(config.buildCommand, "npm run build");
  assert.equal(config.functions, undefined);
  assert.equal(config.rewrites, undefined);
  const files = await readdir(new URL("../dist/", import.meta.url), {
    recursive: true,
  });
  assert.ok(files.includes("index.html"));
  assert.ok(
    !files.some((name) =>
      /server\.(?:mjs|js)$|^scripts\/|^node_modules\/|^\.env/.test(name),
    ),
  );
  assert.deepEqual(
    JSON.parse(
      await readFile(new URL("../dist/api/config.json", import.meta.url)),
    ),
    { estimatesEnabled: false },
  );
  assert.equal(
    await readFile(new URL("../dist/index.html", import.meta.url), "utf8"),
    metadata(renderSite(), process.env.PUBLIC_ORIGIN || ""),
  );
});

test("production retains the original styles, browser modules, and every image/font byte", async () => {
  const files = [
    "styles.css",
    "script.js",
    "site.config.js",
    ...(await readdir(new URL("../assets/", import.meta.url))).map(
      (name) => `assets/${name}`,
    ),
  ];
  for (const name of files) {
    assert.deepEqual(
      await readFile(new URL(`../dist/${name}`, import.meta.url)),
      await readFile(new URL(`../${name}`, import.meta.url)),
      name,
    );
  }
});
