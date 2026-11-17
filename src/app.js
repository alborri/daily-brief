/* ---------- App ---------- */
// One source, two builds: the page inside Claude (database, AI chat and translation) and the
// standalone phone app (news from data/news.json, French shipped with the news, no AI on the device).
const SA = typeof STANDALONE !== "undefined" && STANDALONE === true;
const $ = id => document.getElementById(id);
let NOW = new Date();
let STORIES = [], byId = {};
let SITE = {};          // newsroom status and calendar, from the database
let PICS = {};          // story id -> {id, credit}: pictures added by the owner
let dbState = "idle";   // idle | loading | live | offline
const MODE_ORDER = ["essentials","markets","geo","learn","business"];
const MODE_SECTIONS = {
  essentials:["summary","what","why","effects"],
  markets:["summary","impact","what","chain","persp","scenariosM","watch"],
  geo:["summary","background","what","chain","story","persp","connected","scenarios"],
  learn:["simple","terms","what","story","persp","next"],
  business:["summary","business","what","chain","persp","scenariosM","watch"]
};
const ALL_SECTIONS = ["summary","what","why","effects","bgFull","persp","chain","impact","business","connected","scenariosM","watch","terms"];
const TOPICS = ["Geopolitics","Politics","Economy","Markets","Energy","Climate"];
const REGIONS = ["Europe","US","China","ME","Asia","Global"];
const ASSETS = ["oil","gold","wheat","energy","airlines","defence","banks","clean","usd","eur","chf","bonds"];
const REASONS = [
  {id:"informed", mode:"essentials", watch:[]},
  {id:"invest", mode:"markets", watch:["oil","usd","eur","chf"]},
  {id:"ir", mode:"geo", watch:[]},
  {id:"business", mode:"business", watch:["oil","eur","banks"]},
  {id:"learn", mode:"learn", watch:[]}
];
const TIMES = [2,5,15];
const DEFAULT_PREFS = {lang:null, reason:"informed", topics:["Geopolitics","Economy"], regions:["Europe","Global"], time:5, mode:"essentials", notify:false, following:[], seen:{}, watch:[], reads:[], quizLog:null};
const KEY = "dailybrief.prefs.v2";
const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

/* ---------- Preferences (kept in this browser only) ---------- */
function loadPrefs(){ try{ const r = localStorage.getItem(KEY); return r ? Object.assign({}, DEFAULT_PREFS, JSON.parse(r)) : null; }catch(e){ return null; } }
function savePrefs(){ try{ localStorage.setItem(KEY, JSON.stringify(prefs)); }catch(e){} }
let prefs = loadPrefs();
let draft = null;
const P = () => prefs || DEFAULT_PREFS;
function setPref(k, v){ prefs = Object.assign({}, P(), {[k]: v}); savePrefs(); }

/* ---------- Language ---------- */
function detectLang(){ try{ const n = (navigator.language || "en").slice(0,2).toLowerCase(); return LANG_ORDER.includes(n) ? n : "en"; }catch(e){ return "en"; } }
function lang(){ return (prefs && prefs.lang) || (draft && draft.lang) || detectLang(); }
function tr(k, v){
  const d = I18N[lang()] || I18N.en;
  let s = d[k] !== undefined ? d[k] : (I18N.en[k] !== undefined ? I18N.en[k] : k);
  if(v && typeof s === "string") for(const x in v) s = s.split("{" + x + "}").join(v[x]);
  return s;
}
const loc = () => LANGS[lang()].loc;

