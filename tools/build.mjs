// Builds the app from src/.
//   node tools/build.mjs                 -> the standalone phone app: index.html and sw.js at the repository root
//   node tools/build.mjs claude --out F  -> the page that runs inside Claude (database, AI chat), written to F
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import os from "node:os";
import { ROOT, read, archiveStrings, loadI18N, readJSON } from "./lib.mjs";

const args = process.argv.slice(2);
const mode = args[0] === "claude" ? "claude" : "pwa";
const outIdx = args.indexOf("--out");
const VERSION = "1.0";

let shell = read("src/shell.html");
const stories = ["src/stories.js", "src/context.js", "src/meta.js"].map(read).join("\n");
const app = read("src/app.js");
let flags, i18n;

if(mode === "pwa"){
  shell = shell.replace(/<!--CL-->[\s\S]*?<!--\/CL-->/g, "").replace(/<!--\/?SA-->/g, "");
  // Interface text: English and French only.
  const base = new Function(read("src/i18n.js") + "\n" + read("src/i18n-standalone.js") + "\n;return {LANGS, I18N};")();
  const keep = ["en", "fr"];
  const LANGS = Object.fromEntries(keep.map(l => [l, base.LANGS[l]]));
  const I18N = Object.fromEntries(keep.map(l => [l, base.I18N[l]]));
  const lost = Object.keys(I18N.en).filter(k => I18N.fr[k] === undefined);
  if(lost.length) console.warn("French interface text missing for:", lost.join(", "));
  i18n = `const LANGS = ${JSON.stringify(LANGS)};\nconst LANG_ORDER = ${JSON.stringify(keep)};\nconst I18N = ${JSON.stringify(I18N)};`;
  // French for the bundled archive, so the app reads in French even before the first news file arrives.
  const fr = readJSON("newsroom/fr.json");
  const { list, known } = archiveStrings();
  const pack = {}, missing = [];
  list.forEach(x => { if(known[x]) return; if(fr[x]) pack[x] = fr[x]; else missing.push(x); });
  if(missing.length){ console.error("No French for " + missing.length + " archive texts, for example:\n  " + missing.slice(0, 5).join("\n  ")); process.exit(1); }
  const stamp = crypto.createHash("sha1").update(shell + stories + i18n + app + JSON.stringify(pack)).digest("hex").slice(0, 7);
  flags = `const STANDALONE = true;\nconst APP_VERSION = ${JSON.stringify(VERSION + " (" + stamp + ")")};\nconst TM_PACK = ${JSON.stringify({ fr: pack })};`;
  const html = shell.replace("/*__FLAGS__*/", () => flags).replace("/*__STORIES__*/", () => stories).replace("/*__I18N__*/", () => i18n).replace("/*__APP__*/", () => app);
  check(html);
  fs.writeFileSync(path.join(ROOT, "index.html"), html);
  fs.writeFileSync(path.join(ROOT, "sw.js"), read("src/sw.js").replace(/__VERSION__/g, stamp));
  console.log("standalone app built:", "index.html", html.length, "bytes, version", VERSION, stamp);
} else {
  shell = shell.replace(/<!--SA-->[\s\S]*?<!--\/SA-->/g, "").replace(/<!--\/?CL-->/g, "");
  flags = "const STANDALONE = false;";
  i18n = read("src/i18n.js");
  const html = shell.replace("/*__FLAGS__*/", () => flags).replace("/*__STORIES__*/", () => stories).replace("/*__I18N__*/", () => i18n).replace("/*__APP__*/", () => app);
  check(html);
  const out = outIdx >= 0 ? args[outIdx + 1] : path.join(ROOT, "dist-claude", "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log("Claude page built:", out, html.length, "bytes");
}

function check(html){   // the page's script must parse
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  const tmp = path.join(os.tmpdir(), "daily-brief-check.js");
  fs.writeFileSync(tmp, m[1]);
  execFileSync(process.execPath, ["--check", tmp], { stdio: "inherit" });
}
