// Shared helpers for the build and the news export. Run with Node 18+.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
export const readJSON = f => JSON.parse(read(f));

// The bundled archive (src/stories.js + context.js + meta.js), evaluated as the app does.
export function loadArchive(){
  const src = ["src/stories.js", "src/context.js", "src/meta.js"].map(read).join("\n");
  return new Function(src + "\n;return {SEED, CALENDAR};")();
}
export function loadI18N(){
  return new Function(read("src/i18n.js") + "\n;return {LANGS, LANG_ORDER, I18N};")();
}
// The newsroom's documents: one file per story, plus the site status.
export function loadNewsroom(){
  const dir = path.join(ROOT, "newsroom/stories");
  const stories = fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()
    .map(f => Object.assign({}, JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")), {id: f.replace(/\.json$/, "")}));
  return {stories, site: readJSON("newsroom/site.json")};
}

// Same rule as the app (src/app.js): which strings are shown to readers and need a translation.
const TKEYS = new Set(["headline","summary","why","simple","pattern","t","d","name","what","mkts","asset","note","k","v","text","who","desc","q","e","intro","r","ev","sh","label","schedule"]);
const TARR = new Set(["chain","watch","business","o"]);
export function collect(obj){
  const out = [];
  (function walk(o){
    if(Array.isArray(o)){ o.forEach(walk); return; }
    if(!o || typeof o !== "object") return;
    for(const key of Object.keys(o)){
      if(key === "sources" || key === "src") continue;       // source names and titles stay as published
      if(key === "t" && o.from) continue;                     // calendar entries: "t" is the topic, not text
      const val = o[key];
      if(typeof val === "string"){ if(TKEYS.has(key) && val.trim()) out.push(val.replace(/[<>]/g, "")); }
      else if(Array.isArray(val) && TARR.has(key) && val.every(x => typeof x === "string")) val.forEach(x => out.push(x.replace(/[<>]/g, "")));
      else if(val && typeof val === "object") walk(val);
    }
  })(obj);
  return out;
}
// Strings of the archive (with the short headline and event name that already exist in French).
export function archiveStrings(){
  const {SEED} = loadArchive();
  const known = {};
  const list = [];
  SEED.forEach(s => {
    const c = JSON.parse(JSON.stringify(s));
    ["ev","sh"].forEach(k => { const v = c[k]; if(v && typeof v === "object"){ if(v.fr) known[v.en] = v.fr; c[k] = v.en; } });
    collect(c).forEach(x => list.push(x));
  });
  return {list:[...new Set(list)], known};
}
export function newsStrings(){
  const {stories, site} = loadNewsroom();
  const list = [];
  stories.forEach(d => collect(d).forEach(x => list.push(x)));
  collect(site).forEach(x => list.push(x));
  return [...new Set(list)];
}
