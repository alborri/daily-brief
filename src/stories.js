/* ---------- Archive: real stories, fact-checked 11 Nov 2026 (the live newsroom adds to these through the database) ----------
   Source tiers (shown in this order): agency, official, intl, national, state, specialist, other.
   s: [n] = 1-based index into the story's sources. Impact a: = watchlist asset key. */
const SEED = [
{
  id:"abu-dhabi-talks", topics:["Geopolitics"], regions:["Europe","Global"], importance:10,
  date:"2026-11-11T13:30", readMin:3,
  headline:"Ukraine–Russia talks in Abu Dhabi end with a prisoner swap deal, but big gaps remain",
  summary:"The first three-way talks with the US since February focused on security guarantees. The only concrete result is a new prisoner exchange.",
  why:"These are the first real peace talks in nine months. What is agreed on security guarantees will shape Europe’s security for years, and every sign of progress or failure moves energy and defence markets.",
  background:[
    {t:"The war is in its fifth year. Russia occupies about a fifth of Ukraine.", s:[4,13]},
    {t:"Earlier US-brokered rounds this year, in Abu Dhabi and Geneva, ended without a breakthrough.", s:[7,13]},
    {t:"Talks were paused in February, when the US–Israeli war with Iran began.", s:[4,7]},
    {t:"The core dispute: Russia demands that Ukraine withdraw from the parts of Donbas it still controls. Kyiv refuses.", s:[11,14]}
  ],
  event:[
    {t:"The US, Russia and Ukraine met in Abu Dhabi on 10–11 November, their first three-way talks since February.", s:[4,8]},
    {t:"Delegations were led by Steve Witkoff and Jared Kushner for the US, Kremlin aide Vladimir Medinsky for Russia, and Rustem Umerov for Ukraine.", s:[7,12,13]},
    {t:"Talks focused on security guarantees for Ukraine and Europe, Russia’s own security demands, de-escalation and prisoners.", s:[5,8]},
    {t:"Main result: agreement on a prisoner exchange. Ukraine’s negotiator says significant differences remain.", s:[5,6]},
    {t:"European representatives met Ukraine’s team separately. Europe’s role in future talks is still unresolved.", s:[4,5,6]}
  ],
  chain:[
    "Security guarantees are discussed before territory",
    "Russia can make Ukraine’s protection depend on concessions in Donbas",
    "Europe pushes for a seat, because the guarantees also cover its own security",
    "Each sign of progress lowers the ‘war premium’ in energy prices; a breakdown raises it"
  ],
  story:[
    {d:"Feb 2022", t:"Russia launches its full-scale invasion of Ukraine.", s:[]},
    {d:"Jan 2026", t:"First three-way talks in Abu Dhabi. No deal: Russia demands the rest of Donbas.", s:[11,14]},
    {d:"Feb 2026", t:"Second Abu Dhabi round ends with a 314-prisoner swap, the first in five months. Talks then stall when the Iran war begins.", s:[2,3,7]},
    {d:"2 Nov 2026", t:"US envoy Steve Witkoff announces a new round in Abu Dhabi.", s:[1]},
    {d:"10–11 Nov", t:"Fourth round: another prisoner swap agreed, big gaps remain.", s:[5,6]}
  ],
  pattern:"Each round so far has produced humanitarian steps such as prisoner exchanges, but no movement on territory, the core dispute.",
  persp:{type:"national", items:[
    {who:"Ukraine", outlet:"Interfax-Ukraine", desc:"Ukrainian news agency", text:"Kyiv’s negotiator Rustem Umerov calls the prisoner exchange the main result and says the first step must be an end to the war and security guarantees for Ukraine.", s:[5]},
    {who:"Russia", outlet:"TASS", desc:"Russian state news agency", state:true, text:"The Kremlin presents the talks as a strictly three-way format with the US as mediator, focused on security guarantees, with “all the details” kept behind closed doors. Moscow said no European representatives would take part.", s:[12,9]},
    {who:"United States", outlet:"NPR · Meduza", desc:"US public radio · independent Russian outlet based in Latvia", text:"Jared Kushner said a lasting settlement will also need direct talks between Russia and Europe on wider security. Marco Rubio said nothing had been finalised yet.", s:[4,10]},
    {who:"Europe", outlet:"Financial Times, reported by Meduza", desc:"", text:"European officials aim to strengthen Ukraine’s position and stop Russia from using the talks to reshape Europe’s security order. Security advisers from France, Germany and the UK joined parts of the talks.", s:[10]},
    {who:"Critical analysis", outlet:"Modern Diplomacy", desc:"EU-based policy magazine", text:"Argues that discussing guarantees before territory gives Moscow leverage to trade Ukraine’s protection for land in Donbas.", s:[13]}
  ]},
  connected:[
    {t:"The same US envoys, Witkoff and Kushner, are involved in diplomacy with Iran.", link:"iran-talks"},
    {t:"Oil fell last week partly on hopes of ending both wars.", link:"oil-drop"},
    {t:"Europe is pressing to join the talks despite Kremlin objections.", link:null}
  ],
  scenarios:[
    {lik:"Likely", name:"Slow progress", what:"Talks continue in working groups. More humanitarian deals, no ceasefire before winter.", mkts:"Little change. Energy prices stay sensitive to headlines."},
    {lik:"Possible", name:"Partial deal", what:"An agreement on one area, for example energy infrastructure or the Black Sea, which were on the agenda.", mkts:"Gas and wheat prices ease. Ukrainian bonds rise."},
    {lik:"Less likely", name:"Breakdown", what:"Talks collapse and fighting escalates.", mkts:"Oil and gas up, European defence stocks up, euro weaker."}
  ],
  watch:["When the prisoner exchange happens","Whether a next round is scheduled","Europe’s formal role in the talks"],
  impact:[
    {a:"oil", asset:"Oil & gas", dir:"down", note:"Peace hopes reduce the risk premium"},
    {a:"wheat", asset:"Wheat", dir:"mixed", note:"Would fall only if a Black Sea deal emerges"},
    {a:"defence", asset:"European defence stocks", dir:"mixed", note:"Rearmament continues either way"}
  ],
  business:["Construction, energy and engineering firms follow plans for post-war reconstruction.","Shipping and insurance firms watch the Black Sea talks for grain and cargo routes.","European manufacturers remain exposed to energy prices if talks fail."],
  terms:[
    {k:"Security guarantees", v:"Promises by other countries to protect Ukraine if Russia attacks again, for example with weapons, troops or a defence treaty."},
    {k:"Trilateral talks", v:"Negotiations between three parties. Here the US sits between Russia and Ukraine as mediator."},
    {k:"Donbas", v:"Ukraine’s eastern industrial region (Donetsk and Luhansk). Russia controls most of it and wants all of it."}
  ],
  simple:"Think of it as mediation between two countries at war, with the US as mediator. Both sides agreed to swap prisoners, a small but concrete step. On the big questions, who controls which land and who protects Ukraine afterwards, they are still far apart.",
  quiz:[
    {q:"What was the main concrete result of the Abu Dhabi talks on 10–11 November?", o:["A ceasefire","A prisoner exchange","A deal on Donbas","A peace treaty"], c:1, e:"Ukraine’s negotiator said the prisoner exchange was the main outcome, and that big differences remain.", s:[5]},
    {q:"Which region is at the heart of the territorial dispute in the talks?", o:["Odesa","Kharkiv","Donbas","Lviv"], c:2, e:"Russia demands that Ukraine withdraw from the parts of Donbas it still controls. Kyiv refuses.", s:[11,14]}
  ],
  sources:[
    {n:"Reuters (via Al-Monitor)", tier:"agency", t:"US to mediate trilateral talks with Ukraine, Russia in Abu Dhabi next week", u:"https://www.al-monitor.com/originals/2026/11/us-mediate-trilateral-talks-ukraine-russia-abu-dhabi-next-week-us-envoy-says"},
    {n:"AP (via KSL)", tier:"agency", t:"Ukraine, Russia end second day of peace talks, agree prisoner swap (February)", u:"https://www.ksl.com/article/51443631/ukraine-russia-end-second-day-of-peace-talks-agree-prisoner-swap"},
    {n:"Reuters (via The Express Tribune)", tier:"agency", t:"Ukraine and Russia to swap 314 prisoners amid ongoing peace efforts", u:"https://tribune.com.pk/story/2590934/ukraine-and-russia-to-swap-314-prisoners-amid-ongoing-peace-efforts?amp=1"},
    {n:"NPR", tier:"intl", t:"Russia and Ukraine hold nearly 4 hours of U.S.-mediated talks in Abu Dhabi", u:"https://www.npr.org/2026/11/10/g-s1-152773/russia-ukraine-war-talks"},
    {n:"Interfax-Ukraine", tier:"national", t:"Parties outline positions during Abu Dhabi talks; significant differences remain", u:"https://en.interfax.com.ua/news/general/1235062.html"},
    {n:"Kyiv Post", tier:"national", t:"Ukraine, US and Russia end second day of Abu Dhabi peace talks", u:"https://www.kyivpost.com/post/89761"},
    {n:"Kyiv Post", tier:"national", t:"Russia to send a higher-level delegation to the Abu Dhabi talks", u:"https://kyivpost.com/post/89466"},
    {n:"The National (UAE)", tier:"national", t:"Abu Dhabi hosts Russia and Ukraine for security-focused peace talks", u:"https://www.thenationalnews.com/news/mena/2026/11/10/russia-and-ukraine-security-focused-talks-start-in-abu-dhabi/"},
    {n:"UNN (Ukraine)", tier:"national", t:"Peskov stated that the talks in Abu Dhabi would take place without European representatives", u:"https://unn.ua/en/news/peskov-stated-that-the-talks-in-abu-dhabi-would-take-place-without-european-representatives"},
    {n:"Meduza", tier:"national", t:"Russia, Ukraine, and the U.S. to hold peace talks in Abu Dhabi", u:"https://meduza.io/en/feature/2026/11/10/russia-ukraine-and-the-u-s-to-hold-peace-talks-in-abu-dhabi-on-november-10-their-first-trilateral-meeting-since-february-with-security-issues-expected-to-top-the-agenda"},
    {n:"Arab News", tier:"national", t:"Ukraine, Russia wrap ‘productive’ first day of US-backed peace talks", u:"https://www.arabnews.pk/node/2631681/world"},
    {n:"TASS", tier:"state", t:"Trilateral talks on Ukraine to begin in Abu Dhabi", u:"https://tass.com/politics/2215131/amp"},
    {n:"Modern Diplomacy", tier:"specialist", t:"The Guarantee Trap: What the Abu Dhabi talks are really about", u:"https://moderndiplomacy.eu/2026/11/11/the-guarantee-trap-what-the-abu-dhabi-talks-are-really-about/"},
    {n:"Wikipedia", tier:"other", t:"2026 United States–Ukraine–Russia meetings in Abu Dhabi", u:"https://en.wikipedia.org/wiki/2026_United_States%E2%80%93Ukraine%E2%80%93Russia_meetings_in_Abu_Dhabi"}
  ]
},
{
  id:"cop31", topics:["Climate","Energy"], regions:["Global","Europe"], importance:7,
  date:"2026-11-11T09:15", readMin:3,
  headline:"World leaders gather in Antalya as COP31 tries to turn climate promises into action",
  summary:"The UN climate summit runs until 20 November. A new UN report says current pledges still lead to about 2.6°C of warming this century.",
  why:"This is where governments decide how fast the world moves away from fossil fuels and who pays for it. That shapes energy prices, regulation and investment for years.",
  background:[
    {t:"A 2026 UN report projects about 2.6°C of warming this century even if countries fully meet their pledges, well above the Paris Agreement goals.", s:[7]},
    {t:"Countries submitted updated national climate plans (NDCs) in 2025. COP31 is meant to test whether they are being implemented.", s:[9,11]},
    {t:"The summit follows a year of severe floods, heat waves and droughts, adding pressure for faster cuts and more finance.", s:[1,7]}
  ],
  event:[
    {t:"COP31 opened on 9 November in Antalya, Türkiye, and runs until 20 November.", s:[1,4,7]},
    {t:"An unusual split: Türkiye hosts and holds the presidency, while Australia’s climate minister Chris Bowen leads the negotiations.", s:[2,7,10]},
    {t:"A World Leaders’ Summit takes place on 11–12 November.", s:[7]},
    {t:"The talks opened with an early fight over money: developing countries pushed to put climate finance on the official agenda.", s:[5]},
    {t:"The theme is “COP of Implementation”: turning past promises into measurable results.", s:[7,9]}
  ],
  chain:[
    "Pledges fall short of the Paris goals",
    "Pressure grows for more money for developing countries",
    "Richer countries face tight budgets in a year of high energy costs",
    "The outcome shapes rules and investment in clean energy"
  ],
  story:[
    {d:"2015", t:"Paris Agreement: keep warming well below 2°C.", s:[]},
    {d:"2024", t:"COP29 in Baku agrees a new climate finance goal (the NCQG).", s:[9]},
    {d:"2025", t:"COP30 in Belém, Brazil. Countries submit updated climate plans.", s:[9,11]},
    {d:"2026", t:"Türkiye and Australia both want to host; they agree to share the role.", s:[2,11]},
    {d:"9 Nov 2026", t:"COP31 opens in Antalya.", s:[1,7]}
  ],
  pattern:"Each COP agrees new goals, but the gap between promises and actual emission cuts remains large.",
  persp:{type:"national", items:[
    {who:"Türkiye (host)", outlet:"Reuters (via Al-Monitor)", desc:"", text:"President Erdogan argues that countries cannot move at the same pace while gaps in finance and technology persist, and that climate targets must match social and economic realities.", s:[2]},
    {who:"Türkiye’s government", outlet:"TRT World", desc:"Turkish state broadcaster", state:true, text:"Environment minister Murat Kurum says developed countries must deliver the finance they promised, and backs the $1.3 trillion “Baku to Belém Roadmap”.", s:[8]},
    {who:"United Nations", outlet:"Khaleej Times", desc:"UAE daily", text:"The UN secretary-general told leaders to “get serious”: cut emissions faster, move away from fossil fuels and deliver finance to vulnerable countries.", s:[5]},
    {who:"Developing countries", outlet:"Khaleej Times", desc:"UAE daily", text:"They fought to put climate finance on the official agenda before the summit opened. A “climate finance work programme” was added.", s:[5]},
    {who:"Pacific island states", outlet:"Yeni Şafak", desc:"Turkish daily, citing the state news agency", text:"Pre-summit meetings in Fiji and Tuvalu were organised to amplify island nations facing existential climate threats.", s:[6]}
  ]},
  connected:[
    {t:"Energy security is under pressure: Reuters calculates almost half the world’s oil now comes from countries affected by conflict.", link:"oil-drop", s:[3]},
    {t:"High energy prices this year have pushed central banks to raise rates.", link:"ecb-lagarde"}
  ],
  scenarios:[
    {lik:"Likely", name:"Modest deal", what:"Agreement on tracking and implementing existing pledges, no major new targets.", mkts:"Limited market impact."},
    {lik:"Possible", name:"Finance package", what:"A stronger package to help vulnerable countries adapt.", mkts:"Positive for clean-energy and infrastructure firms."},
    {lik:"Less likely", name:"Stalemate", what:"Talks stall over money and end with a weak text.", mkts:"Clean-energy stocks under pressure."}
  ],
  watch:["Leaders’ speeches on 11–12 November","The climate finance text","The final agreement around 20 November"],
  impact:[
    {a:"clean", asset:"Clean-energy stocks", dir:"mixed", note:"Depends on the finance outcome"},
    {a:"clean", asset:"Carbon markets", dir:"mixed", note:"New rules could change demand"}
  ],
  business:["Companies may face stricter climate reporting and transition rules.","Adaptation spending (flood defences, water, resilient buildings) creates contracts.","Energy-intensive firms watch for signals on moving away from fossil fuels."],
  terms:[
    {k:"COP", v:"“Conference of the Parties”: the yearly UN climate summit where almost every country negotiates."},
    {k:"NDC", v:"“Nationally Determined Contribution”: each country’s own climate plan and emissions target."},
    {k:"Climate finance", v:"Money from richer countries to help poorer ones cut emissions and adapt to climate impacts."}
  ],
  simple:"Once a year, almost every country meets to agree how to slow climate change. The promises made so far would still warm the planet by about 2.6°C. This year’s meeting in Türkiye is about checking that countries do what they promised, and finding money for poorer countries.",
  quiz:[
    {q:"Where is COP31 being held?", o:["Belém, Brazil","Antalya, Türkiye","Baku, Azerbaijan","Sydney, Australia"], c:1, e:"COP31 runs from 9 to 20 November in Antalya. Türkiye hosts, while Australia leads the negotiations.", s:[4,7]},
    {q:"According to a 2026 UN report, how much warming do current pledges lead to this century?", o:["About 1.5°C","About 2.0°C","About 2.6°C","About 4°C"], c:2, e:"The UN projects about 2.6°C even if countries fully meet their pledges, well above the Paris goals.", s:[7]}
  ],
  sources:[
    {n:"Reuters (via BusinessDay)", tier:"agency", t:"COP31 leaders urge faster global action on climate", u:"https://www.businessday.co.za/world/europe/2026-11-09-cop31-leaders-urge-faster-global-action-on-climate/"},
    {n:"Reuters (via Al-Monitor)", tier:"agency", t:"Turkey’s Erdogan says equal climate pace unrealistic due to financing gaps", u:"https://www.al-monitor.com/originals/2026/09/turkeys-erdogan-says-equal-climate-pace-unrealistic-due-financing-gaps"},
    {n:"Reuters (via Devdiscourse)", tier:"agency", t:"Reuters World News Summary", u:"https://www.devdiscourse.com/article/international/3967640-reuters-world-news-summary"},
    {n:"UNCCD (United Nations)", tier:"official", t:"2026 UN Climate Change Conference COP31", u:"https://www.unccd.int/index%2Ephp/de/node/30380"},
    {n:"Khaleej Times", tier:"national", t:"COP31 opens with leaders told to ‘get serious’ about tackling climate crisis", u:"https://www.khaleejtimes.com/world/cop31-opens-leaders-pressure-tackle-climate-crisis"},
    {n:"Yeni Şafak", tier:"national", t:"Türkiye to host COP31 in Antalya with focus on implementation", u:"https://en.yenisafak.com/turkiye/erdogan-cop31-in-antalya-to-turn-climate-decisions-into-action-3723649"},
    {n:"Anadolu Agency", tier:"state", t:"COP31 climate summit opens in Türkiye amid calls for stronger action", u:"https://aa.com.tr/en/turkiye/cop31-climate-summit-opens-in-turkiye-amid-calls-for-stronger-action/4116474"},
    {n:"TRT World", tier:"state", t:"COP31 in Antalya to usher in new era of climate cooperation: Türkiye’s Kurum", u:"https://trtworld.com/article/fbc80fcaa851"},
    {n:"Arab Forum for Environment and Development", tier:"specialist", t:"COP31: 31st UN Climate Change Conference", u:"https://afforum.org/new/web/node/8393"},
    {n:"IWRA", tier:"specialist", t:"COP 31, 9–20 November 2026", u:"https://www.iwra.org/event/cop-31/"},
    {n:"UnderstandUPSC", tier:"other", t:"COP31, Antalya", u:"https://www.understandupsc.com/cop31-antalya/"}
  ]
},
{
  id:"iran-talks", topics:["Geopolitics","Energy"], regions:["ME","US"], importance:9,
  date:"2026-11-06T18:40", readMin:3,
  headline:"US–Iran talks continue through Qatar as Washington weighs its next move",
  summary:"Nine months into the war, mediators are trying to restart a peace process. Iran calls US outreach “a positive step” but sets conditions.",
  why:"The war threatens the Strait of Hormuz, a key route for Gulf oil. Progress or failure here moves oil prices, inflation and central bank decisions around the world.",
  background:[
    {t:"The US and Israel launched a war against Iran in late February 2026.", s:[2,6]},
    {t:"Talks led by US Vice President JD Vance in Islamabad in April produced an initial agreement. It unravelled after Iran’s Revolutionary Guards resumed attacks on commercial shipping.", s:[8,7]},
    {t:"Qatar, alongside Pakistan, has mediated between the two sides for months.", s:[5,7]}
  ],
  event:[
    {t:"Iranian envoys met Qatari mediators in Doha on 31 October, after more than 12 hours of talks in Tehran the day before.", s:[1]},
    {t:"Iran’s foreign minister called a letter from JD Vance “a positive step”, but said talks depend on Iran’s conditions being met.", s:[4,7,9]},
    {t:"Secretary of State Marco Rubio said Qatar-led talks are ongoing and have “never stopped”.", s:[3]},
    {t:"On 6 November, Trump told reporters: “We’re talking to them.”", s:[8]},
    {t:"Before the midterms, Trump had repeatedly suggested the US could attack Iran after the 3 November vote.", s:[1,3]}
  ],
  chain:[
    "Talks make progress",
    "Lower risk of attacks on tankers in the Gulf",
    "Oil prices fall",
    "Inflation pressure eases",
    "Central banks feel less need to raise rates"
  ],
  story:[
    {d:"Late Feb 2026", t:"The US and Israel launch a war against Iran. Ukraine peace talks are paused.", s:[2,6]},
    {d:"Apr 2026", t:"Talks in Islamabad led by JD Vance produce an initial agreement.", s:[8]},
    {d:"Summer 2026", t:"The deal unravels after new attacks on shipping. Qatar steps up mediation in Doha.", s:[8,5]},
    {d:"31 Oct", t:"Iran calls a letter from Vance a positive step; its envoys meet mediators in Doha.", s:[1,4]},
    {d:"6 Nov", t:"Trump says the US is talking to Tehran.", s:[8]}
  ],
  pattern:"Talks repeatedly make progress, then stall after new attacks. Oil prices swing with every headline.",
  persp:{type:"national", items:[
    {who:"Iran", outlet:"Al Jazeera · Tasnim", desc:"Qatar-based broadcaster · Iranian semi-official news agency", text:"Foreign Minister Abbas Araghchi called the US outreach “a positive step” but set conditions: lifting sanctions imposed after the Islamabad memorandum, fewer US forces in the region, restored oil waivers and the release of frozen funds. He said there were no plans yet to meet US officials.", s:[4,9]},
    {who:"United States", outlet:"Al Jazeera", desc:"", text:"Marco Rubio says talks have never stopped and the US is open to a diplomatic solution. Trump says talks are “going fine”, but that the US still has Iranian targets.", s:[3]},
    {who:"Qatar (mediator)", outlet:"Open Magazine · The Jerusalem Post", desc:"Indian weekly · Israeli daily", text:"Qatar denied reports that its prime minister had called the talks a failure. Qatari and Pakistani mediators continue to discuss Iran’s conditions.", s:[8,7]},
    {who:"Analysts", outlet:"Al Jazeera", desc:"", text:"One analyst argued that before the US midterms Iran had an incentive to delay concessions to deny Trump a diplomatic win, a calculation that could change after the vote.", s:[3]}
  ]},
  connected:[
    {t:"Oil had one of its steepest weekly drops on hopes of a deal.", link:"oil-drop"},
    {t:"Republican leaders, including Vance, blamed the Iran war for their midterm defeat.", link:"midterms"},
    {t:"Witkoff and Kushner, who have worked on Iran diplomacy, also lead the US side in the Ukraine talks.", link:"abu-dhabi-talks"}
  ],
  scenarios:[
    {lik:"Likely", name:"Slow talks", what:"Indirect talks continue without a full deal soon.", mkts:"Oil stays volatile and headline-driven."},
    {lik:"Possible", name:"New ceasefire", what:"A new ceasefire or interim deal.", mkts:"Oil falls further. Airlines and shipping gain. Gold eases."},
    {lik:"Less likely", name:"Renewed strikes", what:"The US resumes military action.", mkts:"Oil jumps back above $100. Safe havens like gold and the franc rise."}
  ],
  watch:["Announcements from Qatar’s foreign ministry","Attacks on shipping near Hormuz","Statements from Vance or Witkoff"],
  impact:[
    {a:"oil", asset:"Oil", dir:"down", note:"Deal hopes push prices lower"},
    {a:"gold", asset:"Gold", dir:"mixed", note:"Safe-haven demand falls if talks progress"},
    {a:"airlines", asset:"Airlines & shipping", dir:"up", note:"Cheaper fuel, safer routes"}
  ],
  business:["Airlines and transport firms gain if fuel costs fall.","Shipping firms still face high freight and insurance costs in the Gulf.","Energy-intensive industries in Europe and Asia are the most exposed."],
  terms:[
    {k:"Strait of Hormuz", v:"A narrow sea passage between Iran and Oman. A large share of the world’s oil exports passes through it."},
    {k:"Revolutionary Guards (IRGC)", v:"Iran’s elite military force, separate from the regular army, with its own navy and strong political power."},
    {k:"Indirect talks", v:"The two sides don’t meet face to face. A mediator, here Qatar, passes messages between them."}
  ],
  simple:"The US and Iran have been at war since February. They don’t talk face to face; Qatar passes messages between them. A deal would make the Gulf safer for oil tankers, which would make fuel cheaper around the world.",
  quiz:[
    {q:"Which country leads the mediation between the US and Iran?", o:["Oman","Egypt","Qatar","Türkiye"], c:2, e:"Qatar leads the mediation, working alongside Pakistan.", s:[5,7]},
    {q:"How did Iran’s foreign minister describe the latest US outreach?", o:["“A positive step”","“A trap”","“An ultimatum”","“Irrelevant”"], c:0, e:"Abbas Araghchi called it a positive step, but said talks depend on Iran’s conditions being met.", s:[4,9]}
  ],
  sources:[
    {n:"Reuters (via Khaleej Times)", tier:"agency", t:"Iranian envoys meet Qatari mediators as threat looms of US strikes after midterms", u:"https://www.khaleejtimes.com/world/mena/iranian-envoys-meet-qatari-mediators-threat-us-strikes-after-midterms"},
    {n:"Reuters (via Khaleej Times)", tier:"agency", t:"US to mediate Russia-Ukraine talks in Abu Dhabi next week, Witkoff says", u:"https://www.khaleejtimes.com/us-mediate-russia-ukraine-talks-abu-dhabi-november-witkoff"},
    {n:"Al Jazeera", tier:"intl", t:"Mediators continue US-Iran negotiations amid war rhetoric: What we know", u:"https://aljazeera.com/news/2026/11/1/mediators-continue-us-iran-negotiations-amid-war-rhetoric-what-we-know"},
    {n:"Al Jazeera", tier:"intl", t:"Iran FM says US outreach a ‘positive step’ as delegation in Qatar for talks", u:"https://www.aljazeera.com/news/2026/11/01/iran-fm-says-us-outreach-a-positive-step-as-delegation-in-qatar-for-talks"},
    {n:"Al Jazeera", tier:"intl", t:"US-Iran talks in Doha: What were the outcomes and what’s next?", u:"https://aljazeera.com/news/2026/7/2/us-iran-talks-in-doha-what-were-the-outcomes-and-whats-next"},
    {n:"Kyiv Post", tier:"national", t:"Russia to send a higher-level delegation to the Abu Dhabi talks", u:"https://kyivpost.com/post/89466"},
    {n:"The Jerusalem Post", tier:"national", t:"Araghchi calls Vance letter a ‘positive step’", u:"https://jpost.com/middle-east/iran-news/article-913396"},
    {n:"Open Magazine", tier:"national", t:"US-Iran talks continue as JD Vance pushes for a new ceasefire", u:"https://openthemagazine.com/world/us-iran-talks-continue-as-jd-vance-pushes-for-a-new-ceasefire"},
    {n:"Tasnim", tier:"state", t:"Araqchi: US bid to open dialogue with Iran a ‘positive step’", u:"https://www.tasnimnews.ir/en/news/2026/10/31/3736889/araqchi-us-bid-to-open-dialogue-with-iran-a-positive-step/amp"}
  ]
},
{
  id:"oil-drop", topics:["Markets","Energy"], regions:["Global","ME"], importance:8,
  date:"2026-11-06T20:10", readMin:2,
  headline:"Oil has one of its steepest weekly drops as peace hopes grow",
  summary:"Brent fell about 15% in a week to around $99 a barrel, as traders bet on US–Iran diplomacy after the US midterms.",
  why:"Oil feeds into almost everything: fuel, transport, food and heating. A big fall eases inflation and can change what central banks do next.",
  background:[
    {t:"The Iran war has made oil much more expensive: US crude was still up about 48% over 12 months in early November.", s:[4]},
    {t:"Attacks on oil tankers remain close to record levels.", s:[4]}
  ],
  event:[
    {t:"Brent fell about 15% over the week to around $99 a barrel.", s:[3]},
    {t:"Dow Jones put the weekly loss at about 14%, with crude falling below $100.", s:[1]},
    {t:"Prices fell 8% on Wednesday alone, after the Democrats’ sweep in the midterms.", s:[5]},
    {t:"Traders are betting on progress in US–Iran diplomacy.", s:[1,3]},
    {t:"Gulf crude exports have recovered to near pre-war levels, but transport costs remain high. US diesel and heating oil stocks are at their lowest in over two decades.", s:[1,4]}
  ],
  chain:[
    "Peace hopes and the US midterm result",
    "Traders remove part of the ‘war premium’ from prices",
    "Cheaper fuel eases inflation",
    "The Fed and ECB feel less pressure to raise rates",
    "But low diesel stocks keep a risk for the winter"
  ],
  story:[
    {d:"Late Feb 2026", t:"The war with Iran disrupts Gulf supply and prices surge.", s:[3,4]},
    {d:"3 Nov", t:"Brent closes at $103.60, its lowest since 7 October, on hopes of ending the wars in Ukraine and Iran.", s:[2]},
    {d:"4 Nov", t:"Prices drop 8% in a day after the midterms.", s:[5]},
    {d:"6 Nov", t:"Weekly loss of about 14–15%; crude below $100.", s:[1,3]}
  ],
  pattern:"Oil now trades on diplomacy headlines: hope pushes it down fast, attacks push it back up.",
  persp:{type:"market", items:[
    {who:"Bearish view", outlet:"Dow Jones (via Morningstar)", desc:"", text:"Analysts say prices could fall further if diplomatic efforts look promising.", s:[1]},
    {who:"Cautious view", outlet:"OilPrice.com · Trading Economics", desc:"", text:"The war is not over: traders are pricing in a peace that has not happened yet, while attacks on shipping continue near record levels.", s:[3,4]},
    {who:"Supply risk", outlet:"Dow Jones (via Morningstar)", desc:"", text:"US diesel and heating oil stocks are at their lowest in over 20 years, a risk as winter starts.", s:[1]}
  ]},
  connected:[
    {t:"US–Iran talks through Qatar", link:"iran-talks"},
    {t:"Democrats win both chambers of Congress", link:"midterms"},
    {t:"The Fed’s next decision on 8–9 December", link:"fed-hold"}
  ],
  scenarios:[
    {lik:"Likely", name:"Choppy", what:"Prices keep swinging on every headline from the Gulf.", mkts:"Large daily moves in both directions."},
    {lik:"Possible", name:"Deal", what:"A US–Iran agreement pushes prices lower.", mkts:"Energy stocks down; airlines and consumers benefit."},
    {lik:"Less likely", name:"Escalation", what:"New fighting in the Gulf.", mkts:"Brent back above $100, inflation fears return."}
  ],
  watch:["US–Iran talks","Weekly US inventory data (EIA)","Diesel supply as winter starts"],
  impact:[
    {a:"oil", asset:"Brent crude", dir:"down", note:"About −15% on the week"},
    {a:"airlines", asset:"Airline stocks", dir:"up", note:"Lower fuel costs"},
    {a:"energy", asset:"Oil producers", dir:"down", note:"Lower prices squeeze revenue"},
    {a:"bonds", asset:"Inflation expectations", dir:"down", note:"Cheaper energy"}
  ],
  business:["Airlines, logistics and chemical companies benefit from cheaper fuel.","Oil producers and service firms face lower revenue.","Diesel users (trucking, farming) still face tight supply this winter."],
  terms:[
    {k:"Brent", v:"The main global oil price benchmark, based on North Sea crude."},
    {k:"Barrel", v:"The standard unit for oil: 159 litres."},
    {k:"Risk premium", v:"The extra amount traders pay because they fear supply could be cut. It shrinks when peace looks likely."}
  ],
  simple:"Oil got much more expensive when the war with Iran started, because people feared tankers couldn’t get through the Gulf. Last week, hopes for peace made traders less worried, so prices dropped quickly. If talks fail, prices could jump again.",
  quiz:[
    {q:"About how much did Brent fall in the week to 6 November?", o:["About 2%","About 15%","About 30%","About 50%"], c:1, e:"Brent fell about 14–15% over the week, to around $99 a barrel.", s:[1,3]},
    {q:"What mainly pushed oil prices down that week?", o:["OPEC raised output","A mild winter","Hopes of US–Iran diplomacy","A stronger euro"], c:2, e:"Traders bet that US–Iran diplomacy would make Gulf supply safer, so they removed part of the war premium.", s:[1,3]}
  ],
  sources:[
    {n:"Dow Jones (via Morningstar)", tier:"agency", t:"The week in oil: crude falls below $100 a barrel amid US midterms shake-up", u:"https://www.morningstar.com/news/dow-jones/2026110610023/the-week-in-oil-crude-falls-below-100-a-barrel-amid-us-midterms-shake-up"},
    {n:"The Nation (Thailand)", tier:"national", t:"Brent falls 1% on November 3 amid hopes for peace deals", u:"https://www.nationthailand.com/news/world/40073076"},
    {n:"OilPrice.com", tier:"specialist", t:"The Iran war isn’t over, but oil traders are already pricing in peace", u:"https://oilprice.com/Energy/Energy-General/The-Iran-War-Isnt-Over-but-Oil-Traders-Are-Already-Pricing-In-Peace.html"},
    {n:"Trading Economics", tier:"specialist", t:"Crude oil news", u:"https://tradingeconomics.com/commodity/crude-oil/news/598265"},
    {n:"Offshore Engineer", tier:"specialist", t:"Oil heads for steep weekly drop despite Middle East supply risks", u:"https://www.oedigital.com/amp/news/544192-oil-heads-for-steep-weekly-drop-despite-middle-east-supply-risks"}
  ]
},
{
  id:"midterms", topics:["Politics"], regions:["US"], importance:9,
  date:"2026-11-04T08:00", readMin:3,
  headline:"Democrats win control of both chambers of Congress",
  summary:"The midterms end Republican control of the White House, Senate and House. Democrats flipped seven Senate seats.",
  why:"With divided government, President Trump’s agenda now needs Democratic votes. Congress can block nominations, launch investigations and shape budgets, which affects policy from trade to the Fed.",
  background:[
    {t:"Midterms often go against the president’s party: between 1934 and 2018 it lost an average of 28 House seats.", s:[11]},
    {t:"Cost of living and inflation were central issues in the campaign.", s:[3,5]},
    {t:"Before the vote, Republicans held the White House, the Senate and the House.", s:[2]}
  ],
  event:[
    {t:"Democrats won control of both the House and the Senate on 3 November.", s:[2,4,5]},
    {t:"They flipped seven Senate seats: North Carolina, South Carolina, Ohio, Texas, Kansas, Iowa and Maine.", s:[1,5]},
    {t:"Democrats hold at least 54 Senate seats; by Thursday the count showed 240 House seats for them.", s:[6,7]},
    {t:"It is the first time since 2023 that Democrats fully control Congress.", s:[5]}
  ],
  chain:[
    "Democrats control both chambers",
    "Trump’s bills need their support; gridlock becomes more likely",
    "The Senate can block judges and nominees",
    "More oversight and investigations of the administration"
  ],
  story:[
    {d:"2018", t:"In Trump’s first term, Democrats win the House in the midterms.", s:[1]},
    {d:"Nov 2024", t:"Republicans win the White House and both chambers.", s:[2]},
    {d:"Sep 2026", t:"The Fed raises rates as inflation stays high; cost of living dominates the campaign.", s:[3]},
    {d:"3 Nov 2026", t:"Democrats win both chambers.", s:[2,5]}
  ],
  pattern:"The president’s party usually loses ground in midterms. This time the swing also flipped the Senate, which is much rarer.",
  persp:{type:"political", ratingSrc:[10], items:[
    {outlet:"NPR", lean:"leanLeft", text:"Frames the result as the start of a new era of divided government with deeper friction between Trump and Congress, driven by a cost-of-living message.", s:[5]},
    {outlet:"The New York Times", lean:"leanLeft", text:"Speaks of a “blistering rebuke” to Trump, but also reports that he said he is willing to accept the results and work with Democrats.", s:[4]},
    {outlet:"Washington Examiner", lean:"leanRight", text:"Calls it a “historic blue wave” and focuses on the Republican post-mortem: several party leaders, including Vice President Vance, blamed the Iran war, and Senator Ted Cruz said the party ignored the cost of living.", s:[6]},
    {who:"Republican leadership", outlet:"States Newsroom", text:"Senate Republican leader John Thune vowed that Republicans “will not stand idly by” as Democrats try to undo their record on the border and tax cuts.", s:[8]}
  ]},
  connected:[
    {t:"Oil fell 8% the day after the vote.", link:"oil-drop"},
    {t:"Republican leaders blamed the Iran war for the losses.", link:"iran-talks"},
    {t:"A Democratic Congress means stronger oversight, including over the Fed.", link:"fed-hold"}
  ],
  scenarios:[
    {lik:"Likely", name:"Gridlock", what:"Few major laws pass; more investigations and blocked nominations.", mkts:"More policy uncertainty in Washington."},
    {lik:"Possible", name:"Targeted deals", what:"Agreements on specific cost-of-living measures.", mkts:"Moves in the sectors concerned."},
    {lik:"Less likely", name:"Broad cooperation", what:"A wide bipartisan agenda before 2028.", mkts:"Lower policy uncertainty."}
  ],
  watch:["Final results in the remaining races","Who leads key committees in January","The first budget negotiations with the White House"],
  impact:[
    {a:"oil", asset:"Oil", dir:"down", note:"−8% the day after the vote"},
    {a:null, asset:"US policy uncertainty", dir:"up", note:"Divided government makes laws harder to pass"}
  ],
  business:["Major new laws become harder to pass, so regulatory changes slow down.","Companies in sectors under scrutiny may face congressional hearings.","Budget negotiations could affect government contracts."],
  terms:[
    {k:"Midterms", v:"US elections held halfway through a president’s four-year term, for all House seats and about a third of the Senate."},
    {k:"Divided government", v:"When the president’s party does not control Congress."},
    {k:"Confirmation", v:"The Senate’s vote to approve judges, ministers and other senior officials chosen by the president."}
  ],
  simple:"Americans vote for Congress halfway through a president’s term. This time voters gave both parts of Congress to the Democrats. President Trump now needs their votes to pass laws, a bit like a CEO who has lost control of the board.",
  quiz:[
    {q:"How many Senate seats did Democrats flip in the midterms?", o:["2","4","7","12"], c:2, e:"They flipped seven: North Carolina, South Carolina, Ohio, Texas, Kansas, Iowa and Maine.", s:[1,5]},
    {q:"Which outlet, rated Lean Right by AllSides, focused on Republicans blaming the Iran war for their losses?", o:["NPR","Washington Examiner","The New York Times","Al Jazeera"], c:1, e:"The Washington Examiner, rated Lean Right, highlighted the Republican post-mortem.", s:[6,10]}
  ],
  sources:[
    {n:"AP (via WTOC)", tier:"agency", t:"Trump responds as voters deliver rebuke by flipping key GOP-held Senate seats", u:"https://www.wtoc.com/2026/11/04/voters-deliver-rebuke-trump-by-flipping-several-gop-held-senate-seats/?outputType=amp"},
    {n:"AP (via WFTV)", tier:"agency", t:"Election 2026: Democrats capture both chambers of Congress", u:"https://www.wftv.com/news/trending/election-2026-democrats-capture-both-houses-congress/5ILOWTVABVDPZFYP7VBBCX4EWE/"},
    {n:"Reuters (via GV Wire)", tier:"agency", t:"Fed holds rates steady as it awaits ‘accumulation of more information’", u:"https://gvwire.com/2026/10/28/fed-holds-rates-steady-as-it-awaits-accumulation-of-more-information/"},
    {n:"The New York Times (via GV Wire)", tier:"intl", t:"Democrats’ sweeping win resets power in Washington", u:"https://gvwire.com/2026/11/04/democrats-sweeping-win-resets-power-in-washington/"},
    {n:"NPR", tier:"intl", t:"Democrats win full control of Congress, ushering in a new era of divided government", u:"https://www.kuow.org/npr-news/2026-11-03/democrats-win-full-control-of-congress-ushering-in-a-new-era-of-divided-government"},
    {n:"Washington Examiner", tier:"national", t:"2026 midterm elections live updates: Democrats regain control of Congress", u:"https://www.washingtonexaminer.com/live-blog/2026-midterm-elections-live-updates/?highlight=4790524"},
    {n:"The Philadelphia Inquirer", tier:"national", t:"Republicans wake up to a new reality and brace for a new Washington", u:"https://www.inquirer.com/politics/nation/republican-reality-midterm-election-results-20261104.html"},
    {n:"States Newsroom", tier:"national", t:"Democrats flip control of the U.S. Senate", u:"https://www.newsfromthestates.com/node/436171"},
    {n:"Offshore Engineer", tier:"specialist", t:"Oil heads for steep weekly drop despite Middle East supply risks", u:"https://www.oedigital.com/amp/news/544192-oil-heads-for-steep-weekly-drop-despite-middle-east-supply-risks"},
    {n:"AllSides", tier:"specialist", t:"AllSides Media Bias Ratings", u:"https://www.allsides.com/media-bias"},
    {n:"American Bazaar", tier:"other", t:"Has America seen a midterm upset like this before?", u:"https://americanbazaaronline.com/2026/11/04/has-america-seen-a-midterm-upset-like-this-before-491503/"}
  ]
},
{
  id:"ecb-lagarde", topics:["Economy","Markets"], regions:["Europe"], importance:7,
  date:"2026-10-29T15:20", readMin:3,
  headline:"ECB holds rates at 2.5% as Lagarde announces she will leave early",
  summary:"The ECB paused after two hikes this year. Christine Lagarde will step down on 7 February 2027, about nine months before her term ends.",
  why:"ECB rates set the cost of mortgages and business loans across the euro area. A new president in 2027 could change the bank’s direction.",
  background:[
    {t:"The ECB raised rates in June and September 2026, taking the deposit rate to 2.50%.", s:[10,11]},
    {t:"Euro area inflation was 3.2% in August, well above the 2% target, pushed up by energy prices from the Middle East conflict.", s:[10,11]}
  ],
  event:[
    {t:"On 29 October the ECB kept its three key rates unchanged: deposit 2.50%, main refinancing 2.65%, marginal lending 2.90%.", s:[2,3]},
    {t:"It will keep deciding meeting by meeting, without committing to a path.", s:[2,3]},
    {t:"The same day, Christine Lagarde announced she will step down on 7 February 2027, about nine months before her term ends.", s:[1,5,8]},
    {t:"EU leaders will appoint her successor. The timing lets them decide before France’s presidential election in April 2027.", s:[1,4,5]}
  ],
  chain:[
    "Energy shock from the Middle East",
    "Euro area inflation rises above target",
    "The ECB hikes twice in 2026",
    "It now pauses as oil falls",
    "A leadership change adds uncertainty for 2027"
  ],
  story:[
    {d:"Nov 2019", t:"Lagarde becomes ECB president for an eight-year term.", s:[5]},
    {d:"Feb 2026", t:"Reports say Lagarde may leave early; Klaas Knot and Pablo Hernández de Cos are named as possible successors.", s:[12]},
    {d:"Apr 2026", t:"After cuts in 2024–25, the deposit rate stands at 2.00%.", s:[10]},
    {d:"Jun & Sep 2026", t:"Two hikes take the deposit rate to 2.50%.", s:[10]},
    {d:"29 Oct 2026", t:"Rates on hold; Lagarde confirms she will leave on 7 February.", s:[1,2]}
  ],
  pattern:"The ECB reversed course: after cutting in 2024–25, the 2026 energy shock pushed it back to raising rates.",
  persp:{type:"debate", items:[
    {who:"In favour (Germany)", outlet:"Bloomberg (via Gulf Times)", desc:"", text:"Economist Alexander Kriwoluzky of the DIW institute in Berlin says the early exit “isn’t problematic”: it lets leaders pick a successor who will defend the ECB’s independence before a French president hostile to it could take office.", s:[6]},
    {who:"Markets", outlet:"Bloomberg · Reuters", desc:"", text:"Rabobank says an early exit could protect the euro from threats to ECB independence. Markets barely reacted to the announcement.", s:[7,4]},
    {who:"Against (Italy)", outlet:"IEP@Bocconi", desc:"Milan university think tank", text:"Economist Ignazio Angeloni argues that shortened mandates politicise the succession and erode the substance of central bank independence.", s:[13]},
    {who:"France", outlet:"Reuters · Payment Expert", desc:"", text:"Polls show far-right candidate Marine Le Pen favoured in the April 2027 election. When the Bank of France governor also left early, the French right called it politically motivated.", s:[4,14]},
    {who:"German government", outlet:"GDN Online", desc:"Bahraini daily", text:"Berlin says it will propose a candidate who supports Germany’s “ideas of stability”: strict inflation targeting and sound public finances.", s:[9]}
  ]},
  connected:[
    {t:"Oil’s steep fall eases the inflation pressure behind the hikes.", link:"oil-drop"},
    {t:"The Fed also paused in October after hiking in September.", link:"fed-hold"},
    {t:"France’s 2027 presidential election shapes the timing of the succession.", link:null}
  ],
  scenarios:[
    {lik:"Likely", name:"Hold", what:"Rates stay on hold in December while the ECB watches oil and inflation.", mkts:"Euro and bond yields broadly stable."},
    {lik:"Possible", name:"Another hike", what:"A further rise if inflation stays high.", mkts:"Euro up, bond prices down, banks benefit."},
    {lik:"Less likely", name:"Cut", what:"A rate cut in the near term.", mkts:"Euro down, bond prices up."}
  ],
  watch:["The next euro area inflation release","The ECB’s December meeting","Candidates to succeed Lagarde"],
  impact:[
    {a:"eur", asset:"Euro", dir:"mixed", note:"Pause, but the door to hikes stays open"},
    {a:"bonds", asset:"Euro area bonds", dir:"mixed", note:"Depends on December"},
    {a:"banks", asset:"Euro area banks", dir:"up", note:"Higher rates support lending margins"}
  ],
  business:["Borrowing costs for companies and households stay higher than a year ago.","Variable-rate mortgages remain expensive.","Exporters watch the euro’s direction."],
  terms:[
    {k:"Deposit rate", v:"What banks earn on money parked at the ECB. It is the ECB’s main policy rate."},
    {k:"Governing Council", v:"The ECB’s decision-making body: six board members plus the central bank governors of the euro countries."},
    {k:"Rate hike", v:"Raising interest rates to make borrowing more expensive and cool inflation."}
  ],
  simple:"The ECB is the euro area’s central bank. When prices rise too fast, it makes borrowing more expensive to cool things down. It did that twice this year and has now paused. Its president, Christine Lagarde, is also leaving early so that European leaders can choose her replacement before France votes.",
  quiz:[
    {q:"Where is the ECB’s deposit rate after the October meeting?", o:["0%","2.00%","2.50%","3.75%"], c:2, e:"The ECB kept the deposit rate at 2.50%, after two hikes in June and September.", s:[2,3]},
    {q:"Why is Christine Lagarde leaving in February 2027?", o:["Her term officially ends then","So EU leaders can choose her successor before France’s 2027 election","Eurozone ministers voted to replace her","The ECB is moving to Paris"], c:1, e:"Leaving early lets current EU leaders pick her successor before France’s presidential election in April 2027.", s:[1,4,5]}
  ],
  sources:[
    {n:"European Central Bank", tier:"official", t:"ECB President Lagarde to step down on 7 February 2027", u:"https://ecb.europa.eu//press/pr/date/2026/html/ecb.pr261029~abbb6dc64b.en.html"},
    {n:"Banque de France", tier:"official", t:"Monetary policy decisions, 29 October 2026", u:"https://www.banque-france.fr/system/files/2026-10/Monetary_policy_decisions_29-10.pdf"},
    {n:"Banco de España", tier:"official", t:"Press release: Monetary policy decisions, 29 October 2026", u:"https://www.bde.es/f/webbe/GAP/Secciones/SalaPrensa/ComunicadosBCE/DecisionesPoliticaMonetaria/26/mp261029en.pdf"},
    {n:"Reuters (via BusinessDay)", tier:"agency", t:"ECB president Lagarde resigns as challenges mount for Europe", u:"https://www.businessday.co.za/world/europe/2026-10-29-ecb-president-lagarde-resigns-as-challenges-mount-for-europe/"},
    {n:"AP (via KSAT)", tier:"agency", t:"ECB President Christine Lagarde will resign Feb. 7, ahead of term", u:"https://www.ksat.com/business/2026/10/29/european-central-bank-president-christine-lagarde-will-resign-feb-7-ahead-of-term/"},
    {n:"Bloomberg (via Gulf Times)", tier:"agency", t:"ECB is risking independence with Lagarde exit maneuvers", u:"https://www.gulf-times.com/article/720921/business/ecb-is-risking-independence-with-lagarde-exit-maneuvers"},
    {n:"Bloomberg", tier:"agency", pay:true, t:"ECB chief’s early departure may reduce risks to euro, Rabo says", u:"https://www.bloomberg.com/news/articles/2026-02-18/lagarde-s-early-exit-may-reduce-risks-to-euro-rabobank-says"},
    {n:"Euronews", tier:"intl", t:"ECB President Christine Lagarde to step down next February", u:"https://euronews.com/2026/10/29/ecb-president-christine-lagarde-to-step-down-in-february-months-before-her-term-ends"},
    {n:"GDN Online", tier:"national", t:"ECB succession: Berlin’s position", u:"https://www.gdnonline.com/Details/1376495"},
    {n:"Admiral Markets", tier:"specialist", t:"ECB meeting October 2026: real dates and what markets watch", u:"https://admiralmarkets.com/analytics/traders-blog/ecb-meeting-october-2026"},
    {n:"LiveSquawk", tier:"specialist", t:"ECB’s ‘no brainer’ rate rise puts October in focus", u:"https://www.livesquawk.com/report/special_ecb-sno-brainerrate-rise-puts-october-in-focus"},
    {n:"Central Banking", tier:"specialist", t:"Changing of Lagarde: who might take over at the ECB?", u:"https://www.centralbanking.com/node/7975094"},
    {n:"IEP@Bocconi", tier:"specialist", t:"Why early departures weaken the ECB", u:"https://iep.unibocconi.eu/why-early-departures-weaken-ecb"},
    {n:"Payment Expert", tier:"specialist", t:"Could Lagarde leave her ECB term early?", u:"https://paymentexpert.com/2026/02/23/ecb-christine-lagarde-future-exit/"}
  ]
},
{
  id:"fed-hold", topics:["Economy","Markets"], regions:["US","Global"], importance:7,
  date:"2026-10-28T20:45", readMin:3,
  headline:"Fed holds rates but leaves the door open to a December hike",
  summary:"The Fed kept rates at 3.75–4.00% in a 10–2 vote. Two officials wanted a hike, and investors expect one in December.",
  why:"The Fed sets the price of money in the world’s largest economy. Its decisions move the dollar, mortgage rates and markets everywhere, including the Swiss franc.",
  background:[
    {t:"In September the Fed raised rates for the first time since 2023, to 3.75–4.00%.", s:[2,6]},
    {t:"Inflation is about one percentage point above the 2% target and has made little progress in recent months.", s:[1]},
    {t:"Fed Chair Kevin Warsh was appointed by President Trump, who has criticised the hike.", s:[2]}
  ],
  event:[
    {t:"On 28 October the Fed held rates at 3.75–4.00% in a 10–2 vote.", s:[1,4]},
    {t:"Governor Lisa Cook and Cleveland Fed President Beth Hammack voted for a quarter-point hike.", s:[2,4]},
    {t:"The Fed said inflation “remains elevated” and that it wants more information before acting.", s:[1]},
    {t:"Investors expect hikes to start at the next meeting, on 8–9 December.", s:[1,2]}
  ],
  chain:[
    "Inflation stays above target",
    "The Fed keeps rates high and may hike again",
    "Mortgages, car loans and credit cards cost more",
    "Higher US rates pull money into the dollar",
    "The franc weakens as investors borrow in francs to buy higher-yielding assets"
  ],
  story:[
    {d:"2022–23", t:"The Fed raises rates sharply to fight inflation.", s:[5]},
    {d:"Dec 2025", t:"Third cut of 2025, to 3.50–3.75%.", s:[5]},
    {d:"Sep 2026", t:"First hike since 2023, to 3.75–4.00%. The franc falls to its lowest against the dollar since 2025.", s:[2,6,7]},
    {d:"28 Oct 2026", t:"Rates on hold, with two officials wanting a hike.", s:[1,4]}
  ],
  pattern:"Like the ECB, the Fed switched from cutting to hiking in 2026 as energy prices pushed inflation up.",
  persp:{type:"debate", items:[
    {who:"White House", outlet:"Associated Press", desc:"", text:"Trump criticised the Fed’s September hike, mostly blaming the rate committee rather than Chair Warsh, whom he appointed.", s:[2]},
    {who:"Fed chair", outlet:"Associated Press", desc:"", text:"Kevin Warsh said “politics played no role” in the decision and that “there is no soft inflation target”.", s:[2,3]},
    {who:"Fed hawks", outlet:"Bloomberg (via WealthManagement)", desc:"", text:"Governor Lisa Cook and Cleveland Fed President Beth Hammack voted to raise rates immediately.", s:[4]},
    {who:"Investors", outlet:"Reuters (via GV Wire)", desc:"", text:"They expect hikes to start in December and continue into 2027 to bring inflation down.", s:[1]},
    {who:"Congress", outlet:"Reuters (via GV Wire)", desc:"", text:"The midterm result gives Democrats stronger oversight powers, including over the Fed.", s:[1]}
  ]},
  connected:[
    {t:"The new Democratic Congress gains more oversight power, including over the Fed.", link:"midterms"},
    {t:"Oil’s fall could ease inflation before December.", link:"oil-drop"},
    {t:"The ECB also paused after two hikes.", link:"ecb-lagarde"}
  ],
  scenarios:[
    {lik:"Likely", name:"December hike", what:"A quarter-point hike on 8–9 December.", mkts:"Dollar up, bond prices down, pressure on growth stocks."},
    {lik:"Possible", name:"Hold", what:"Another pause if oil keeps falling and inflation cools.", mkts:"Relief for stocks and bonds."},
    {lik:"Less likely", name:"Cut", what:"A rate cut.", mkts:"Dollar down."}
  ],
  watch:["US inflation data before December","Fed decision on 8–9 December","Swiss National Bank decision on 10 December"],
  impact:[
    {a:"usd", asset:"US dollar", dir:"up", note:"Higher US rates attract capital"},
    {a:"bonds", asset:"US Treasuries", dir:"down", note:"Prices fall if hikes resume"},
    {a:"chf", asset:"Swiss franc vs dollar", dir:"down", note:"Wide gap with the SNB’s 0% rate"}
  ],
  business:["Companies borrowing in dollars face higher costs.","US housing and car sales stay under pressure.","Swiss exporters benefit from a weaker franc."],
  terms:[
    {k:"FOMC", v:"The Federal Open Market Committee: the 12 Fed officials who vote on US interest rates."},
    {k:"Dissent", v:"A vote against the majority decision. Two dissents in favour of a hike signal pressure to tighten."},
    {k:"Carry trade", v:"Borrowing in a low-rate currency (like the franc) to invest in a higher-rate one (like the dollar)."}
  ],
  simple:"The Fed is America’s central bank. It raised rates in September to slow price rises, and in October it waited to see the effect. Two members wanted to raise again, and many investors think it will in December.",
  quiz:[
    {q:"What did the Fed do on 28 October?", o:["Raised rates by 0.25 points","Held rates at 3.75–4.00%","Cut rates by 0.25 points","Cut rates by 0.50 points"], c:1, e:"The Fed held rates in a 10–2 vote. Two officials wanted a hike.", s:[1,4]},
    {q:"What is a “carry trade”?", o:["Moving gold between central banks","Borrowing in a low-rate currency to invest in a higher-rate one","Buying shares with borrowed money","Shipping goods by sea"], c:1, e:"Investors borrow in a cheap currency like the franc to buy higher-yielding assets, which weakens the franc.", s:[7]}
  ],
  sources:[
    {n:"Reuters (via GV Wire)", tier:"agency", t:"Fed holds rates steady as it awaits ‘accumulation of more information’", u:"https://gvwire.com/2026/10/28/fed-holds-rates-steady-as-it-awaits-accumulation-of-more-information/"},
    {n:"AP (via WTOC)", tier:"agency", t:"Federal Reserve keeps interest rates unchanged ahead of midterms despite elevated inflation", u:"https://www.wtoc.com/2026/10/28/federal-reserve-keeps-interest-rates-unchanged-ahead-midterms-despite-elevated-inflation/"},
    {n:"AP (via WSMV)", tier:"agency", t:"Federal Reserve keeps interest rates unchanged (Warsh press conference)", u:"https://www.wsmv.com/2026/10/28/federal-reserve-keeps-interest-rates-unchanged-ahead-midterms-despite-elevated-inflation/?outputType=amp"},
    {n:"Bloomberg (via WealthManagement)", tier:"agency", t:"Fed holds rates, says more data will help next decision", u:"https://www.wealthmanagement.com/fixed-income/fed-holds-rates-says-more-data-will-help-next-decision"},
    {n:"CBS News", tier:"intl", t:"Federal Reserve lowers its benchmark interest rate in third straight cut", u:"https://www.cbsnews.com/news/federal-reserve-fomc-meeting-today-rate-cut-decision-jerome-powell"},
    {n:"Admiral Markets", tier:"specialist", t:"SNB rate decision September 2026", u:"https://admiralmarkets.com/analytics/traders-blog/snb-rate-decision-september-2026"},
    {n:"Trading Economics", tier:"specialist", t:"Swiss franc weakens after SNB decision", u:"https://tradingeconomics.com/switzerland/currency/news/586472"}
  ]
}
];

const CALENDAR = [
  {from:"2026-11-20", k:"cal1", t:"Climate"},
  {from:"2026-12-08", to:"2026-12-09", k:"cal2", t:"Economy"},
  {from:"2026-12-10", k:"cal3", t:"Economy"},
  {from:"2027-02-07", k:"cal4", t:"Economy", year:true}
];
