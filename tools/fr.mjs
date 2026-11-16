// French for the news texts (newsroom/fr.json maps each English text to its French).
//   node tools/fr.mjs list            numbered list of the English texts that still need French
//                                     (dates such as "17 Nov 2026" and plain numbers are filled in automatically)
//   node tools/fr.mjs add FILE.json   FILE is a JSON array of [number, "French text"] pairs, using the numbers from "list"
// "add" checks that every number in the English also appears in the French, then applies French spacing rules.
import fs from "node:fs";
import path from "node:path";
import { ROOT, readJSON, loadNewsroom, collect, archiveStrings } from "./lib.mjs";

const file = path.join(ROOT, "newsroom/fr.json");
const fr = readJSON("newsroom/fr.json");
const save = () => fs.writeFileSync(file, JSON.stringify(fr, null, 0).replace(/","/g, '",\n"') + "\n");
const NB = " ";
const typo = s => s
  .replace(/ ([:;?!»%])/g, NB + "$1").replace(/« /g, "«" + NB)
  .replace(/(\d) (\d{3})(?!\d)/g, "$1" + NB + "$2")
  .replace(/(\d) (°C|h|dollars|euros|milliards|millions|sièges|voix|morts|heures|ans|mois|points?|cents)\b/g, "$1" + NB + "$2")
  .replace(/\bh (\d\d)\b/g, "h" + NB + "$1");
const MON = {Jan:"janv.",Feb:"févr.",Mar:"mars",Apr:"avr.",May:"mai",Jun:"juin",Jul:"juil.",Aug:"août",Sep:"sept.",Sept:"sept.",Oct:"oct.",Nov:"nov.",Dec:"déc.",
  January:"janvier",February:"février",March:"mars",April:"avril",June:"juin",July:"juillet",August:"août",September:"septembre",October:"octobre",November:"novembre",December:"décembre"};
function auto(x){
  let m;
  if(/^[\d\s.,%$€£–-]+$/.test(x)) return x;
  if((m = x.match(/^(\d{1,2}(?:–\d{1,2})? )?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept?|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December) (\d{4})$/))) return (m[1] || "") + MON[m[2]] + " " + m[3];
  if((m = x.match(/^(\d{1,2}(?:–\d{1,2})?) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept?|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)$/))) return m[1] + " " + MON[m[2]];
  return null;
}
function missing(){
  const { stories, site } = loadNewsroom();
  const known = archiveStrings().known, list = [];
  stories.forEach(d => collect(d).forEach(x => list.push(x)));
  collect(site).forEach(x => list.push(x));
  let filled = 0;
  const out = [...new Set(list)].filter(x => {
    if(fr[x] || known[x]) return false;
    const a = auto(x); if(a !== null){ fr[x] = a; filled++; return false; }
    return true;
  });
  if(filled) save();
  return out;
}
const digits = s => (s.replace(/(\d)[  ,](\d{3})(?!\d)/g, "$1$2").match(/\d+/g) || []);

const cmd = process.argv[2];
if(cmd === "list"){
  const m = missing();
  if(!m.length) console.log("Nothing to translate: every text has French.");
  m.forEach((x, i) => console.log(i + "\t" + x));
} else if(cmd === "add"){
  const m = missing();
  const pairs = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
  const got = {}; let bad = 0;
  for(const [i, t] of pairs){
    if(!(i in m) || typeof t !== "string" || !t.trim()){ console.error("Line " + i + ": no such number, or empty text"); bad++; continue; }
    const lost = digits(m[i]).filter(d => !digits(t).includes(d) && !digits(t).includes(String(Number(d))));
    if(lost.length) console.warn("Check the numbers in " + i + " (" + lost.join(", ") + "): " + m[i].slice(0, 70));
    if(/[<>]/.test(t)){ console.error("Line " + i + ": remove the angle brackets"); bad++; continue; }
    got[i] = t;
  }
  const left = m.map((x, i) => i).filter(i => got[i] === undefined);
  if(bad || left.length){ console.error("Nothing saved. " + (left.length ? "Still without French: " + left.join(", ") : "")); process.exit(1); }
  m.forEach((x, i) => { fr[x] = typo(got[i].replace(/'/g, "’")); });
  save();
  console.log("Saved French for " + m.length + " text(s).");
} else {
  console.log("Usage: node tools/fr.mjs list | add FILE.json");
}
