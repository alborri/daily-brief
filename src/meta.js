/* Per-story display data:
   - region: one main region
   - ev: the name of the main event (7 languages), used in the followed list
   - sh: a short headline (7 languages), used on home tiles; the article keeps the full headline
   - icon: the picture shown on tiles until real photos exist
   - live: developing stories that will keep getting updates
   In Phase 2 the central newsroom sets these fields. */
const META = {
  "abu-dhabi-talks": {region:"Europe", icon:"people", ev:{
    en:"Russia–Ukraine war", fr:"Guerre en Ukraine", es:"Guerra en Ucrania", pt:"Guerra na Ucrânia",
    de:"Krieg in der Ukraine", it:"Guerra in Ucraina", ru:"Российско-украинская война"}, sh:{
    en:"Ukraine talks end in a prisoner swap", fr:"Ukraine : accord sur un échange de prisonniers", es:"Ucrania: acuerdo de canje de prisioneros", pt:"Ucrânia: acordo de troca de prisioneiros",
    de:"Ukraine-Gespräche: Gefangenenaustausch vereinbart", it:"Ucraina: accordo su uno scambio di prigionieri", ru:"Украина: договорённость об обмене пленными"}},
  "cop31": {region:"Global", live:true, icon:"thermo", ev:{
    en:"COP31 climate summit", fr:"Sommet climat COP31", es:"Cumbre del clima COP31", pt:"Cimeira do clima COP31",
    de:"Weltklimagipfel COP31", it:"Vertice sul clima COP31", ru:"Климатический саммит COP31"}, sh:{
    en:"COP31: pledges still point to 2.6°C", fr:"COP31 : les engagements mènent encore à +2,6 °C", es:"COP31: los compromisos aún apuntan a 2,6 °C", pt:"COP31: compromissos ainda apontam para 2,6 °C",
    de:"COP31: Zusagen führen weiter zu 2,6 °C", it:"COP31: gli impegni portano ancora a 2,6 °C", ru:"COP31: обязательства всё ещё ведут к +2,6 °C"}},
  "iran-talks": {region:"ME", live:true, icon:"ship", ev:{
    en:"Iran war", fr:"Guerre en Iran", es:"Guerra en Irán", pt:"Guerra no Irão",
    de:"Iran-Krieg", it:"Guerra in Iran", ru:"Война с Ираном"}, sh:{
    en:"US–Iran talks continue via Qatar", fr:"USA–Iran : les discussions continuent via le Qatar", es:"EE. UU.–Irán: el diálogo sigue vía Catar", pt:"EUA–Irão: conversações continuam via Catar",
    de:"USA–Iran: Gespräche laufen weiter über Katar", it:"USA–Iran: i colloqui proseguono via Qatar", ru:"США–Иран: контакты продолжаются через Катар"}},
  "oil-drop": {region:"Global", icon:"drop", ev:{
    en:"Oil prices", fr:"Prix du pétrole", es:"Precio del petróleo", pt:"Preço do petróleo",
    de:"Ölpreis", it:"Prezzo del petrolio", ru:"Цены на нефть"}, sh:{
    en:"Oil falls about 15% in a week", fr:"Le pétrole perd environ 15 % en une semaine", es:"El petróleo cae cerca de un 15 % en una semana", pt:"Petróleo cai cerca de 15% numa semana",
    de:"Öl verliert rund 15 % in einer Woche", it:"Il petrolio perde circa il 15% in una settimana", ru:"Нефть подешевела примерно на 15% за неделю"}},
  "midterms": {region:"US", live:true, icon:"ballot", ev:{
    en:"US midterm elections", fr:"Élections de mi-mandat aux États-Unis", es:"Elecciones de mitad de mandato en EE. UU.", pt:"Eleições intercalares nos EUA",
    de:"US-Zwischenwahlen", it:"Elezioni di metà mandato negli USA", ru:"Промежуточные выборы в США"}, sh:{
    en:"Democrats win both chambers", fr:"Les démocrates remportent les deux chambres", es:"Los demócratas ganan ambas cámaras", pt:"Democratas conquistam as duas câmaras",
    de:"Demokraten gewinnen beide Kammern", it:"I democratici conquistano entrambe le Camere", ru:"Демократы получили обе палаты Конгресса"}},
  "ecb-lagarde": {region:"Europe", icon:"bank", ev:{
    en:"ECB rates and Lagarde’s succession", fr:"Taux de la BCE et succession de Lagarde", es:"Tipos del BCE y relevo de Lagarde", pt:"Juros do BCE e sucessão de Lagarde",
    de:"EZB-Zinsen und Lagarde-Nachfolge", it:"Tassi BCE e successione di Lagarde", ru:"Ставки ЕЦБ и преемник Лагард"}, sh:{
    en:"ECB holds; Lagarde to leave early", fr:"La BCE fait une pause, Lagarde partira plus tôt", es:"El BCE mantiene tipos; Lagarde se irá antes", pt:"BCE mantém juros; Lagarde sai mais cedo",
    de:"EZB hält Zinsen, Lagarde geht früher", it:"La BCE ferma i tassi, Lagarde lascerà prima", ru:"ЕЦБ сохранил ставку, Лагард уйдёт досрочно"}},
  "fed-hold": {region:"US", icon:"bank", ev:{
    en:"Fed interest rates", fr:"Taux de la Fed", es:"Tipos de la Fed", pt:"Juros da Fed",
    de:"Fed-Leitzins", it:"Tassi della Fed", ru:"Ставка ФРС"}, sh:{
    en:"Fed holds, eyes a December hike", fr:"La Fed fait une pause, hausse possible en décembre", es:"La Fed mantiene tipos y mira a diciembre", pt:"Fed mantém juros e admite subida em dezembro",
    de:"Fed hält Zinsen, Erhöhung im Dezember möglich", it:"La Fed tiene i tassi, possibile rialzo a dicembre", ru:"ФРС сохранила ставку, возможен рост в декабре"}}
};
SEED.forEach(s => Object.assign(s, META[s.id] || {}));
