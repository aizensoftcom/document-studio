#!/usr/bin/env node
/**
 * Build offline-installable PWA from Document-Studio.html
 * → preview/ and dist/
 */
import { copyFileSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceHtml = join(root, "Document-Studio.html");
const publicDir = join(root, "public");

if (!existsSync(sourceHtml)) {
  console.error("Missing Document-Studio.html — restore the library source first.");
  process.exit(1);
}

const size = readFileSync(sourceHtml).byteLength;
if (size < 1_000_000) {
  console.error(`Document-Studio.html looks empty/corrupt (${size} bytes).`);
  process.exit(1);
}

function injectPwa(html) {
  const headBits = [
    '<link rel="manifest" href="./manifest.webmanifest">',
    '<meta name="theme-color" content="#183f73">',
    '<meta name="mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-title" content="Document Studio">',
    '<link rel="apple-touch-icon" href="./icons/apple-touch-icon.png">',
  ].join("");

  let out = html;
  if (!/rel="manifest"/.test(out)) {
    out = out.replace(/<head([^>]*)>/i, `<head$1>${headBits}`);
  }
  if (!/register-sw\.js/.test(out)) {
    const bodyClose = out.lastIndexOf("</body>");
    if (bodyClose === -1) throw new Error("No </body> in Document-Studio.html");
    out =
      out.slice(0, bodyClose) +
      '<script src="./register-sw.js" defer></script>' +
      out.slice(bodyClose);
  }
  // Title for installed app chrome
  out = out.replace(
    /<title>[^<]*<\/title>/i,
    "<title>Document Studio</title>"
  );
  return out;
}

function buildTo(target) {
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  mkdirSync(join(target, "icons"), { recursive: true });

  const html = injectPwa(readFileSync(sourceHtml, "utf8"));
  writeFileSync(join(target, "index.html"), html);

  copyFileSync(join(publicDir, "manifest.webmanifest"), join(target, "manifest.webmanifest"));
  copyFileSync(join(publicDir, "sw.js"), join(target, "sw.js"));
  copyFileSync(join(publicDir, "register-sw.js"), join(target, "register-sw.js"));
  cpSync(join(publicDir, "icons"), join(target, "icons"), { recursive: true });

  // GitHub Pages: empty .nojekyll so paths are not filtered
  writeFileSync(join(target, ".nojekyll"), "");
  console.log(`Built ${target} (${(html.length / 1e6).toFixed(1)} MB HTML)`);
}

const only = (process.env.BUILD_ONLY || "").toLowerCase();
if (!only || only === "preview") buildTo(join(root, "preview"));
if (!only || only === "dist") buildTo(join(root, "dist"));
console.log("Done. Open preview/ via a local HTTPS/http server to Install / test offline.");