/* ---------- Helpers ---------- */
function esc(t){ return String(t).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function dayStart(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }
const pad = n => String(n).padStart(2, "0");
function dateStr(off){ const d = new Date(); d.setDate(d.getDate() + off); return d.getFullYear() + "-" + pad(d.getMonth()+1) + "-" + pad(d.getDate()); }
function when(iso){
  const d = new Date(iso);
  const days = Math.round((dayStart(NOW) - dayStart(d)) / 864e5);
  const time = d.toLocaleTimeString(loc(), {hour:"2-digit", minute:"2-digit"});
  if(days === 0) return tr("todayAt", {t:time});
  if(days === 1) return tr("yesterday");
  return d.toLocaleDateString(loc(), {day:"numeric", month:"short"});
}
function whenAt(iso, withTime){
  const d = new Date(iso);
  const days = Math.round((dayStart(NOW) - dayStart(d)) / 864e5);
  const day = days === 0 ? tr("dToday") : days === 1 ? tr("dYday") : tr("dDate", {d:d.toLocaleDateString(loc(), {day:"numeric", month:"long"})});
  return withTime ? tr("atTime", {d:day, t:d.toLocaleTimeString(loc(), {hour:"2-digit", minute:"2-digit"})}) : day;
}
const stamp = at => { const d = new Date(at); return d.toLocaleDateString(loc(), {day:"numeric", month:"short", year:"numeric"}) + ", " + d.toLocaleTimeString(loc(), {hour:"2-digit", minute:"2-digit"}); };
const dOf = e => e.d || (e.at ? stamp(e.at) : "");
function calDate(c){
  const f = new Date(c.from + "T12:00:00");
  const opt = {day:"numeric", month:"short"}; if(c.year) opt.year = "numeric";
  if(c.to){ const t = new Date(c.to + "T12:00:00"); return f.getDate() + "–" + t.toLocaleDateString(loc(), opt); }
  return f.toLocaleDateString(loc(), opt);
}
function score(s){
  const p = P();
  let sc = s.importance || 6;
  sc += 3 * s.topics.filter(t => p.topics.includes(t)).length;
  sc += 2 * s.regions.filter(r => p.regions.includes(r)).length;
  const boost = {invest:["Markets","Economy","Energy"], ir:["Geopolitics"], business:["Economy","Energy","Markets"]}[p.reason] || [];
  sc += 3 * s.topics.filter(t => boost.includes(t)).length;
  sc -= 0.8 * (NOW - new Date(lastUpd(s))) / 864e5;
  return sc;
}
const ranked = () => [...STORIES].sort((a,b) => score(b) - score(a));
const refs = a => (a && a.length) ? `<sup class="ref">${a.map(n => `<a href="#" data-src="${n}" aria-label="Source ${n}">${n}</a>`).join(",")}</sup>` : "";
const likKey = l => l === "Likely" ? "likely" : l === "Possible" ? "possible" : "lessLikely";
const likCls = l => l === "Likely" ? "l1" : l === "Possible" ? "l2" : "l3";
const arrow = d => (d === "up" ? "↑ " : d === "down" ? "↓ " : "↕ ") + tr(d);

/* ---------- Data: the bundled archive plus the live newsroom database ---------- */
// The newsroom writes documents to the page's database:
//   stories/<id>  a new story, or changes and dated updates for a story that already exists
//   site/home     newsroom status (last check, items waiting for confirmation, corrections) and the calendar
//   pics/<id>     a picture the owner added to a story
// Times are stored in UTC. Archive times were written in Central European Time.
function iso(x){
  if(!x) return x;
  let v = String(x);
  if(/^\d{4}-\d\d-\d\d$/.test(v)) v += "T12:00:00+01:00";
  else if(/^\d{4}-\d\d-\d\dT\d\d:\d\d(:\d\d)?$/.test(v)) v += (v.length === 16 ? ":00" : "") + "+01:00";
  const d = new Date(v);
  return isNaN(d) ? x : d.toISOString();
}
const TIERS = ["agency","official","intl","national","state","specialist","other"];
const TM_SEED = {};
SEED.forEach(s => {
  ["ev","sh"].forEach(k => { const v = s[k]; if(v && typeof v === "object"){ for(const l in v) if(l !== "en" && v[l]) (TM_SEED[l] = TM_SEED[l] || {})[v.en] = v[l]; s[k] = v.en; } });
  s.date = iso(s.date); s.rev = s.date;
  s.ctx.tl.forEach(e => { if(e.at) e.at = iso(e.at); e.s = e.s || []; });
});
function fixRefs(o, map){
  if(Array.isArray(o)){ o.forEach(x => fixRefs(x, map)); return; }
  if(!o || typeof o !== "object") return;
  for(const k of Object.keys(o)){
    const v = o[k];
    if((k === "s" || k === "is" || k === "ratingSrc") && Array.isArray(v)) o[k] = v.map(x => typeof x === "number" ? x : map[x]).filter(Boolean);
    else if(v && typeof v === "object") fixRefs(v, map);
  }
}
const arr = x => Array.isArray(x) ? x : [];
// Database text is shown as-is, so angle brackets are removed from it first.
const cleanDoc = o => JSON.parse(JSON.stringify(o), (k, v) => typeof v === "string" ? v.replace(/[<>]/g, "") : v);
function buildStories(docs){
  const out = SEED.map(s => JSON.parse(JSON.stringify(s)));
  const idx = Object.fromEntries(out.map(s => [s.id, s]));
  arr(docs).forEach(d0 => {
    try{
      if(!d0 || !d0.id) return;
      const d = cleanDoc(d0);
      let s = idx[d.id];
      if(d.hidden){ if(s){ out.splice(out.indexOf(s), 1); delete idx[d.id]; } return; }
      if(!s){
        if(!d.headline || !d.summary || !d.date) return;   // not a complete story
        s = idx[d.id] = {id:d.id, sources:[], topics:[], regions:[], importance:6, ctx:{tl:[]}};
        out.push(s);
      }
      const map = {};
      Object.keys(d.src || {}).forEach(k => {
        const x = d.src[k]; if(!x || !x.n || !/^https?:\/\/[^\s"'`]+$/.test(String(x.u || ""))) return;
        s.sources.push({n:String(x.n), tier:TIERS.includes(x.tier) ? x.tier : "other", t:String(x.t || x.n), u:String(x.u), pay:!!x.pay});
        map[k] = s.sources.length;
      });
      fixRefs(d, map);
      const upd = arr(d.updates), next = d.next, ctx = d.ctx;
      ["src","sources","updates","next","ctx"].forEach(k => delete d[k]);
      Object.assign(s, d);
      if(ctx && typeof ctx === "object") s.ctx = Object.assign({}, s.ctx, ctx);
      const tl = arr(s.ctx.tl);
      const after = tl.filter(e => e.tag === "after");
      upd.forEach(u => { if(u && u.t && u.at) after.push({tag:"after", at:iso(u.at), d:u.d, t:String(u.t), why:u.why, s:arr(u.s), key:!!u.key, link:u.link, top:!!u.top}); });
      after.sort((a, b) => (a.at || "") < (b.at || "") ? -1 : (a.at || "") > (b.at || "") ? 1 : 0);
      const nxt = Array.isArray(next) ? next.filter(n => n && n.t).map(n => ({tag:"next", d:n.d, t:String(n.t), why:n.why, s:arr(n.s)})) : tl.filter(e => e.tag === "next");
      let past = tl.filter(e => e.tag !== "after" && e.tag !== "next"), since = after;
      // An update marked "top" means the newsroom rewrote the top of the article for that development:
      // it becomes "this story", and everything before it becomes plain history.
      const ti = after.map(e => !!e.top).lastIndexOf(true);
      if(ti >= 0){
        past = past.concat(after.slice(0, ti)).map(e => { const x = Object.assign({}, e); delete x.tag; return x; });
        after[ti].tag = "now";
        since = after.slice(ti);
      }
      s.ctx.tl = past.concat(since, nxt);
    }catch(e){}
  });
  out.forEach(s => {
    s.date = iso(s.date); s.rev = iso(s.rev || s.date);
    s.topics = arr(s.topics).filter(t => TOPICS.includes(t)); if(!s.topics.length) s.topics = ["Geopolitics"];
    s.regions = arr(s.regions).filter(r => REGIONS.includes(r)); if(!s.regions.length) s.regions = ["Global"];
    if(!REGIONS.includes(s.region)) s.region = s.regions[0];
    s.sources = arr(s.sources);
    s.ctx = s.ctx || {}; s.ctx.tl = arr(s.ctx.tl); s.ctx.players = arr(s.ctx.players); s.ctx.is = arr(s.ctx.is);
    s.ctx.tl.forEach(e => { e.s = arr(e.s); });
    s.quiz = arr(s.quiz).filter(q => q && q.q && Array.isArray(q.o) && typeof q.c === "number");
    if(!s.readMin){ const w = [s.summary, s.why].concat(arr(s.event).map(f => f.t), arr(s.background).map(f => f.t), arr(s.chain), arr(s.watch), arr(s.business)).join(" ").split(/\s+/).length; s.readMin = Math.max(2, Math.round(w / 200)); }
  });
  return out;
}
const DBK = "dailybrief.db.v1";
function loadCache(){ try{ return JSON.parse(localStorage.getItem(DBK) || "null") || {}; }catch(e){ return {}; } }
function saveCache(docs, site, pics, extra){ try{ localStorage.setItem(DBK, JSON.stringify(Object.assign({docs, site, pics}, extra || {}))); }catch(e){} }
let dataSig = "", feedStamp = "";
function applyData(docs, site, pics, quiet){
  const sig = JSON.stringify([arr(docs).map(d => [d.id, d.rev, d.hidden]), site && [site.lastCheck, site.lastChange, site.schedule], pics, feedStamp]);
  if(sig === dataSig) return false;
  const before = quiet ? 0 : unreadTotal(), first = !dataSig;
  dataSig = sig;
  STORIES = buildStories(docs);
  byId = Object.fromEntries(STORIES.map(s => [s.id, s]));
  SITE = (site && typeof site === "object") ? cleanDoc(site) : {};
  if(cardsState === "error") cardsState = "idle";
  PICS = (pics && typeof pics === "object") ? pics : {};
  NOW = new Date();
  clearViews();
  if(current) current = byId[current.id] || null;
  if(quiet) return true;
  repaint();
  const news = !first && P().notify && unreadTotal() > before;   // a followed story has news: show it while the app is open
  ensureCards().then(() => {
    if(!news) return;
    const s = (P().following || []).map(id => byId[id]).filter(s => s && unreadIdx(s).length).sort((a, b) => lastUpd(a) < lastUpd(b) ? 1 : -1)[0];
    if(s){ const un = unreadIdx(s); showAlert(tr("updAlert", {h:EV(s)}) + "<br><span style=\"font-weight:400\">" + txStory(s).ctx.tl[un[un.length - 1]].t + "</span>", s.id); }
  });
  return true;
}
let DB = null, PICAPI = null;
function startDB(){
  if(!(window.claude && typeof window.claude.use === "function")){ dbState = "offline"; return; }
  dbState = "loading";
  const cache = loadCache();
  let docs = arr(cache.docs), site = cache.site || {}, pics = cache.pics || {};
  const timer = setTimeout(() => { if(dbState === "loading"){ dbState = "offline"; setHeader(curTab); } }, 10000);
  const fail = () => { clearTimeout(timer); if(dbState !== "live"){ dbState = "offline"; setHeader(curTab); } };
  const got = meta => {
    if(!(meta && meta.fromCache)){ clearTimeout(timer); if(dbState !== "live"){ dbState = "live"; setHeader(curTab); } }
    if(applyData(docs, site, pics)) saveCache(docs, site, pics);
  };
  window.claude.use("db").then(db => {
    if(!db){ fail(); return; }
    DB = db;
    db.collection("stories").orderBy("rev", "desc").limit(80).onSnapshot(snap => {
      docs = snap.docs.map(x => Object.assign({}, x.data(), {id:x.id})); got(snap.metadata);
    }, fail);
    db.doc("site/home").onSnapshot(snap => { site = snap.exists ? snap.data() : {}; got(snap.metadata); }, () => {});
    db.collection("pics").limit(200).onSnapshot(snap => {
      pics = {}; snap.docs.forEach(x => { const v = x.data(); if(v && /^[A-Za-z0-9_-]{8,64}$/.test(String(v.id || ""))) pics[x.id] = {id:v.id, credit:String(v.credit || "")}; }); got(snap.metadata);
    }, () => {});
    window.claude.use("assets").then(a => { PICAPI = a || null; if(PICAPI && current && $("sheet").classList.contains("open")) renderStory(); }).catch(() => {});
  }).catch(fail);
}

/* ---------- Standalone app: the news comes from one file that the newsroom republishes ---------- */
const FEED_URL = "data/news.json";
let feedBusy = false, feedAt = 0;
function feedPics(p){
  const out = {};
  if(p && typeof p === "object") for(const id in p){ const v = p[id]; if(v && /^pics\/[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/i.test(String(v.src || ""))) out[id] = {src:String(v.src), credit:String(v.credit || "").slice(0, 120)}; }
  return out;
}
function useFeed(d, quiet){
  if(!d || typeof d !== "object" || !Array.isArray(d.stories)) return false;
  feedStamp = String(d.generated || "");
  setFeedTM(d.tm);
  return applyData(d.stories, d.site || {}, feedPics(d.pics), quiet);
}
function loadFeed(force){
  if(feedBusy || (!force && Date.now() - feedAt < 60000)) return Promise.resolve();
  feedBusy = true;
  if(dbState !== "live"){ dbState = "loading"; setHeader(curTab); }
  return fetch(FEED_URL + "?t=" + Date.now(), {cache:"no-store"})
    .then(r => { if(!r.ok) throw new Error("feed " + r.status); return r.json(); })
    .then(d => {
      feedBusy = false; feedAt = Date.now(); dbState = "live";
      if(useFeed(d)) saveCache(d.stories, d.site || {}, d.pics || {}, {tm:d.tm || {}, generated:d.generated || ""});
      setHeader(curTab); if(curTab === "settings") renderSettings();
    })
    .catch(() => { feedBusy = false; dbState = "offline"; setHeader(curTab); if(curTab === "settings") renderSettings(); });
}
function startFeed(){
  loadFeed(true);
  setInterval(() => { if(!document.hidden) loadFeed(); }, 10 * 60000);
  if("serviceWorker" in navigator) window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}
const picURL = pic => pic.src ? pic.src : "/_blob/" + pic.id;
const isInstalled = () => { try{ return window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches; }catch(e){ return false; } };
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent || "") || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/* ---------- AI (Claude through the page's "sample" capability) ---------- */
let sampler; // undefined = not resolved yet, null = unavailable
function getSampler(){
  if(sampler !== undefined) return Promise.resolve(sampler);
  try{
    if(window.claude && typeof window.claude.use === "function"){
      return window.claude.use("sample").then(s => (sampler = s || null)).catch(() => (sampler = null));
    }
  }catch(e){}
  sampler = null;
  return Promise.resolve(null);
}
getSampler();

/* ---------- AI translation (string by string, remembered in this browser) ---------- */
// Every English string is translated once and remembered, so an updated story only translates what is new.
const TMK = l => "dailybrief.tm.v1." + l;
let TM = {};
if(typeof TM_PACK !== "undefined") for(const l in TM_PACK) TM_SEED[l] = Object.assign(TM_SEED[l] || {}, TM_PACK[l]);   // translations built into the standalone app
let TM_FEED = {};   // translations that arrive with the news (standalone app)
function setFeedTM(t){ TM_FEED = (t && typeof t === "object") ? t : {}; TM = {}; clearViews(); }
function tm(l){
  if(TM[l]) return TM[l];
  let m = {};
  if(!SA){ try{ m = JSON.parse(localStorage.getItem(TMK(l)) || "{}") || {}; }catch(e){} }
  const feed = {}, f = TM_FEED[l];
  if(f && typeof f === "object") for(const k in f) if(typeof f[k] === "string") feed[k] = f[k].replace(/[<>]/g, "");
  TM[l] = Object.assign({}, TM_SEED[l] || {}, feed, m);
  return TM[l];
}
function tmSave(l){
  const write = () => localStorage.setItem(TMK(l), JSON.stringify(TM[l]));
  try{ write(); }catch(e){
    try{ // storage is full: keep only the strings the app still shows
      const live = new Set(); STORIES.forEach(s => collect(s).forEach(([o, k]) => live.add(o[k]))); collect(SITE).forEach(([o, k]) => live.add(o[k]));
      Object.keys(TM[l]).forEach(k => { if(!live.has(k)) delete TM[l][k]; });
      write();
    }catch(e2){}
  }
}
const TKEYS = new Set(["headline","summary","why","simple","pattern","t","d","name","what","mkts","asset","note","k","v","text","who","desc","q","e","intro","r","ev","sh","label","schedule"]);
const TARR = new Set(["chain","watch","business","o"]);
function collect(obj){
  const out = [];
  (function walk(o){
    if(Array.isArray(o)){ o.forEach(walk); return; }
    if(!o || typeof o !== "object") return;
    for(const key of Object.keys(o)){
      if(key === "sources") continue;
      if(key === "t" && o.from) continue;   // calendar entries: "t" is the topic, not text
      const val = o[key];
      if(typeof val === "string"){ if(TKEYS.has(key) && val.trim()) out.push([o, key]); }
      else if(Array.isArray(val) && TARR.has(key) && val.every(x => typeof x === "string")){ val.forEach((_, i) => out.push([val, i])); }
      else if(val && typeof val === "object") walk(val);
    }
  })(obj);
  return out;
}
var VIEWS = new Map();
function clearViews(){ VIEWS = new Map(); }
// A translated copy of an object for the current language, plus the strings still waiting for a translation.
function view(key, src){
  const l = lang();
  if(l === "en" || !src) return {copy:src, missing:[]};
  const hit = VIEWS.get(key); if(hit && hit.l === l && hit.src === src) return hit;
  const m = tm(l), copy = JSON.parse(JSON.stringify(src)), missing = [];
  collect(copy).forEach(([o, k]) => { const v = o[k], t = m[v]; if(t) o[k] = t; else missing.push(v); });
  const res = {l, src, copy, missing};
  VIEWS.set(key, res); return res;
}
function txStory(s){ return view("s:" + s.id, s).copy; }
const txSite = () => view("site", SITE).copy || {};
const pendingTx = {};
function translateStrings(strs){
  const l = lang();
  if(l === "en" || SA) return Promise.resolve();
  const m = tm(l), pend = pendingTx[l] = pendingTx[l] || new Map();
  const need = [...new Set(strs)].filter(x => x && !m[x]);
  if(!need.length) return Promise.resolve();
  const fresh = need.filter(x => !pend.has(x));
  const waits = [...new Set(need.filter(x => pend.has(x)).map(x => pend.get(x)))];
  if(fresh.length){
    const job = (async () => {
      const smp = await getSampler();
      if(!smp || typeof smp.json !== "function") throw {code:"na"};
      for(let i = 0; i < fresh.length; i += 100){
        const part = fresh.slice(i, i + 100);
        const prompt = `Translate each string in the JSON array below from English into ${LANGS[l].name}, for a news app.
Rules: keep the same order and exactly ${part.length} items; keep the names of people, organisations, places and publications as they are normally written in ${LANGS[l].name}; keep every number, percentage and currency amount exactly; translate dates such as "Late Feb 2026" naturally; keep quotation marks around quotes; do not add or remove information.
Reply with only a JSON array of ${part.length} strings.

${JSON.stringify(part)}`;
        const res = await smp.json(prompt, {modelTier:"quick", cache:{gcTime:86400000}});
        if(!Array.isArray(res) || res.length !== part.length) throw {code:"bad"};
        part.forEach((x, k) => { if(typeof res[k] === "string" && res[k].trim()) m[x] = res[k].replace(/[<>]/g, ""); });
        tmSave(l); clearViews();
      }
    })();
    fresh.forEach(x => pend.set(x, job));
    const fin = () => fresh.forEach(x => { if(pend.get(x) === job) pend.delete(x); });
    job.then(fin, fin);
    waits.push(job);
  }
  return Promise.all(waits).then(() => {});
}
let cardsState = "idle", quizState = "idle";
const H = s => txStory(s).headline;
const SUM = s => txStory(s).summary;
function homeStrings(){
  const out = [];
  STORIES.forEach(s => { out.push(s.sh, s.ev, s.headline, s.summary); s.ctx.tl.forEach(e => { if(e.at && (e.tag === "after" || e.tag === "now")) out.push(e.t); }); });
  (SITE.calendar || []).forEach(c => out.push(c.text));
  out.push(SITE.note, SITE.schedule); (SITE.held || []).forEach(x => out.push(x.t)); (SITE.corrections || []).forEach(x => out.push(x.t));
  return out.filter(x => typeof x === "string" && x.trim());
}
function ensureCards(){   // translate what the home page shows; resolves when it is done, or when it cannot be done
  const l = lang();
  if(l === "en" || SA || cardsState === "na") return Promise.resolve();
  const m = tm(l), need = homeStrings().filter(x => !m[x]);
  if(!need.length) return Promise.resolve();
  cardsState = "loading"; setHeader(curTab);
  return translateStrings(need)
    .then(() => { cardsState = "done"; if(lang() === l) repaint(); })
    .catch(e => { cardsState = (e && e.code === "na") ? "na" : "error"; setHeader(curTab); });
}
const QZ = (id, j) => txStory(byId[id]).quiz[j];
function ensureQuiz(ids){
  const l = lang();
  if(l === "en" || SA || quizState === "loading" || quizState === "na") return;
  const m = tm(l), need = [];
  ids.forEach(id => { const s = byId[id]; if(s) collect({quiz:s.quiz || []}).forEach(([o, k]) => { if(!m[o[k]]) need.push(o[k]); }); });
  if(!need.length) return;
  quizState = "loading"; if(curTab === "quiz") renderQuiz();
  translateStrings(need)
    .then(() => { quizState = "done"; if(curTab === "quiz") renderQuiz(); })
    .catch(e => { quizState = (e && e.code === "na") ? "na" : "error"; if(curTab === "quiz") renderQuiz(); });
}

/* ---------- Updates on followed stories (like unread messages) ---------- */
// An update is a verified "since then" event in a story's context timeline, stamped with the time it came out.
// Updates are the dated items the newsroom added: "since then" items, and a rewritten top ("this story" with a time).
function updIdx(s){ return s.ctx ? s.ctx.tl.map((e,i) => i).filter(i => { const e = s.ctx.tl[i]; return e.at && (e.tag === "after" || e.tag === "now"); }) : []; }
function unreadIdx(s){
  const p = P();
  if(!(p.following || []).includes(s.id)) return [];
  const seen = iso((p.seen || {})[s.id] || s.date);
  return updIdx(s).filter(i => s.ctx.tl[i].at > seen);
}
const unreadTotal = () => (P().following || []).reduce((n, id) => n + (byId[id] ? unreadIdx(byId[id]).length : 0), 0);
function markRead(s){
  const idx = updIdx(s); if(!prefs || !idx.length) return;
  const last = idx.map(i => s.ctx.tl[i].at).sort().pop();
  setPref("seen", Object.assign({}, prefs.seen || {}, {[s.id]: last}));
}
const lastUpd = s => { const u = updIdx(s).map(i => s.ctx.tl[i].at).sort().pop(); return u && u > s.date ? u : s.date; };
const isLive = s => !!s.live && (NOW - new Date(lastUpd(s))) < 24 * 36e5;
const LIVE = () => `<span class="live"><i aria-hidden="true"></i>${tr("live")}</span>`;
const EV = s => txStory(s).ev || SH(s);
const CLOCK = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
function kickerHTML(s, all){
  const tps = all ? s.topics : s.topics.slice(0, 1);
  return `<span class="kicker">${tps.map(t => tr("tp_" + t)).join(" · ")}${s.region ? `<span class="k-reg"> · ${tr("rg_" + s.region)}</span>` : ""}</span>`;
}
const TC = s => `var(--t-${s.topics[0]})`;
const SH = s => txStory(s).sh || H(s);
const ICONS = {
  people:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>',
  ship:'<path d="M2 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/><path d="M4 16l-1-4h18l-1 4"/><path d="M7 12V8h10v4"/><path d="M11 8V5h2v3"/>',
  thermo:'<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 11v6"/>',
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  ballot:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  bank:'<path d="M3 21h18"/><path d="M5 21V11M9.5 21V11M14.5 21V11M19 21V11"/><path d="M2.5 9.5 12 4l9.5 5.5z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  chart:'<path d="M4 20V5"/><path d="M4 20h16"/><path d="m7 15 4-4 3 3 5-6"/>',
  building:'<path d="M3 21h18"/><path d="M6 21V8l6-4 6 4v13"/><path d="M10 21v-5h4v5"/><path d="M9.5 10.5h5"/>',
  shield:'<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/>',
  health:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M9 11h2l1-2 1.5 4 1-2H16"/>',
  chip:'<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  plane:'<path d="M3 13.5 21 5l-5.5 15-3-6.5z"/><path d="M12.5 13.5 21 5"/>',
  factory:'<path d="M3 21V10l6 4v-4l6 4V5h4v16z"/><path d="M8 17.5h2M13 17.5h2"/>',
  bolt:'<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
  leaf:'<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
  scale:'<path d="M12 4v16M7 20h10"/><path d="M5 8h14"/><path d="M5 8l-2.5 6a2.7 2.7 0 0 0 5 0z"/><path d="M19 8l-2.5 6a2.7 2.7 0 0 0 5 0z"/>',
  coin:'<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.3c-.6-.9-1.6-1.3-2.8-1.3-1.7 0-2.8.8-2.8 2s1 1.7 2.8 2 2.8.8 2.8 2-1.1 2-2.8 2c-1.2 0-2.3-.5-2.9-1.4"/><path d="M12 6.300v11.4"/>',
  handshake:'<path d="M3 11.5 7 7.500l4 1.5 3-1.5 3 0 4 4"/><path d="m7 13.5 3.5 3.500a1.5 1.5 0 0 0 2.1 0L17 12.5"/><path d="M3 11.5 6 15M21 11.5 18 15"/>',
  megaphone:'<path d="M4 10v4l3 .5V9.500z"/><path d="M7 9.5 18 5v14L7 14.5"/><path d="M9 15v3.500h3V16"/>',
  flag:'<path d="M5 21V4"/><path d="M5 5h12l-2.5 4L17 13H5"/>',
  satellite:'<path d="m6 9 3-3 4 4-3 3z"/><path d="m11 14 3-3 4 4-3 3z"/><path d="m4 7 2-2M17 20l2-2"/><path d="M8.5 15.500a4 4 0 0 0 4 4"/>',
  wheat:'<path d="M12 21V8"/><path d="M12 8c0-2.5 1-4 0-5-1 1 0 2.5 0 5z"/><path d="M12 12c-2.5 0-4-1.5-4.5-3.5 2.5 0 4 1 4.5 3.500zM12 12c2.5 0 4-1.5 4.5-3.5-2.5 0-4 1-4.5 3.500zM12 16.500c-2.5 0-4-1.5-4.5-3.5 2.5 0 4 1 4.5 3.500zM12 16.500c2.5 0 4-1.5 4.5-3.5-2.5 0-4 1-4.5 3.500z"/>',
  house:'<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/>',
  car:'<path d="M4 16v-3l2-5h12l2 5v3"/><path d="M3 16h18v2H3z"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/><path d="M6.5 12h11"/>',
  storm:'<path d="M7 15a4.5 4.5 0 0 1 .5-9 5.5 5.5 0 0 1 10.5 1.500A3.8 3.8 0 0 1 17.5 15"/><path d="m12 13-2 4h3l-1.5 4"/>',
  flame:'<path d="M12 21c-3.5 0-6-2.5-6-6 0-3 2-5 3.5-7 .5 2 1.5 3 2.5 3 0-3 1-6 3-8 0 4 3 6 3 11 0 4-2.5 7-6 7z"/>',
  court:'<path d="M4 20h16M6 20v-8M10 20v-8M14 20v-8M18 20v-8M3 12h18M12 4l9 5H3z"/>',
  rocket:'<path d="M12 3c3 2 4.5 5.5 4.5 9l-2 3h-5l-2-3C7.5 8.5 9 5 12 3z"/><circle cx="12" cy="9.5" r="1.5"/><path d="M9.5 15 8 20l4-2 4 2-1.5-5"/>',
  book:'<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>'
};
const TOPIC_ICON = {Geopolitics:"globe", Politics:"building", Economy:"chart", Markets:"chart", Energy:"bolt", Climate:"leaf"};
const ICON = (s, n, w) => `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[s.icon] || ICONS[TOPIC_ICON[s.topics[0]]] || ICONS.globe}</svg>`;
const GLOBE = '<svg class="g" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>';
const CHEVD = '<svg class="c" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

/* ---------- Home ---------- */
function folCard(s){
  const st = txStory(s), un = unreadIdx(s);
  const tl = (st.ctx || s.ctx || {tl:[]}).tl;
  const last = un[un.length - 1];
  return `<div class="fol-card ${un.length ? "has-new" : "quiet"}" role="button" tabindex="0" data-open="${s.id}" style="--tc:${TC(s)}">
    <div class="fol-head"><span class="fol-ic">${ICON(s, 20)}</span>
      <div class="fol-t"><b class="fol-ev">${EV(s)}</b>${isLive(s) || un.length ? `<span class="fol-meta">${isLive(s) ? LIVE() : ""}${un.length ? `<span class="fol-new">${tr(un.length === 1 ? "nNew1" : "nNew", {n:un.length})}</span>` : ""}</span>` : ""}</div>
      ${un.length ? "" : `<span class="fol-ok">${tr("updUpToDate")}</span>`}
      <svg class="go" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></div>
    ${un.length ? `<div class="fol-bub" aria-label="${esc(tr("updNew"))}"><b>${when(s.ctx.tl[last].at)}</b><span>${tl[last].t}</span></div>` : ""}
  </div>`;
}
function tileHTML(s, shade){
  const tc = shade ? `color-mix(in srgb, ${TC(s)} 76%, #000)` : TC(s), pic = PICS[s.id];
  return `<article class="tile" role="button" tabindex="0" data-open="${s.id}" style="--tc:${tc}">
    <div class="tile-pic">${pic ? `<img class="tile-img" src="${esc(picURL(pic))}" alt="" loading="lazy">` : ICON(s, 54, 1.4)}${isLive(s) ? LIVE() : ""}</div>
    <div class="tile-body"><span class="tile-k">${tr("tp_" + s.topics[0])} · ${tr("rg_" + s.region)}</span><h3 class="tile-h">${SH(s)}</h3></div>
    <div class="tile-foot"><span>${when(s.date)}</span><span>${CHECK}${tr("srcCount", {n:s.sources.length})}</span></div>
  </article>`;
}
function sqHTML(s, wide){
  return `<article class="sq${wide ? " wide" : ""}" role="button" tabindex="0" data-open="${s.id}" style="--tc:${TC(s)}">
    <div class="sq-top"><span>${tr("tp_" + s.topics[0])}</span>${isLive(s) ? LIVE() : ""}</div>
    <h3 class="sq-h">${SH(s)}</h3>
    <span class="sq-foot">${when(s.date)}</span>
  </article>`;
}
const sqGrid = list => `<div class="sq-grid">${list.map((s, i) => sqHTML(s, list.length % 2 === 1 && i === list.length - 1)).join("")}</div>`;
const secHead = (t, right) => `<div class="sec-head"><h2 class="sec-title">${t}</h2>${right || ""}</div>`;
function wlCard(a){
  const hits = STORIES.flatMap(s => arr(s.impact).filter(x => x.a === a).map(x => ({s, x})));
  const seen = new Set();
  const rows = hits.filter(h => !seen.has(h.s.id) && seen.add(h.s.id));
  return `<div class="wl-card"><div class="wl-top"><b>${tr("as_" + a)}</b><span class="meta">${rows.length}</span></div>
    ${rows.length ? rows.map(h => `<button class="wl-hit" data-open="${h.s.id}"><span class="dir ${h.x.dir}">${h.x.dir === "up" ? "↑" : h.x.dir === "down" ? "↓" : "↕"}</span><span>${H(h.s)}</span></button>`).join("") : `<p class="note" style="margin:6px 0 0">${tr("noHits")}</p>`}
  </div>`;
}
function renderModeChips(el, active, onPick){
  el.innerHTML = MODE_ORDER.map(m => `<button class="chip" data-mode="${m}" aria-pressed="${m === active}">${tr("m_" + m)}</button>`).join("");
  el.onclick = e => { const b = e.target.closest("[data-mode]"); if(b) onPick(b.dataset.mode); };
}
let homeTopic = "all", homeRegion = "all";
function renderFilters(){
  const el = $("homeFilters");
  const rOn = homeRegion !== "all";
  el.innerHTML = `<div class="frow" role="group" aria-label="${esc(tr("fTopics"))}">
    <button class="fchip" data-ft="all" aria-pressed="${homeTopic === "all"}">${tr("fAll")}</button>
    <label class="fsel${rOn ? " on" : ""}"><span class="sr">${tr("fRegions")}</span>${GLOBE}<select id="regionSel">
      <option value="all"${rOn ? "" : " selected"}>${tr("fAllReg")}</option>
      ${REGIONS.map(r => `<option value="${r}"${homeRegion === r ? " selected" : ""}>${tr("rg_" + r)}</option>`).join("")}</select>${CHEVD}</label>
    ${TOPICS.map(t => `<button class="fchip" data-ft="${t}" aria-pressed="${homeTopic === t}" style="--tc:var(--t-${t})"><span class="dot" aria-hidden="true"></span>${tr("tp_" + t)}</button>`).join("")}
  </div>`;
  el.onclick = e => { const t = e.target.closest("[data-ft]"); if(!t) return; homeTopic = t.dataset.ft; renderFilters(); renderHome(); };
  $("regionSel").onchange = e => { homeRegion = e.target.value; if(homeTopic === "everything") homeTopic = "all"; renderFilters(); renderHome(); };
}
function renderHome(){
  const p = P();
  if(homeTopic !== "all" || homeRegion !== "all"){
    const every = homeTopic === "everything";
    const list = STORIES.filter(s => every || ((homeTopic === "all" || s.topics.includes(homeTopic)) && (homeRegion === "all" || s.regions.includes(homeRegion))))
      .sort((a,b) => new Date(b.date) - new Date(a.date));
    const title = every ? tr("allStories") : [homeTopic !== "all" ? tr("tp_" + homeTopic) : "", homeRegion !== "all" ? tr("rg_" + homeRegion) : ""].filter(Boolean).join(" · ");
    $("page-home").innerHTML = secHead(title, `<span class="meta">${list.length}</span>`) + (list.length
      ? sqGrid(list)
      : `<div class="empty"><b>${tr("fEmpty")}</b><p>${tr("fEmptyS")}</p><button class="link-btn" id="fClear">${tr("fClear")}</button></div>`);
    const fc = $("fClear"); if(fc) fc.onclick = () => { homeTopic = "all"; homeRegion = "all"; renderFilters(); renderHome(); };
    return;
  }
  const top = ranked().slice(0,3);
  const rest = STORIES.filter(s => !top.includes(s)).sort((a,b) => new Date(b.date) - new Date(a.date));
  const fol = (p.following || []).map(id => byId[id]).filter(Boolean)
    .sort((a,b) => unreadIdx(b).length - unreadIdx(a).length);
  let h = !top.length ? "" : secHead(tr("top3"), `<span class="meta" id="impPos">1 / ${top.length}</span>`)
    + `<div class="tiles" id="impRow">${top.map((s,i) => tileHTML(s, i > 0 && top[i-1].topics[0] === s.topics[0])).join("")}</div>`
    + `<div class="dots" aria-hidden="true">${top.map((s,i) => `<i class="${i ? "" : "on"}" style="--tc:${TC(s)}"></i>`).join("")}</div>`;
  if(SA && !isInstalled() && !p.instSeen) h = `<div class="inst" id="instHint"><div><b>${tr("instTitle")}</b><span>${tr(isIOS() ? "instShortI" : "instShortA")}</span></div><button class="x" id="instX" aria-label="${esc(tr("close"))}">×</button></div>` + h;
  if(fol.length) h += secHead(tr("followingSec")) + `<div class="fol">${fol.map(folCard).join("")}</div>`;
  if(rest.length) h += secHead(tr("latest"), rest.length > 8 ? `<button class="link-btn sm" id="seeAll">${tr("seeAll", {n:STORIES.length})}</button>` : "") + sqGrid(rest.slice(0, 8));
  if((p.watch || []).length) h += secHead(tr("watchlist"), `<button class="link-btn" data-goto="watch">${tr("edit")}</button>`) + `<div class="wl">${p.watch.map(wlCard).join("")}</div>`;
  const today = dayStart(NOW).getTime();
  const cal = (arr(SITE.calendar).length ? arr(txSite().calendar) : CALENDAR)
    .filter(c => c && /^\d{4}-\d\d-\d\d$/.test(c.from || "") && (c.text || c.k) && new Date((c.to || c.from) + "T23:59:59").getTime() >= today)
    .sort((a, b) => a.from < b.from ? -1 : 1).slice(0, 6);
  if(cal.length) h += secHead(tr("comingUp")) + `<div class="cal">${cal.map(c => `<div class="cal-row" style="--tc:var(--t-${TOPICS.includes(c.t) ? c.t : "Economy"})"><b>${calDate(c)}</b><span>${c.text || tr(c.k)}</span></div>`).join("")}</div>`;
  $("page-home").innerHTML = h;
  const ix = $("instX"); if(ix) ix.onclick = () => { setPref("instSeen", true); renderHome(); };
  const sa = $("seeAll"); if(sa) sa.onclick = () => { homeTopic = "everything"; homeRegion = "all"; renderFilters(); renderHome(); window.scrollTo(0, 0); };
  const row = $("impRow"), dots = document.querySelectorAll(".dots i");
  if(row) row.onscroll = () => {
    const tiles = [...row.children], x = row.scrollLeft;
    let k = 0; tiles.forEach((t, i) => { if(Math.abs(t.offsetLeft - row.offsetLeft - 20 - x) < Math.abs(tiles[k].offsetLeft - row.offsetLeft - 20 - x)) k = i; });
    dots.forEach((d, i) => d.classList.toggle("on", i === k));
    $("impPos").textContent = `${k + 1} / ${tiles.length}`;
  };
}

/* ---------- Story ---------- */
let current = null, storyMode = "essentials", showOrig = false, storyTxState = "idle", storyView = "news", ctxFilter = "key", freshIdx = [], srcOpen = false;
function S(){ const l = lang(); if(l === "en" || showOrig) return current; return txStory(current); }
const hasCtx = s => !!(s.ctx && (s.ctx.intro || s.ctx.tl.length));
// "Effects" is the short list in the one-minute summary: who or what the news changes, and how.
const effectsOf = s => arr(s.effects).length ? arr(s.effects).filter(x => x && (x.t || x.label)) : arr(s.impact).slice(0, 3).map(x => ({label:x.asset, dir:x.dir, t:x.note}));
const NEEDS = {summary:"summary", simple:"simple", why:"why", what:"event", background:"background", bgFull:"background", chain:"chain", story:"story", connected:"connected", next:"scenarios", scenarios:"scenarios", scenariosM:"scenarios", impact:"impact", watch:"watch", business:"business", terms:"terms"};
function hasSec(k, s){
  if(k === "effects") return effectsOf(s).length > 0;
  if(k === "persp") return !!(s.persp && arr(s.persp.items).length);
  const v = s[NEEDS[k]];
  return Array.isArray(v) ? v.length > 0 : !!v;
}
function secList(s){
  let secs = storyView === "full" ? ALL_SECTIONS : (MODE_SECTIONS[storyMode] || MODE_SECTIONS.essentials);
  if(storyView === "full") secs = secs.filter(k => k !== "effects" || arr(current.effects).length);
  else if(storyMode === "learn" && !s.simple) secs = ["summary"].concat(secs);
  return secs.filter(k => hasSec(k, s));
}
function blk(title, inner, analysis){ return `<section class="blk"><h3>${title}${analysis ? `<span class="tag-a">${tr("analysis")}</span>` : ""}</h3>${inner}</section>`; }
const facts = arr => `<ul class="facts">${arr.map(f => `<li>${f.t}${refs(f.s)}</li>`).join("")}</ul>`;
function scenariosHTML(s, withMarkets){
  return `<div class="stack">${s.scenarios.map(x => `<div class="scn">
      <div class="scn-head"><span class="pill ${likCls(x.lik)}">${tr(likKey(x.lik))}</span>${x.name}</div>
      <p>${x.what}</p>
      ${withMarkets ? `<p class="mk"><b>${tr("marketsLbl")}</b> ${x.mkts}</p>` : ""}
    </div>`).join("")}</div>`;
}
function perspHTML(s){
  const pv = s.persp; if(!pv) return "";
  const intro = `<p class="pv-intro">${tr(I18N.en["cov_" + pv.type] ? "cov_" + pv.type : "cov_national")}${pv.ratingSrc ? refs(pv.ratingSrc) : ""}</p>`;
  const items = pv.items.map(it => {
    const head = it.lean
      ? `<span class="pv-name">${it.outlet}</span>${I18N.en["lean_" + it.lean] ? `<span class="lean ${it.lean}">${tr("lean_" + it.lean)}</span>` : ""}`
      : `<b>${it.who}</b><span class="pv-outlet">${it.outlet}</span>${it.state ? `<span class="lean state">${tr("stateMedia")}</span>` : ""}`;
    const who2 = (it.lean && it.who) ? `<div class="pv-desc">${it.who}</div>` : "";
    return `<div class="pv"><div class="pv-head">${head}</div>${it.desc ? `<div class="pv-desc">${it.desc}</div>` : who2}<p>${it.text}${refs(it.s)}</p></div>`;
  }).join("");
  return blk(tr("secCovered"), intro + `<div class="stack">${items}</div>`);
}
const SECTION = {
  summary: s => `<p class="lede">${s.summary}</p>`,
  simple: s => blk(tr("secPlain"), `<p class="lede" style="margin-top:0">${s.simple}</p>`),
  why: s => blk(tr("secWhy"), `<p style="margin:0">${s.why}</p>`),
  effects: s => blk(tr("secEffects"), `<div class="stack">${effectsOf(s).map(x => `<div class="imp"><div class="imp-l">${x.label ? `<b>${x.label}</b>` : ""}<span>${x.t || ""}${refs(x.s)}</span></div>${["up","down","mixed"].includes(x.dir) ? `<span class="dir ${x.dir}">${arrow(x.dir)}</span>` : ""}</div>`).join("")}</div>`, true),
  what: s => blk(tr("secWhat"), facts(s.event)),
  background: s => blk(tr("secBg"), facts(s.background)),
  bgFull: s => blk(tr("secBg"), facts(s.background) + `${s.pattern ? `<div class="pattern"><b>${tr("pattern")}</b>${s.pattern}</div>` : ""}
      ${current && hasCtx(current) ? `<button class="link-btn sm" data-view="ctx" style="margin-top:10px">${tr("ctxHintBtn")} →</button>` : ""}`),
  chain: s => blk(tr("secChain"), `<ol class="chain">${s.chain.map(c => `<li>${c}</li>`).join("")}</ol>`, true),
  story: s => blk(tr("secStory"), `<div class="tl">${s.story.map(x => `<div class="tl-item"><div class="tl-date">${x.d}</div><p>${x.t}${refs(x.s)}</p></div>`).join("")}</div>
      ${s.pattern ? `<div class="pattern"><b>${tr("pattern")}</b>${s.pattern}</div>` : ""}
      ${current && hasCtx(current) ? `<button class="link-btn sm" data-view="ctx" style="margin-top:10px">${tr("ctxHintBtn")} →</button>` : ""}`),
  persp: s => perspHTML(s),
  connected: s => blk(tr("secConn"), `<div class="stack">${s.connected.map(c => c.link
      ? `<button class="conn" data-open="${c.link}"><span>${c.t}${refs(c.s)}</span><span class="go" aria-hidden="true">→</span></button>`
      : `<div class="conn static"><span>${c.t}${refs(c.s)}</span></div>`).join("")}</div>`),
  next: s => blk(tr("secNext"), scenariosHTML(s, false), true),
  scenarios: s => blk(tr("secNext"), scenariosHTML(s, false), true),
  scenariosM: s => blk(tr("secNext"), scenariosHTML(s, true) + `<p class="note">${tr("notAdvice")}</p>`, true),
  impact: s => blk(tr("secImpact"), `<div class="stack">${s.impact.map(x => `<div class="imp"><div class="imp-l"><b>${x.asset}</b><span>${x.note}</span></div><span class="dir ${x.dir}">${arrow(x.dir)}</span></div>`).join("")}</div><p class="note">${tr("notAdvice")}</p>`, true),
  watch: s => blk(tr("secWatch"), `<ul class="facts">${s.watch.map(w => `<li>${w}</li>`).join("")}</ul>`),
  business: s => blk(tr("secBiz"), `<ul class="facts">${s.business.map(w => `<li>${w}</li>`).join("")}</ul>`, true),
  terms: s => blk(tr("secTerms"), `<dl class="terms">${s.terms.map(x => `<div><dt>${x.k}</dt><dd>${x.v}</dd></div>`).join("")}</dl>`),
  sources: s => blk(tr("secSources"), srcListHTML(s))
};
function srcListHTML(s){ return `<p class="pv-intro">${tr("srcIntro")}</p><ol class="src">${s.sources.map((x,i) => `<li id="src-${i+1}">
      <div class="src-head"><span class="pub">${x.n}</span><span class="tier ${x.tier}">${tr("tier_" + x.tier)}</span>${x.pay ? `<span class="tier pay">🔒 ${tr("paywall")}</span>` : ""}</div>
      <a href="${x.u}" target="_blank" rel="noopener noreferrer">${x.t}</a></li>`).join("")}</ol>`; }
const CHEV = `<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
const srcBase = n => n.split(/ \(| via | – | - /)[0].trim();
function initials(n){
  const b = srcBase(n);
  if(/^[A-Z0-9&]{2,4}$/.test(b)) return b;
  if(/^[A-Z]{5,}$/.test(b)) return b.slice(0, 2);
  const w = b.replace(/\.(com|org|net)$/i, "").split(/[\s-]+/).filter(x => x && !/^(the|of|de|del|la|le|du|des|and|y|et|für)$/i.test(x));
  return (w.length === 1 ? w[0][0] : w.slice(0, 3).map(x => x[0]).join("")).toUpperCase();
}
function srcAvatars(s){
  const seen = [];
  for(const x of s.sources){ const b = srcBase(x.n); if(!seen.some(y => srcBase(y.n) === b)) seen.push(x); if(seen.length === 3) break; }
  return seen.map(x => `<i title="${esc(srcBase(x.n))}">${initials(x.n)}</i>`).join("");
}
function srcBlock(s){
  return `<section class="src-wrap">
    <button class="src-pill" id="srcToggle" aria-expanded="${srcOpen}" aria-controls="srcList" aria-label="${esc(srcOpen ? tr("hideSources") : tr("showSources", {n:s.sources.length}))}">
      <span class="src-av" aria-hidden="true">${srcAvatars(s)}</span><span>${tr("srcCount", {n:s.sources.length})}</span>${CHEV}</button>
    <div id="srcList" class="src-list"${srcOpen ? "" : " hidden"}>${srcListHTML(s)}</div></section>`;
}
function setSrc(open){
  srcOpen = open;
  const b = $("srcToggle"), l = $("srcList"); if(!b || !l) return;
  l.hidden = !open; b.setAttribute("aria-expanded", open);
  b.setAttribute("aria-label", open ? tr("hideSources") : tr("showSources", {n:S().sources.length}));
}
function updBlock(s){
  const tl = (s.ctx || current.ctx).tl;
  return `<section class="upd" aria-label="${esc(tr("updNew"))}">
    <div class="upd-head"><span class="udot" aria-hidden="true"></span><b>${tr("updNew")}</b><span class="unread">${freshIdx.length}</span></div>
    <ol class="ctl">${freshIdx.filter(i => tl[i]).map(i => `<li class="ctl-item after"><div class="ctl-date">${dOf(tl[i])}</div><p>${tl[i].t}${refs(tl[i].s)}</p>${tl[i].why ? `<p class="ctl-why">${tl[i].why}</p>` : ""}</li>`).join("")}</ol>
    <div class="upd-foot"><span class="meta">${CHECK} ${tr("updRead")}</span><button class="link-btn sm" data-view="ctx">${tr("ctxHintBtn")} →</button></div>
  </section>`;
}
// For every reader: what was added in the last 48 hours, so the one-minute summary is never behind the news.
function latestBlock(s){
  const raw = current.ctx.tl, tl = (s.ctx || current.ctx).tl;
  const idx = raw.map((e, i) => i).filter(i => raw[i].tag === "after" && raw[i].at && (NOW - new Date(raw[i].at)) < 48 * 36e5).slice(-2).reverse();
  if(!idx.length) return "";
  return `<section class="upd latest" aria-label="${esc(tr("updLatest"))}">
    <div class="upd-head"><span class="udot" aria-hidden="true"></span><b>${tr("updLatest")}</b></div>
    <ol class="ctl">${idx.filter(i => tl[i]).map(i => `<li class="ctl-item after"><div class="ctl-date">${dOf(tl[i])}</div><p>${tl[i].t}${refs(tl[i].s)}</p>${tl[i].why ? `<p class="ctl-why">${tl[i].why}</p>` : ""}</li>`).join("")}</ol>
  </section>`;
}
/* ---------- Context view ---------- */
function ctxYear(c){ for(const e of c.tl){ const m = String(e.d || e.at || "").match(/\d{4}/); if(m) return m[0]; } return ""; }
function ctxTag(e){
  if(e.tag === "now") return `<span class="ctl-tag now">${tr("tagNow")}</span>`;
  if(e.tag === "after") return `<span class="ctl-tag after">${tr("tagAfter")}</span>`;
  if(e.tag === "next") return `<span class="ctl-tag next">${tr("tagNext")}</span>`;
  if(e.key) return `<span class="ctl-tag key">${tr("tagKey")}</span>`;
  return "";
}
function ctxHTML(s){
  const c = s.ctx || current.ctx;
  const items = ctxFilter === "key" ? c.tl.filter(e => e.key || e.tag) : c.tl;
  const tl = items.map(e => `<li class="ctl-item${e.key ? " key" : ""}${e.tag ? " " + e.tag : ""}">
      <div class="ctl-date">${dOf(e)}${ctxTag(e)}</div>
      <p>${e.t}${refs(e.s)}</p>
      ${e.why ? `<p class="ctl-why">${e.why}</p>` : ""}
      ${e.link && byId[e.link] ? `<button class="ctl-link" data-open="${e.link}"><span>${tr("ctxRelated")}: ${H(byId[e.link])}</span><span class="go" aria-hidden="true">→</span></button>` : ""}
    </li>`).join("");
  return `${c.intro ? `<section class="blk"><h3>${tr("ctx30")}</h3><p class="lede" style="margin-top:0">${c.intro}${refs(c.is)}</p></section>` : ""}
    ${s.why ? `<section class="blk"><h3>${tr("ctxWhyNow")}</h3><p style="margin:0">${s.why}</p></section>` : ""}
    ${c.players.length ? `<section class="blk"><h3>${tr("ctxWho")}</h3><div class="who">${c.players.map(p => `<div class="who-card"><b>${p.n}</b><span>${p.r}${refs(p.s)}</span></div>`).join("")}</div></section>` : ""}
    <section class="blk"><div class="ctl-head"><h3>${tr("ctxHow")}</h3>
      <div class="seg sm" role="group" aria-label="${esc(tr("ctxHow"))}"><button data-cf="key" aria-pressed="${ctxFilter === "key"}">${tr("ctxKey")}</button><button data-cf="all" aria-pressed="${ctxFilter === "all"}">${tr("ctxAll")}</button></div></div>
      <p class="meta" style="margin:0 0 14px">${tr("ctxCount", {n:c.tl.length, y:ctxYear(c)})}. ${tr("ctxSrcNote")}</p>
      <ol class="ctl">${tl}</ol></section>
    ${hasSec("terms", s) ? SECTION.terms(s) : ""}
    <section class="blk ctx-actions">${SA ? "" : `<button class="btn dark" id="ctxAsk">${tr("ctxAsk")}</button>`}<button class="link-btn" data-view="news">← ${tr("ctxBack")}</button></section>
    ${srcBlock(s)}`;
}
function setView(v){
  storyView = v;
  if(v === "ctx" && prefs && !prefs.ctxSeen) setPref("ctxSeen", true);
  renderStory(); $("sheet").scrollTop = 0;
}
function trBar(){
  if(lang() === "en") return "";
  if(SA && !showOrig && view("s:" + current.id, current).missing.length) return `<div class="tr-bar">${tr("trPart")}</div>`;
  if(showOrig) return `<div class="tr-bar"><button class="link-btn sm" id="trToggle">${tr("showTranslation")}</button></div>`;
  if(storyTxState === "loading") return `<div class="tr-bar"><span class="spin" aria-hidden="true"></span>${tr("translating")}</div>`;
  if(storyTxState === "na" || storyTxState === "error") return `<div class="tr-bar">${tr("trNA")}</div>`;
  return `<div class="tr-bar">${tr("trNote")} <button class="link-btn sm" id="trToggle">${tr("showOriginal")}</button></div>`;
}
function renderStory(){
  const s = S();
  const following = (P().following || []).includes(current.id);
  const last = lastUpd(current), updated = last !== current.date;
  const ctxOn = hasCtx(current), pic = PICS[current.id];
  if(storyView === "ctx" && !ctxOn) storyView = "news";
  const body = storyView === "ctx" ? "" : secList(s).map(k => SECTION[k](s)).join("");
  const mins = storyView === "ctx" ? current.readMin : Math.max(1, Math.round(body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 230));
  const corr = arr(s.corrections).filter(x => x && x.t);
  $("storyBody").innerHTML = `
    <div class="kicker-row" style="--tc:${TC(current)}">${isLive(current) ? LIVE() : ""}${kickerHTML(current, true)}</div>
    <h1 class="s-head">${s.headline}</h1>
    ${updated ? `<p class="upd-line">${CLOCK}${tr("updLabel", {w:whenAt(last, true)})}</p>` : ""}
    <div class="s-meta-row"><div class="meta">${tr("pubLabel", {w:whenAt(current.date, !updated)})} · ${tr("minRead", {n:mins})}</div>
      <button class="follow" id="followBtn" aria-pressed="${following}">${following ? CHECK + tr("followingBtn") : "+ " + tr("follow")}</button></div>
    ${pic ? `<figure class="hero"><img src="${esc(picURL(pic))}" alt="">${pic.credit ? `<figcaption>${esc(pic.credit)}</figcaption>` : ""}</figure>` : ""}
    ${PICAPI && DB ? `<details class="pic-tools"><summary>${tr(pic ? "picChange" : "picAdd")}</summary>
      <p class="note" style="margin-top:6px">${tr("picNote")}</p>
      <input type="file" id="picFile" accept="image/*" aria-label="${esc(tr("picAdd"))}">
      <label class="sr" for="picCredit">${tr("picCredit")}</label><input type="text" id="picCredit" maxlength="120" placeholder="${esc(tr("picCredit"))}" value="${pic ? esc(pic.credit) : ""}">
      <div class="pic-row"><button class="btn dark" id="picSave">${tr("picSave")}</button>${pic ? `<button class="link-btn sm" id="picDel">${tr("picRemove")}</button>` : ""}</div>
      <p class="note" id="picMsg" hidden></p></details>` : ""}
    <div class="seg view-tabs" role="tablist" aria-label="${esc([ctxOn ? tr("tabCtx") : "", tr("tabNews"), tr("tabFull")].filter(Boolean).join(" / "))}">
      ${ctxOn ? `<button role="tab" data-view="ctx" aria-selected="${storyView === "ctx"}">${tr("tabCtx")}</button>` : ""}
      <button role="tab" data-view="news" aria-selected="${storyView === "news"}">${tr("tabNews")}</button>
      <button role="tab" data-view="full" aria-selected="${storyView === "full"}">${tr("tabFull")}</button></div>
    ${trBar()}
    <details class="verify"><summary>${CHECK}${tr("verified", {n:s.sources.length})}</summary><p>${tr("verifyText")}</p></details>
    ${storyView === "ctx" ? ctxHTML(s) : `
    ${storyView === "news" ? (freshIdx.length ? updBlock(s) : latestBlock(s)) : ""}
    ${storyView === "news" && ctxOn && !P().ctxSeen && !freshIdx.length ? `<button class="ctx-hint" data-view="ctx"><span>${tr("ctxHint")}</span><b>${tr("ctxHintBtn")} →</b></button>` : ""}
    ${body}`}
    ${corr.length ? `<section class="blk corr"><h3>${tr("nrCorr")}</h3><ul class="facts">${corr.map(x => `<li>${x.at ? `<b>${whenAt(iso(x.at))}</b> · ` : ""}${x.t}</li>`).join("")}</ul></section>` : ""}
    ${srcBlock(s)}
    <section class="blk report">
      <button class="link-btn" id="reportBtn">${tr("report")}</button>
      <div id="reportBox" hidden>
        <label for="reportText" class="meta">${tr("reportQ")}</label>
        <textarea id="reportText" placeholder="${esc(tr("reportPh"))}"></textarea>
        ${SA ? `<p class="note" style="margin-top:6px">${tr("reportHow")}</p>` : ""}
        <button class="btn dark" id="reportSend" style="margin-top:8px">${tr("reportSend")}</button>
      </div>
      <p id="reportDone" class="note" hidden>${tr("reportDone")}</p>
    </section>`;
  const ca = $("ctxAsk"); if(ca) ca.onclick = openChat;
  $("srcToggle").onclick = () => setSrc(!srcOpen);
  $("storyBody").onclick = e => {
    const v = e.target.closest("[data-view]"); if(v){ setView(v.dataset.view); return; }
    const f = e.target.closest("[data-cf]"); if(f){ ctxFilter = f.dataset.cf; renderStory(); }
  };
  $("reportBtn").onclick = () => { $("reportBox").hidden = false; $("reportText").focus(); };
  $("reportSend").onclick = () => {
    const text = $("reportText").value.trim(); if(!text) return;
    const done = (ok, key) => { $("reportBox").hidden = true; $("reportBtn").hidden = true; const d = $("reportDone"); d.textContent = tr(key || (ok ? "reportDone" : "reportFail")); d.hidden = false; };
    if(SA){
      const msg = tr("reportMsg", {h:H(current)}) + "\n\n" + text.slice(0, 1000) + "\n\n" + location.href.split("#")[0];
      const copy = () => { try{ navigator.clipboard.writeText(msg).then(() => done(true, "reportCopied"), () => done(false)); }catch(e){ done(false); } };
      if(navigator.share) navigator.share({text:msg}).then(() => done(true), e => { if(!e || e.name !== "AbortError") copy(); });
      else copy();
      return;
    }
    if(!DB){ done(false); return; }
    DB.collection("reports").add({story:current.id, headline:current.headline, text:text.slice(0, 1000), lang:lang(), at:new Date().toISOString(), status:"new"}).then(() => done(true), () => done(false));
  };
  const ps = $("picSave"); if(ps) ps.onclick = () => savePicture(current.id);
  const pd = $("picDel"); if(pd) pd.onclick = () => removePicture(current.id);
  $("followBtn").onclick = toggleFollow;
  const tt = $("trToggle"); if(tt) tt.onclick = () => { showOrig = !showOrig; renderStory(); };
}
/* ---------- Pictures (added by the owner; stored with the app) ---------- */
function picMsg(k){ const m = $("picMsg"); if(m){ m.textContent = k ? tr(k) : ""; m.hidden = !k; } }
function shrink(file){   // resize to at most 1600 px wide and re-encode as JPEG, so pictures stay light
  return new Promise((ok, no) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1600 / img.naturalWidth), c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(b => b ? ok(b) : no(new Error("encode")), "image/jpeg", 0.84);
    };
    img.onerror = () => { URL.revokeObjectURL(url); no(new Error("image")); };
    img.src = url;
  });
}
let picBusy = false;
async function savePicture(id){
  if(picBusy || !PICAPI || !DB) return;
  const f = $("picFile").files && $("picFile").files[0], credit = $("picCredit").value.trim().slice(0, 120), old = PICS[id];
  if(!f && !old){ picMsg("picPick"); return; }
  picBusy = true; picMsg("picWorking");
  try{
    let pid = old && old.id;
    if(f){ const res = await PICAPI.upload(await shrink(f), {type:"image/jpeg"}); pid = res.id; }
    await DB.doc("pics/" + id).set({id:pid, credit, at:new Date().toISOString()});
    if(f && old && old.id !== pid){ try{ await PICAPI.delete(old.id); }catch(e){} }
    PICS = Object.assign({}, PICS, {[id]:{id:pid, credit}});
    picBusy = false;
    if(current && current.id === id) renderStory();
  }catch(e){ picBusy = false; picMsg("picFail"); }
}
async function removePicture(id){
  const old = PICS[id]; if(picBusy || !old || !PICAPI || !DB) return;
  picBusy = true; picMsg("picWorking");
  try{
    await DB.doc("pics/" + id).delete();
    try{ await PICAPI.delete(old.id); }catch(e){}
    const next = Object.assign({}, PICS); delete next[id]; PICS = next;
    picBusy = false;
    if(current && current.id === id) renderStory();
  }catch(e){ picBusy = false; picMsg("picFail"); }
}
function translateCurrent(id, miss){
  translateStrings(miss)
    .then(() => { if(current && current.id === id){ storyTxState = "done"; renderStory(); } })
    .catch(e => { if(current && current.id === id){ storyTxState = (e && e.code === "na") ? "na" : "error"; renderStory(); } });
}
function openStory(id){
  current = byId[id]; if(!current) return;
  $("notif").classList.remove("show");
  storyMode = P().mode; showOrig = false; ctxFilter = "key"; srcOpen = false;
  freshIdx = unreadIdx(current);
  storyView = "news";
  if(freshIdx.length) markRead(current);
  if(prefs){ const reads = (prefs.reads || []).filter(r => !(r.id === id && r.d === dateStr(0))); reads.push({id, d:dateStr(0)}); setPref("reads", reads.slice(-60)); }
  const miss = (lang() === "en" || SA) ? [] : view("s:" + id, current).missing;
  storyTxState = lang() === "en" ? "idle" : (miss.length ? "loading" : "done");
  renderStory();
  $("sheet").classList.add("open"); $("sheet").scrollTop = 0;
  document.body.style.overflow = "hidden";
  closeChat();
  if(miss.length) translateCurrent(id, miss);
}
function closeStory(){ $("sheet").classList.remove("open"); document.body.style.overflow = ""; closeChat(); freshIdx = []; if(curTab === "home") renderHome(); setHeader(curTab); }
function toggleFollow(){
  const f = (P().following || []).slice();
  const i = f.indexOf(current.id);
  if(i >= 0) f.splice(i, 1); else f.push(current.id);
  if(i < 0 && !((P().seen || {})[current.id])) setPref("seen", Object.assign({}, P().seen || {}, {[current.id]: current.date}));
  setPref("following", f); renderStory(); setHeader(curTab);
  if(i < 0){
    const un = unreadIdx(current), st = txStory(current);
    const msg = un.length ? tr("updAlert", {h:EV(current)}) + "<br><span style=\"font-weight:400\">" + st.ctx.tl[un[un.length - 1]].t + "</span>" : tr("followAlert", {h:EV(current)});
    setTimeout(() => showAlert(msg, current.id), 500);
  }
}

/* ---------- Chat ---------- */
function storyText(s){
  const cite = a => (a && a.length ? " [" + a.join(",") + "]" : "");
  const f = a => arr(a).map(b => "- " + b.t + cite(b.s)).join("\n");
  const part = (title, body) => body ? [title + body] : [];
  const pv = s.persp && arr(s.persp.items).length ? s.persp : null;
  return [
    "HEADLINE: " + s.headline, "FIRST PUBLISHED: " + String(s.date).slice(0,10), "SUMMARY: " + s.summary,
    ...part("WHY IT MATTERS: ", s.why),
    ...part("WHAT HAPPENED (verified):\n", f(s.event)),
    ...part("EFFECTS (analysis):\n", effectsOf(s).map(x => `- ${x.label ? x.label + ": " : ""}${x.dir ? x.dir + ", " : ""}${x.t || ""}`).join("\n")),
    ...part("BACKGROUND (verified):\n", f(s.background)),
    ...part("STORY SO FAR:\n", arr(s.story).map(x => "- " + x.d + ": " + x.t + cite(x.s)).join("\n")),
    ...part("CONTEXT, IN 30 SECONDS (verified): ", s.ctx.intro),
    ...part("WHO'S WHO (verified):\n", s.ctx.players.map(p => `- ${p.n}: ${p.r}` + cite(p.s)).join("\n")),
    ...part("TIMELINE (verified; 'now' = this story, 'after' = updates since this story, newest last, 'next' = scheduled):\n", s.ctx.tl.map(e => `- ${dOf(e)}${e.tag ? " (" + e.tag + ")" : ""}: ${e.t}${e.why ? " Why it matters: " + e.why : ""}` + cite(e.s)).join("\n")),
    ...part("PATTERN (analysis): ", s.pattern),
    ...part("HOW IT'S COVERED" + (pv ? " (" + pv.type + "):\n" : ""), pv ? pv.items.map(x => `- ${x.who || ""} ${x.outlet || ""}${x.lean ? " (AllSides: " + x.lean + ")" : ""}${x.state ? " (state media)" : ""}: ${x.text}` + cite(x.s)).join("\n") : ""),
    ...part("CHAIN REACTION (analysis): ", arr(s.chain).join(" -> ")),
    ...part("SCENARIOS (analysis):\n", arr(s.scenarios).map(x => `- ${x.name} (${x.lik}): ${x.what}${x.mkts ? " Markets: " + x.mkts : ""}`).join("\n")),
    ...part("MARKET IMPACT (analysis):\n", arr(s.impact).map(x => `- ${x.asset}: ${x.dir}, ${x.note}`).join("\n")),
    ...part("BUSINESS EFFECTS (analysis):\n", arr(s.business).map(x => "- " + x).join("\n")),
    ...part("CONNECTED STORIES: ", arr(s.connected).map(c => c.t).join(" | ")),
    ...part("KEY TERMS:\n", arr(s.terms).map(x => `- ${x.k}: ${x.v}`).join("\n")),
    ...part("CORRECTIONS:\n", arr(s.corrections).map(x => "- " + x.t).join("\n")),
    "SOURCES:\n" + s.sources.map((x,i) => `[${i+1}] ${x.n} (${x.tier}): ${x.t}`).join("\n")
  ].join("\n\n");
}
function rules(mode, citeStyle){
  return `You are the assistant inside Daily Brief, a news app that explains the news quickly and clearly. Today is ${NOW.toLocaleDateString("en-GB", {day:"numeric", month:"long", year:"numeric"})}.
Rules:
- Always answer in ${LANGS[lang()].name}.
- Answer using ONLY the verified story notes below, plus well-established background knowledge (history, definitions, how institutions work).
- Never invent facts, figures, dates, names or quotes. If the notes do not cover something, say so plainly and offer general background only if it is well established, clearly labelled as background.
- Keep answers short: 2 to 5 sentences, or up to 5 bullets. Plain language, and explain any jargon.
- Reading mode: ${tr("m_" + mode)} (${I18N.en["md_" + mode]}).
- ${citeStyle}
- When asked about different viewpoints, use the "How it's covered" notes and say which outlet holds which view and how AllSides rates it, or which country or side it represents.
- For market questions, describe possible effects as scenarios, never as predictions or advice, and end with a short "not financial advice" note.
- Stay neutral on politics: describe positions and facts, never take sides.`;
}
const storyContext = () => rules(storyMode, "When you use a fact from the notes, cite its source number in brackets, like [2].") + "\n\nSTORY NOTES:\n" + storyText(current);
const allContext = () => rules(P().mode, "When you use a fact, name the publication it comes from, for example (Reuters).") +
  "\n\nSTORIES IN THE APP (the most important and recent in full, the rest in brief):\n" + ranked().map((s, i) => i < 8
    ? "=== STORY ===\n" + storyText(s)
    : "=== STORY (brief) ===\nHEADLINE: " + s.headline + "\nSUMMARY: " + s.summary + "\nLATEST UPDATE: " + (updIdx(s).map(k => s.ctx.tl[k].t).pop() || "none")).join("\n\n");
function fmt(t){
  const lines = esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").split("\n");
  let out = "", inList = false;
  for(const l of lines){
    const m = l.match(/^\s*(?:[-•*]|\d+\.)\s+(.*)/);
    if(m){ if(!inList){ out += "<ul>"; inList = true; } out += `<li>${m[1]}</li>`; }
    else { if(inList){ out += "</ul>"; inList = false; } if(l.trim()) out += `<p>${l}</p>`; }
  }
  if(inList) out += "</ul>";
  return out;
}
let chatSeq = 0;
function makeChat(root, getContext, getSuggestions, intro, placeholder){
  const id = "q" + (++chatSeq);
  root.innerHTML = `<div class="msgs" aria-live="polite"></div><div class="sugg"></div>
    <form class="chat-form"><label class="sr" for="${id}">${esc(placeholder)}</label><input id="${id}" autocomplete="off" placeholder="${esc(placeholder)}"><button class="send" type="submit">${tr("send")}</button></form>`;
  const msgs = root.querySelector(".msgs"), sugg = root.querySelector(".sugg"), form = root.querySelector("form"), input = root.querySelector("input");
  let history = [], busy = false;
  const add = (role, text, html) => { const d = document.createElement("div"); d.className = "msg " + (role === "user" ? "user" : "ai"); d.innerHTML = html ? text : fmt(text); msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d; };
  const renderSugg = () => { sugg.innerHTML = getSuggestions().map(q => `<button type="button" class="chip">${esc(q)}</button>`).join(""); };
  sugg.onclick = e => { const b = e.target.closest("button"); if(b) send(b.textContent); };
  form.onsubmit = e => { e.preventDefault(); const q = input.value.trim(); if(q){ input.value = ""; send(q); } };
  async function send(q){
    if(busy) return;
    busy = true; sugg.innerHTML = "";
    add("user", q);
    const el = add("ai", tr("thinking")); el.classList.add("pending");
    const smp = await getSampler();
    if(!smp){ el.classList.remove("pending"); el.innerHTML = fmt(tr("chatNA")); busy = false; renderSugg(); return; }
    const ctx = getContext();
    const convo = history.map((m,i) => ({role:m.role, content: i === 0 ? ctx + "\n\nQUESTION: " + m.content : m.content}));
    convo.push({role:"user", content: history.length === 0 ? ctx + "\n\nQUESTION: " + q : q});
    try{
      const res = await smp(convo, {cache:false, onText: ({text}) => { if(text){ el.classList.remove("pending"); el.innerHTML = fmt(text); msgs.scrollTop = msgs.scrollHeight; } }});
      const text = (res && res.text) ? res.text : el.textContent;
      el.classList.remove("pending"); el.innerHTML = fmt(text);
      history.push({role:"user", content:q}, {role:"assistant", content:text});
    }catch(err){
      el.classList.remove("pending");
      const code = err && err.code;
      el.innerHTML = fmt(code === "not_granted" ? tr("chatOff") : code === "rate_limited" ? tr("chatRate") : tr("chatErr"));
    }
    busy = false; renderSugg(); msgs.scrollTop = msgs.scrollHeight;
  }
  return { reset(){ history = []; msgs.innerHTML = ""; add("ai", `<p>${intro()}</p>`, true); renderSugg(); } };
}
function openChat(){
  $("drawerTitle").textContent = tr("askStory");
  $("drawerSub").textContent = H(current);
  $("closeChat").setAttribute("aria-label", tr("close"));
  const c = makeChat($("storyChat"), storyContext, () => tr(storyView === "ctx" ? "sg_ctx" : "sg_" + storyMode), () => tr("chatIntro"), tr("phStory"));
  c.reset();
  $("drawer").classList.add("open"); $("scrim").classList.add("show");
}
function closeChat(){ const d = $("drawer"), sc = $("scrim"); if(d) d.classList.remove("open"); if(sc) sc.classList.remove("show"); }

/* ---------- Ask tab ---------- */
let askChat = null, askLang = null;
function renderAsk(){
  if(askChat && askLang === lang()) return;
  askLang = lang();
  $("page-ask").innerHTML = `<div class="ask-page" id="askBox"></div>`;
  askChat = makeChat($("askBox"), allContext, () => tr("sg_ask"), () => tr("askIntro"), tr("phAsk"));
  askChat.reset();
}

/* ---------- Daily quiz ---------- */
let qz = null;
function quizPool(){
  const reads = P().reads || [];
  const has = id => byId[id] && byId[id].quiz.length;
  let ids = [...new Set(reads.filter(r => r.d === dateStr(-1)).map(r => r.id))].filter(has), basis = "yest";
  if(!ids.length){ ids = [...new Set(reads.filter(r => r.d === dateStr(0)).map(r => r.id))].filter(has); basis = ids.length ? "today" : "top"; }
  const qs = [];
  ids.forEach(id => byId[id].quiz.forEach((_, j) => qs.push({id, j})));
  if(qs.length < 5){
    for(const s of ranked()){
      for(let j = 0; j < s.quiz.length && qs.length < 5; j++) if(!qs.some(x => x.id === s.id && x.j === j)) qs.push({id:s.id, j});
      if(qs.length >= 5) break;
    }
  }
  const pick = qs.filter(x => x.j === 0).concat(qs.filter(x => x.j !== 0)).slice(0, 5);
  return {qs:pick, basis, n:ids.length};
}
function streakNow(){ const q = P().quizLog; if(!q) return 0; return (q.last === dateStr(0) || q.last === dateStr(-1)) ? q.streak : 0; }
function recordQuiz(){
  const q = P().quizLog || {last:null, streak:0};
  if(q.last === dateStr(0)) return;
  const streak = q.last === dateStr(-1) ? q.streak + 1 : 1;
  setPref("quizLog", {last:dateStr(0), streak});
}
function renderQuiz(){
  const root = $("page-quiz");
  const trNote = (lang() !== "en" && quizState === "loading") ? `<p class="note"><span class="spin" aria-hidden="true"></span>${tr("translating")}</p>` : "";
  const streak = streakNow();
  if(qz && qz.started) qz.qs = qz.qs.filter(x => byId[x.id] && byId[x.id].quiz[x.j]);
  if(!qz || !qz.started){
    const pool = quizPool();
    ensureQuiz(pool.qs.map(x => x.id));
    if(!pool.qs.length){ root.innerHTML = `<div class="qz"><div class="qz-hero"><h2 class="qz-title">${tr("qzTitle")}</h2><p style="margin:4px 0 0">${tr("qzIntro")}</p></div><p class="note">${tr("qzNone")}</p></div>`; return; }
    const basis = pool.basis === "yest" ? tr("qzBasedYest", {n:pool.n}) : pool.basis === "today" ? tr("qzBasedToday", {n:pool.n}) : tr("qzBasedTop");
    root.innerHTML = `<div class="qz">
      <div class="qz-hero">${streak ? `<span class="qz-streak">🔥 ${tr("qzStreak", {n:streak})}</span>` : ""}
      <h2 class="qz-title">${tr("qzTitle")}</h2><p style="margin:4px 0 0">${tr("qzIntro")}</p></div>
      <p class="note">${basis}</p>${trNote}
      <button class="primary" id="qzStart" style="margin-top:16px">${tr("qzStart")}</button></div>`;
    $("qzStart").onclick = () => { qz = Object.assign(quizPool(), {i:0, score:0, picked:null, started:true, recorded:false}); renderQuiz(); };
    return;
  }
  if(qz.i >= qz.qs.length){
    if(!qz.recorded){ recordQuiz(); qz.recorded = true; }
    const n = qz.qs.length, sc = qz.score, ratio = sc / n;
    const msg = ratio >= 0.8 ? tr("qzHigh") : ratio >= 0.5 ? tr("qzMid") : tr("qzLow");
    const storiesInQuiz = [...new Set(qz.qs.map(x => x.id))].map(id => byId[id]).filter(Boolean);
    root.innerHTML = `<div class="qz" style="text-align:center">
      <div class="qz-big">${sc}<span class="qz-of"> / ${n}</span></div>
      <p style="margin:0 0 12px">${msg}</p>
      <span class="qz-streak">🔥 ${tr("qzStreak", {n:streakNow()})}</span>
      <p class="note">${tr("qzTomorrow")}</p>
      <button class="btn soft" id="qzAgain" style="margin-top:12px;width:100%">${tr("qzAgain")}</button></div>
      <div class="list" style="margin-top:12px">${storiesInQuiz.map(s => `<button class="conn" data-open="${s.id}"><span>${H(s)}</span><span class="go" aria-hidden="true">→</span></button>`).join("")}</div>`;
    $("qzAgain").onclick = () => { qz = null; renderQuiz(); };
    return;
  }
  const cur = qz.qs[qz.i], q = QZ(cur.id, cur.j), orig = byId[cur.id].quiz[cur.j];
  const answered = qz.picked !== null;
  root.innerHTML = `<div class="qz">
    <div class="meta">${tr("qzQ", {i:qz.i + 1, n:qz.qs.length})}</div>
    <div class="qz-bar"><span style="width:${(qz.i + (answered ? 1 : 0)) / qz.qs.length * 100}%"></span></div>
    ${trNote}
    <h2 class="qz-q">${q.q}</h2>
    <div class="qz-opts">${q.o.map((o, k) => {
      let cls = "";
      if(answered){ if(k === orig.c) cls = "ok"; else if(k === qz.picked) cls = "bad"; }
      return `<button class="qz-opt ${cls}" data-qo="${k}" ${answered ? "disabled" : ""}>${o}</button>`;
    }).join("")}</div>
    ${answered ? `<div class="qz-fb ${qz.picked === orig.c ? "good" : "badfb"}"><b>${qz.picked === orig.c ? tr("qzRight") : tr("qzWrong")}</b>${q.e}
      <div><button class="link-btn sm" data-open="${cur.id}">${tr("qzRead")} →</button></div></div>
      <button class="primary" id="qzNext" style="margin-top:14px">${qz.i + 1 < qz.qs.length ? tr("qzNext") : tr("qzFinish")}</button>` : ""}
  </div>`;
  root.querySelectorAll("[data-qo]").forEach(b => b.onclick = () => {
    if(qz.picked !== null) return;
    qz.picked = Number(b.dataset.qo);
    if(qz.picked === orig.c) qz.score++;
    renderQuiz();
  });
  const nx = $("qzNext"); if(nx) nx.onclick = () => { qz.i++; qz.picked = null; renderQuiz(); window.scrollTo(0,0); };
}

/* ---------- Settings ---------- */
function newsroomHTML(){
  const st = txSite();
  const row = (k, v) => `<div class="nr-row"><span>${k}</span><b>${v}</b></div>`;
  const held = arr(st.held).filter(x => x && x.t), corr = arr(st.corrections).filter(x => x && x.t);
  return `<div class="set-group nr"><h3>${tr("nrTitle")}</h3><p class="note" style="margin:0 0 10px">${tr("nrSub")}</p>
    ${dbState === "live" ? "" : `<p class="nr-state">${tr(dbState === "loading" ? "nrLoading" : "nrOffline")}</p>`}
    ${SA && dbState !== "loading" ? `<button class="link-btn sm" id="nrRefresh" style="margin-bottom:8px">${tr("nrRefresh")}</button>` : ""}
    ${st.schedule ? row(tr("nrSchedule"), st.schedule) : ""}
    ${SITE.lastCheck ? row(tr("nrLastCheck"), whenAt(iso(SITE.lastCheck), true)) : ""}
    ${SITE.lastChange ? row(tr("nrLastChange"), whenAt(iso(SITE.lastChange), true)) : ""}
    ${st.note ? `<p class="nr-note">${st.note}</p>` : ""}
    ${held.length ? `<h4>${tr("nrHeld")}</h4><p class="note" style="margin:0 0 6px">${tr("nrHeldSub")}</p><ul class="facts">${held.map(x => `<li>${x.t}</li>`).join("")}</ul>` : ""}
    ${corr.length ? `<h4>${tr("nrCorr")}</h4><ul class="facts">${corr.map(x => `<li>${x.at ? `<b>${whenAt(iso(x.at))}</b> · ` : ""}${x.t}</li>`).join("")}</ul>` : ""}
  </div>`;
}
function renderSettings(){
  const p = P();
  const chips = (list, sel, key, prefix) => list.map(x => `<button class="chip" data-k="${key}" data-v="${x}" aria-pressed="${sel.includes(x)}">${tr(prefix + x)}</button>`).join("");
  $("page-settings").innerHTML = `
    <div class="set-group"><h3>${tr("setLang")}</h3><div class="wrap">${LANG_ORDER.map(l => `<button class="chip" data-lang="${l}" aria-pressed="${l === lang()}">${LANGS[l].native}</button>`).join("")}</div>
      ${lang() !== "en" ? `<p class="note">${tr("trNote")}</p>` : ""}</div>
    <div class="set-group"><h3>${tr("setMode")}</h3>
      <div class="opts">${MODE_ORDER.map(m => `<button class="opt" data-mode-set="${m}" aria-pressed="${m === p.mode}"><b>${tr("m_" + m)}${m === "essentials" ? ` <span class="rec">${tr("recommended")}</span>` : ""}</b><span>${tr("md_" + m)}</span></button>`).join("")}</div></div>
    <div class="set-group"><h3>${tr("setTopics")}</h3><div class="wrap">${chips(TOPICS, p.topics, "topics", "tp_")}</div></div>
    <div class="set-group"><h3>${tr("setRegions")}</h3><div class="wrap">${chips(REGIONS, p.regions, "regions", "rg_")}</div></div>
    <div class="set-group" id="setWatch"><h3>${tr("setWatch")}</h3><p class="note" style="margin:0 0 10px">${tr("setWatchSub")}</p><div class="wrap">${chips(ASSETS, p.watch || [], "watch", "as_")}</div></div>
    <div class="set-group"><div class="row"><div><h3 style="margin:0">${tr("setAlerts")}</h3><p>${tr("setAlertsSub")}</p></div>
      <button class="switch" role="switch" id="notifySwitch" aria-checked="${!!p.notify}" aria-label="${esc(tr("setAlerts"))}"></button></div></div>
    ${newsroomHTML()}
    ${SA ? installHTML() : ""}
    <div class="set-group about"><h3 style="color:var(--ink)">${tr("setHow")}</h3>
      <p>${tr("how1")}</p><p>${tr("how2")}</p><p>${tr("how3")}</p><p>${tr("how4")}</p></div>
    <div class="set-group"><button class="btn soft" id="redo" style="width:100%">${tr("redo")}</button></div>
    ${SA ? `<p class="note" style="text-align:center;margin-top:14px">Daily Brief · ${esc(typeof APP_VERSION !== "undefined" ? APP_VERSION : "")}</p>` : ""}`;
  $("page-settings").onclick = e => {
    const lb = e.target.closest("[data-lang]");
    if(lb){ setLang(lb.dataset.lang); return; }
    const m = e.target.closest("[data-mode-set]");
    if(m){ setPref("mode", m.dataset.modeSet); renderSettings(); return; }
    const c = e.target.closest("[data-k]");
    if(c){
      const k = c.dataset.k, v = c.dataset.v, cur = P()[k] || [];
      const next = cur.includes(v) ? cur.filter(x => x !== v) : cur.concat(v);
      if(next.length === 0 && k !== "watch") return;
      setPref(k, next); renderSettings(); return;
    }
    if(e.target.closest("#notifySwitch")){
      setPref("notify", !P().notify); renderSettings();
      return;
    }
    if(e.target.closest("#redo")) startOnboarding();
    if(e.target.closest("#nrRefresh")) loadFeed(true);
    if(e.target.closest("#shareApp")) shareApp();
  };
}
function installHTML(){
  const steps = isIOS() ? ["instI1","instI2","instI3"] : ["instA1","instA2"];
  return `<div class="set-group" id="setInstall"><h3>${tr(isInstalled() ? "shareTitle" : "instTitle")}</h3>
    ${isInstalled() ? "" : `<p class="note" style="margin:0 0 8px">${tr("instSub")}</p><ol class="facts" style="font-size:14.5px">${steps.map(k => `<li>${tr(k)}</li>`).join("")}</ol>`}
    <button class="btn soft" id="shareApp" style="width:100%;margin-top:${isInstalled() ? 0 : 10}px">${tr("shareBtn")}</button>
    <p class="note" id="shareMsg" hidden></p></div>`;
}
function shareApp(){
  const url = location.href.split("#")[0].split("?")[0];
  const said = k => { const m = $("shareMsg"); if(m){ m.textContent = tr(k); m.hidden = false; } };
  if(navigator.share) navigator.share({title:"Daily Brief", text:tr("shareText"), url}).catch(() => {});
  else { try{ navigator.clipboard.writeText(url).then(() => said("shareCopied"), () => said("shareFail")); }catch(e){ said("shareFail"); } }
}
function setLang(l){
  setPref("lang", l);
  cardsState = "idle"; quizState = "idle"; askChat = null;
  document.documentElement.lang = l;
  clearViews();
  refresh();
  ensureCards();
}

/* ---------- Alerts ---------- */
let alertTimer;
function showAlert(text, openId){
  const n = $("notif");
  n.innerHTML = `<div class="notif-top"><span>DAILY BRIEF · ${tr("now")}</span></div><b>${text}</b>`;
  n.onclick = () => { n.classList.remove("show"); if(openId) openStory(openId); };
  n.classList.add("show");
  clearTimeout(alertTimer);
  alertTimer = setTimeout(() => n.classList.remove("show"), 7000);
}

/* ---------- Tabs & header ---------- */
let curTab = "home";
function setHeader(tab){
  const p = P();
  const lu = STORIES.map(lastUpd).sort().pop() || NOW.toISOString(), lud = new Date(lu);
  const luTxt = dayStart(lud).getTime() === dayStart(NOW).getTime()
    ? tr("updAt", {t:lud.toLocaleTimeString(loc(), {hour:"2-digit", minute:"2-digit"})})
    : tr("updLabel", {w:whenAt(lu, true)});
  $("dateline").innerHTML = `<span>${esc(NOW.toLocaleDateString(loc(), {weekday:"short", day:"numeric", month:"short"}))}</span><span class="dl-upd"><i aria-hidden="true"></i>${esc(luTxt)}</span>`;
  $("pageTitle").textContent = tab === "home" ? "daily brief" : tr(tab);
  const sub = tab === "home" ? "" : tr(tab === "ask" ? "subAsk" : tab === "quiz" ? "subQuiz" : "subSettings");
  const pill = cardsState === "loading" ? `<span class="spin" aria-hidden="true"></span>${tr("translating")}` : dbState === "loading" ? `<span class="spin" aria-hidden="true"></span>${tr("nrLoading")}` : dbState === "offline" ? tr("nrOfflineShort") : "";
  $("pageSub").innerHTML = esc(sub) + (pill ? ` <span class="pill-tr">${pill}</span>` : "");
  $("pageSub").hidden = !$("pageSub").innerHTML;
  $("homeFilters").hidden = tab !== "home";
  document.querySelectorAll(".tab").forEach(t => { t.querySelector("span").textContent = tr(t.dataset.tab === "home" ? "today" : t.dataset.tab); });
  const ht = document.querySelector('.tab[data-tab="home"]'), n = unreadTotal();
  let bd = ht.querySelector(".tab-badge");
  if(n){ if(!bd){ bd = document.createElement("b"); bd.className = "tab-badge"; ht.appendChild(bd); } bd.textContent = n; bd.setAttribute("aria-label", tr("updNew") + ": " + n); }
  else if(bd) bd.remove();
  $("backLabel").textContent = tr("today");
  const al = $("askStoryLabel"); if(al) al.textContent = tr("askStory");
}
function showTab(tab){
  curTab = tab;
  if(tab === "home") renderFilters();
  document.querySelectorAll(".tab").forEach(t => { if(t.dataset.tab === tab) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current"); });
  ["home","ask","quiz","settings"].forEach(t => { const pg = $("page-" + t); if(pg) pg.hidden = t !== tab; });
  if(tab === "home") renderHome();
  if(tab === "ask" && !SA) renderAsk();
  if(tab === "quiz"){ if(quizState === "error") quizState = "idle"; renderQuiz(); }
  if(tab === "settings") renderSettings();
  setHeader(tab);
  window.scrollTo(0,0);
}
function syncStory(){   // re-render the open story and translate anything new in it
  if(!$("sheet").classList.contains("open")) return;
  if(!current){ closeStory(); return; }
  const miss = (lang() === "en" || SA) ? [] : view("s:" + current.id, current).missing;
  storyTxState = lang() === "en" ? "idle" : (miss.length ? "loading" : "done");
  renderStory();
  if(miss.length) translateCurrent(current.id, miss);
}
function refresh(){   // after a language change
  showTab(curTab);
  showOrig = false;
  syncStory();
}
function repaint(){   // after new data or new translations: redraw in place, without scrolling
  NOW = new Date();
  if($("app").hidden) return;
  if(curTab === "home"){ renderFilters(); renderHome(); }
  if(curTab === "settings") renderSettings();
  if(curTab === "quiz" && !(qz && qz.started)) renderQuiz();
  setHeader(curTab);
  syncStory();
}

/* ---------- Onboarding ---------- */
let step = 0;
function startOnboarding(){
  draft = Object.assign({}, DEFAULT_PREFS, prefs || {});
  draft.lang = lang();
  if(!prefs){ draft.topics = []; draft.regions = []; draft.reason = null; draft.time = null; draft.mode = null; draft.notify = null; }
  step = 0;
  $("app").hidden = true; $("onboarding").hidden = false;
  renderOnb();
}
function finishOnboarding(){
  const r = REASONS.find(r => r.id === draft.reason);
  if(!prefs && r) draft.watch = r.watch.slice();
  prefs = Object.assign({}, DEFAULT_PREFS, draft, {notify: draft.notify === true || draft.notify === "yes"});
  savePrefs(); draft = null;
  document.documentElement.lang = lang();
  $("onboarding").hidden = true; $("app").hidden = false;
  showTab("home");
  ensureCards();
}
function skipOnboarding(){ const l = draft.lang; draft = Object.assign({}, DEFAULT_PREFS, {lang:l}); finishOnboarding(); }
function renderOnb(){
  const total = 6;
  const dots = step > 0 ? `<div class="dots">${Array.from({length:total}, (_,i) => `<span class="${i < step ? "on" : ""}"></span>`).join("")}</div>` : "";
  let body = "", canNext = true, nextLabel = tr("cont");
  const opt = (key, val, label, sub, multi) => {
    const on = multi ? draft[key].includes(val) : String(draft[key]) === String(val);
    return `<button class="opt" data-key="${key}" data-val="${val}" data-multi="${multi ? 1 : 0}" aria-pressed="${on}"><b>${label}</b>${sub ? `<span>${sub}</span>` : ""}</button>`;
  };
  if(step === 0){
    body = `<div class="lang-row" role="group" aria-label="Language">${LANG_ORDER.map(l => `<button class="chip sm" data-onblang="${l}" aria-pressed="${l === draft.lang}">${LANGS[l].native}</button>`).join("")}</div>
      <div class="hero-mark">Daily<i>.</i>Brief</div>
      <p class="lead" style="font-size:18px">${tr("tagline")}</p>
      <ul class="promise">
        <li><span class="n">1</span><div><b>${tr("p1t")}</b><span>${tr("p1s")}</span></div></li>
        <li><span class="n">2</span><div><b>${tr("p2t")}</b><span>${tr("p2s")}</span></div></li>
        <li><span class="n">3</span><div><b>${tr("p3t")}</b><span>${tr("p3s")}</span></div></li>
      </ul>`;
    nextLabel = tr("start");
  } else if(step === 1){
    body = `<h1>${tr("q1")}</h1><p class="lead">${tr("q1s")}</p><div class="opts">${REASONS.map(r => opt("reason", r.id, tr("r_" + r.id), tr("rs_" + r.id))).join("")}</div>`;
    canNext = !!draft.reason;
  } else if(step === 2){
    body = `<h1>${tr("q2")}</h1><p class="lead">${tr("q2s")}</p><div class="opts two">${TOPICS.map(t => opt("topics", t, tr("tp_" + t), "", true)).join("")}</div>`;
    canNext = draft.topics.length > 0;
  } else if(step === 3){
    body = `<h1>${tr("q3")}</h1><p class="lead">${tr("q3s")}</p><div class="opts two">${REGIONS.map(t => opt("regions", t, tr("rg_" + t), "", true)).join("")}</div>`;
    canNext = draft.regions.length > 0;
  } else if(step === 4){
    body = `<h1>${tr("q4")}</h1><p class="lead">${tr("q4s")}</p><div class="opts">${TIMES.map(t => opt("time", t, tr("t_" + t), tr("ts_" + t))).join("")}</div>`;
    canNext = !!draft.time;
  } else if(step === 5){
    if(!draft.mode) draft.mode = "essentials";
    body = `<h1>${tr("q5")}</h1><p class="lead">${tr("q5s")}</p><div class="opts">${MODE_ORDER.map(m => opt("mode", m, tr("m_" + m) + (m === "essentials" ? ` <span class="rec">${tr("recommended")}</span>` : ""), tr("md_" + m))).join("")}</div>`;
  } else if(step === 6){
    body = `<h1>${tr("q6")}</h1><p class="lead">${tr("q6s")}</p><div class="opts">${opt("notify", "yes", tr("yesAlert"), tr("yesAlertS"))}${opt("notify", "no", tr("noAlert"), tr("noAlertS"))}</div>`;
    canNext = draft.notify === "yes" || draft.notify === "no" || draft.notify === true || draft.notify === false;
    nextLabel = tr("showBrief");
  }
  $("onboarding").innerHTML = `<div class="onb">${dots}${body}
    <div class="onb-foot"><button class="primary" id="onbNext" ${canNext ? "" : "disabled"}>${nextLabel}</button>
    ${step === 0 ? `<button class="ghost" id="onbSkip">${tr("skip")}</button>` : `<button class="ghost" id="onbBack">${tr("back")}</button>`}</div></div>`;
  $("onboarding").onclick = e => {
    const lb = e.target.closest("[data-onblang]");
    if(lb){ draft.lang = lb.dataset.onblang; document.documentElement.lang = draft.lang; renderOnb(); return; }
    const o = e.target.closest(".opt");
    if(o){
      const k = o.dataset.key, v = o.dataset.val;
      if(o.dataset.multi === "1") draft[k] = draft[k].includes(v) ? draft[k].filter(x => x !== v) : draft[k].concat(v);
      else { draft[k] = k === "time" ? Number(v) : v;  }
      renderOnb(); return;
    }
    if(e.target.closest("#onbNext")){ if(step === 6){ finishOnboarding(); return; } step++; renderOnb(); window.scrollTo(0,0); return; }
    if(e.target.closest("#onbBack")){ step--; renderOnb(); return; }
    if(e.target.closest("#onbSkip")) skipOnboarding();
  };
}

/* ---------- Global events ---------- */
document.addEventListener("click", e => {
  const src = e.target.closest("[data-src]");
  if(src){ e.preventDefault(); if(!srcOpen) setSrc(true); const t = document.getElementById("src-" + src.dataset.src); if(t) t.scrollIntoView({behavior:"smooth", block:"center"}); return; }
  const o = e.target.closest("[data-open]");
  if(o){ openStory(o.dataset.open); return; }
  const g = e.target.closest("[data-goto]");
  if(g){ showTab("settings"); setTimeout(() => { const el = $("setWatch"); if(el) el.scrollIntoView({behavior:"smooth", block:"start"}); }, 50); return; }
  const tab = e.target.closest(".tab");
  if(tab) showTab(tab.dataset.tab);
});
document.addEventListener("keydown", e => {
  if((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[role=button][data-open]")){ e.preventDefault(); openStory(e.target.dataset.open); }
  if(e.key === "Escape"){ const d = $("drawer"); if(d && d.classList.contains("open")) closeChat(); else if($("sheet").classList.contains("open")) closeStory(); }
});
$("backBtn").onclick = closeStory;
{ const ab = $("askStoryBtn"), cc = $("closeChat"), sc = $("scrim"); if(ab) ab.onclick = openChat; if(cc) cc.onclick = closeChat; if(sc) sc.onclick = closeChat; }

/* ---------- Start ---------- */
document.documentElement.lang = lang();
try{ Object.keys(localStorage).forEach(k => { if(k.indexOf("dailybrief.tx.") === 0) localStorage.removeItem(k); }); }catch(e){}   // translations saved by older versions
{ const c = loadCache(); if(SA){ feedStamp = String(c.generated || ""); setFeedTM(c.tm); } applyData(c.docs, c.site, SA ? feedPics(c.pics) : c.pics, true); }   // the archive plus whatever was saved on the last visit
if(prefs){ $("app").hidden = false; showTab("home"); ensureCards(); }
else startOnboarding();
if(SA) startFeed(); else startDB();
document.addEventListener("visibilitychange", () => { if(!document.hidden){ repaint(); if(SA) loadFeed(); } });
