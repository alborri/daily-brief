// Assembles data/news.json, the file the phone app reads, from the newsroom's documents:
//   newsroom/stories/<id>.json  one document per story (new stories, or changes and dated updates to an archive story)
//   newsroom/site.json          newsroom status, items waiting for confirmation, corrections, calendar
//   newsroom/fr.json            French for every English text shown to readers
//   newsroom/pics.json          optional: {"<story id>": {"src":"pics/<file>.jpg", "credit":"..."}}
// It refuses to publish when a document is broken or a text has no French, and says what to fix.
//   node tools/news.mjs            build data/news.json
//   node tools/news.mjs --check    only check, write nothing
//   node tools/news.mjs --missing  print the English texts that still need French, as a JSON array
import fs from "node:fs";
import path from "node:path";
import { ROOT, readJSON, loadNewsroom, collect, archiveStrings } from "./lib.mjs";

const args = new Set(process.argv.slice(2));
const { stories, site } = loadNewsroom();
const fr = readJSON("newsroom/fr.json");
const errors = [];
const TIERS = ["agency","official","intl","national","state","specialist","other"];
const archive = archiveStrings();
const archiveIds = new Set(JSON.parse(JSON.stringify((await import("./lib.mjs")).loadArchive().SEED.map(s => s.id))));

for(const d of stories){
  const where = "stories/" + d.id + ".json";
  if(!/^[a-z0-9-]{3,60}$/.test(d.id)) errors.push(where + ": the file name must be lower-case letters, digits and dashes");
  if(!d.rev || isNaN(new Date(d.rev))) errors.push(where + ": \"rev\" must be the time of the last change (UTC)");
  if(!archiveIds.has(d.id) && !d.hidden && !(d.headline && d.summary && d.date)) errors.push(where + ": a new story needs headline, summary and date");
  const src = d.src || {};
  for(const k of Object.keys(src)){
    const x = src[k];
    if(!x || !x.n || !/^https:\/\/[^\s"'`]+$/.test(String(x.u || ""))) errors.push(where + ": source \"" + k + "\" needs a name and an https link");
    else if(x.tier && !TIERS.includes(x.tier)) errors.push(where + ": source \"" + k + "\" has an unknown tier \"" + x.tier + "\"");
  }
  (function refs(o){   // every source reference must exist
    if(Array.isArray(o)){ o.forEach(refs); return; }
    if(!o || typeof o !== "object") return;
    for(const k of Object.keys(o)){
      const v = o[k];
      if(k === "src") continue;
      if((k === "s" || k === "is" || k === "ratingSrc") && Array.isArray(v)) v.forEach(r => { if(typeof r === "string" && !src[r]) errors.push(where + ": reference to a missing source \"" + r + "\""); });
      else if(v && typeof v === "object") refs(v);
    }
  })(d);
  (d.updates || []).forEach((u, i) => { if(!u.t || !u.at || isNaN(new Date(u.at))) errors.push(where + ": update " + (i + 1) + " needs text (t) and a time (at)"); });
}
if(site.lastCheck && isNaN(new Date(site.lastCheck))) errors.push("site.json: lastCheck is not a time");

// French: every text of the news documents; archive texts ship inside the app.
const need = [];
stories.forEach(d => collect(d).forEach(x => need.push(x)));
collect(site).forEach(x => need.push(x));
const uniq = [...new Set(need)];
const missing = uniq.filter(x => !fr[x] && !archive.known[x]);
if(args.has("--missing")){ console.log(JSON.stringify(missing, null, 1)); process.exit(0); }
if(missing.length) errors.push("French is missing for " + missing.length + " text(s) in newsroom/fr.json. Run: node tools/news.mjs --missing");

if(errors.length){ console.error("Not published. Fix these first:\n- " + errors.join("\n- ")); process.exit(1); }

let pics = {};
try{ pics = readJSON("newsroom/pics.json"); }catch(e){}
for(const id of Object.keys(pics)){ if(!fs.existsSync(path.join(ROOT, String(pics[id].src || "")))){ console.error("pics.json: file not found for " + id); process.exit(1); } }

const tmfr = {};
uniq.forEach(x => { tmfr[x] = fr[x] || archive.known[x]; });
const body = { stories, site, pics, tm: { fr: tmfr } };
// "generated" changes only when the content changes, so an unchanged run publishes nothing new.
const out = path.join(ROOT, "data/news.json");
let prev = null;
try{ prev = JSON.parse(fs.readFileSync(out, "utf8")); }catch(e){}
const same = prev && JSON.stringify({ stories: prev.stories, site: prev.site, pics: prev.pics, tm: prev.tm }) === JSON.stringify(body);
if(args.has("--check")){ console.log("OK:", stories.length, "story documents,", uniq.length, "texts, all with French." + (same ? " No change since the last build." : " Changes are ready to build.")); process.exit(0); }
if(same){ console.log("No change: data/news.json is already up to date."); process.exit(0); }
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(Object.assign({ v: 1, generated: new Date().toISOString() }, body)));
console.log("data/news.json written:", stories.length, "story documents,", uniq.length, "texts,", fs.statSync(out).size, "bytes");
