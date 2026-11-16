/* ---------- Context: background, who's who and a sourced timeline for each story ----------
   Checked 12 Nov 2026 under the Daily Brief sourcing rules (claude/sourcing-rules.md).
   s: numbers point to the story's existing sources; strings point to the new sources in src (k).
   Timeline tags: key = turning point, tag "now" = this story, "after" = since this story, "next" = scheduled. */
const CTX = {
"abu-dhabi-talks": {
  intro:"Russia and Ukraine have been fighting since 2014, and in a full-scale war since February 2022. Russia occupies about a fifth of Ukraine. The US has been trying to broker a deal, but each round of talks ends the same way: prisoner swaps, but no agreement on the big question of who keeps which land and who protects Ukraine afterwards.",
  is:["ap_crimea",4,13],
  players:[
    {n:"Vladimir Putin", r:"Russia’s president. Demands that Ukraine withdraw from the parts of Donbas it still controls.", s:[11,14]},
    {n:"Volodymyr Zelensky", r:"Ukraine’s president. Refuses to give up that territory.", s:[11,14]},
    {n:"Steve Witkoff & Jared Kushner", r:"President Trump’s envoys. They mediate between Moscow and Kyiv.", s:[7,12]},
    {n:"Rustem Umerov", r:"Leads Ukraine’s negotiating team.", s:[5,"ap_nov"]},
    {n:"Vladimir Medinsky", r:"Kremlin aide who leads Russia’s team.", s:["ap_nov"]},
    {n:"European governments", r:"Want a seat at the table, because guarantees for Ukraine also concern Europe’s security. Moscow objects.", s:[9,10,"ap_nov"]}
  ],
  tl:[
    {d:"Mar 2014", t:"Russia seizes and annexes Crimea. Fighting breaks out in eastern Ukraine and continues on and off for eight years.", why:"The start of the conflict, and of the land dispute at the heart of today’s talks.", s:["ap_crimea"], key:true},
    {d:"24 Feb 2022", t:"Russia launches a full-scale invasion of Ukraine.", why:"The war these talks are trying to end.", s:["ap_crimea"], key:true},
    {d:"Late 2022", t:"Russia illegally annexes four more Ukrainian regions that it partly occupies.", why:"Moscow treats these regions as its own, which makes any compromise on land very hard.", s:["ap_crimea"]},
    {d:"May 2025", t:"Talks in Istanbul lead to a 1,000-for-1,000 prisoner exchange.", why:"Sets the pattern: humanitarian deals, but no peace.", s:["kyivind"]},
    {d:"Dec 2025", t:"Witkoff and Kushner spend several hours with Putin in Moscow discussing a US peace plan. No breakthrough.", s:["wjla","bne"]},
    {d:"Jan 2026", t:"After meeting the US envoys, Putin agrees to the first three-way talks with Ukraine and the US, in Abu Dhabi. No deal: Russia demands the rest of Donbas.", s:["novaya",11,14], key:true},
    {d:"Feb 2026", t:"Second Abu Dhabi round: a 314-prisoner swap, and the US and Russia agree to restore military-to-military contacts.", s:[2,3,"mt_feb"]},
    {d:"28 Feb 2026", t:"The US–Israeli war with Iran begins. The Ukraine talks stall.", why:"They only restart in September.", s:[4,7,"bne"], key:true, link:"iran-talks"},
    {d:"Sep 2026", t:"Witkoff and Kushner restart talks: first at the Kremlin, then on their first visit to Kyiv.", s:["bne","wjla"]},
    {d:"21 Oct 2026", t:"Witkoff meets Putin in St Petersburg. A retired American teacher is released, and a technical-level three-way meeting is proposed.", s:["aj_oct"]},
    {d:"23 Oct 2026", t:"Russia and Ukraine swap 270 prisoners each.", s:["kyivind"]},
    {d:"10–11 Nov 2026", t:"Fourth Abu Dhabi round: a large prisoner swap is agreed in principle, with no breakthrough on land or a ceasefire.", s:[5,6,"ap_nov"], tag:"now"},
    {d:"Next", t:"The US envoys plan to meet Putin and then Zelensky.", s:["ap_nov"], tag:"next"}
  ],
  src:[
    {k:"ap_crimea", n:"AP (via PBS NewsHour)", tier:"agency", t:"What to know about Crimea, the peninsula Russia seized from Ukraine in 2014", u:"https://www.pbs.org/newshour/world/what-to-know-about-crimea-the-peninsula-russia-seized-from-ukraine-in-2014"},
    {k:"ap_nov", n:"AP (via WKBN)", tier:"agency", t:"Russia and Ukraine agree to large prisoner exchange as talks end with no major breakthrough", u:"https://www.wkbn.com/news/national-world/ap-russia-and-ukraine-hold-a-second-day-of-us-brokered-talks-in-abu-dhabi/"},
    {k:"aj_oct", n:"Al Jazeera", tier:"intl", t:"What happened during Witkoff and Kushner’s latest meeting with Putin", u:"https://aljazeera.com/news/2026/10/21/what-happened-during-witkoff-and-kushners-latest-meeting-with-putin"},
    {k:"kyivind", n:"Kyiv Independent", tier:"national", t:"‘Large-scale’ prisoner exchange agreed as 2nd day of Abu Dhabi talks concludes, Umerov says", u:"https://kyivindependent.com/large-scale-prisoner-exchange-agreed-as-2nd-day-of-abu-dhabi-talks-concludes-umerov-says/"},
    {k:"novaya", n:"Novaya Gazeta Europe", tier:"national", t:"Putin agrees to talks with Ukraine and US after meeting Witkoff in Kremlin", u:"https://novayagazeta.eu/amp/en/articles/2026/01/23/putin-agrees-to-talks-with-ukraine-and-us-after-meeting-witkoff-in-kremlin-en-news"},
    {k:"mt_feb", n:"The Moscow Times", tier:"national", t:"Russia and Ukraine exchange prisoners after second round of Abu Dhabi talks", u:"https://www.themoscowtimes.com/2026/02/05/russia-and-ukraine-exchange-prisoners-after-second-round-of-abu-dhabi-talks-a91857"},
    {k:"wjla", n:"WJLA (Washington)", tier:"national", t:"Trump envoys report ‘meaningful’ Ukraine talks after meeting Putin in renewed peace push", u:"https://wjla.com/news/nation-world/trump-envoys-report-meaningful-ukraine-talks-after-meeting-putin-in-renewed-peace-push-zelenskyy-russia-war-moscow-kyiv-steve-witkoff-jared-kusner-war-invasion-negotiations-air-defense-missiles"},
    {k:"bne", n:"bne IntelliNews", tier:"specialist", t:"US envoys head to Moscow and Kyiv to restart Ukraine talks", u:"https://www.intellinews.com/us-envoys-head-to-moscow-and-kyiv-to-restart-ukraine-talks-465916/"}
  ]
},
"cop31": {
  intro:"Every year almost every country meets at a UN climate summit, called a COP, to agree how to limit global warming. The main target was set in Paris in 2015: keep warming well below 2°C, ideally 1.5°C. Countries’ current plans still point to about 2.6°C, so each summit is a fight over how fast to move away from fossil fuels and who pays for it.",
  is:["un_paris",7],
  players:[
    {n:"Türkiye", r:"Host and COP31 president, through environment minister Murat Kurum.", s:[8,"kt"]},
    {n:"Australia", r:"Leads the negotiations, through climate minister Chris Bowen.", s:[2,7]},
    {n:"António Guterres", r:"UN Secretary-General. This is his last climate summit in the job.", s:["chn31"]},
    {n:"Developing and island countries", r:"Push for more money from richer countries to cope with climate damage.", s:[5,6]},
    {n:"United States", r:"The Trump administration sent no officials. A congressional delegation is attending.", s:["kt"]}
  ],
  tl:[
    {d:"1995", t:"The first UN climate summit (COP). One has been held every year since.", s:["live"]},
    {d:"1997", t:"Kyoto Protocol: 37 industrialised countries must cut their emissions.", s:["live"]},
    {d:"Dec 2015", t:"Paris Agreement: keep warming well below 2°C and aim for 1.5°C. Each country writes its own plan (NDC) and updates it every five years.", why:"Still the rulebook every summit works from.", s:["un_paris"], key:true},
    {d:"Dec 2023", t:"COP28 in Dubai: for the first time, countries agree to “transition away” from fossil fuels.", why:"The question now is how fast, which is what COP31 argues about.", s:["unfccc28","aj28"], key:true},
    {d:"Nov 2024", t:"COP29 in Baku agrees a new climate finance goal (the NCQG).", s:[9]},
    {d:"Jan 2025", t:"President Trump orders the US to leave the Paris Agreement, for the second time.", why:"The US is not at the table in Antalya.", s:["sabin","ap_paris","kt"], key:true},
    {d:"Nov 2025", t:"COP30 in Belém, Brazil. Countries submit updated plans, and a tropical forest fund (TFFF) launches with about $5.5 billion in pledges.", s:[9,"euro_tfff","chn_tfff"]},
    {d:"Feb 2026", t:"The war with Iran triggers an oil price shock, putting energy security next to climate on the agenda.", s:[5,3], link:"oil-drop"},
    {d:"2026", t:"Türkiye and Australia both want to host COP31. They agree to share the role.", s:[2,11]},
    {d:"9 Nov 2026", t:"COP31 opens in Antalya, with an early fight over money for developing countries.", s:[1,5], tag:"now"},
    {d:"11 Nov 2026", t:"At the leaders’ summit, Guterres proposes a “Climate Justice Compact” and says polluters must pay.", s:["chn31","mg"], tag:"after", at:"2026-11-11T10:30"},
    {d:"20 Nov 2026", t:"Scheduled end of the talks.", s:[4], tag:"next"}
  ],
  src:[
    {k:"un_paris", n:"United Nations", tier:"official", t:"The Paris Agreement", u:"https://www.un.org/en/climatechange/paris-agreement"},
    {k:"unfccc28", n:"UNFCCC (UN Climate Change)", tier:"official", t:"COP28 agreement signals “beginning of the end” of the fossil fuel era", u:"https://unfccc.int/node/636502"},
    {k:"ap_paris", n:"AP (via KSAT)", tier:"agency", t:"Trump signs executive order directing US withdrawal from the Paris climate agreement — again", u:"https://www.ksat.com/news/politics/2025/01/20/trump-says-hes-withdrawing-the-us-from-the-paris-climate-agreement-again/"},
    {k:"kt", n:"AFP (via Kuwait Times)", tier:"agency", t:"COP31 opens with early fight over climate finance", u:"https://kuwaittimes.com/article/53287/world/cop31-opens-with-early-fight-over-climate-finance/"},
    {k:"aj28", n:"Al Jazeera", tier:"intl", t:"Historic COP28 deal agrees to ‘transition away’ from fossil fuels", u:"https://www.aljazeera.com/news/2023/12/13/new-un-climate-deal-calls-for-transitioning-away-from-fossil-fuels"},
    {k:"euro_tfff", n:"Euronews", tier:"intl", t:"COP30: Could Brazil’s ambitious new ‘Tropical Forests Forever’ fund help curb deforestation?", u:"https://euronews.com/2025/11/07/cop30-could-brazils-ambitious-new-tropical-forest-forever-fund-help-curb-deforestation"},
    {k:"mg", n:"Mail & Guardian", tier:"national", t:"Guterres calls for climate justice compact to support developing countries", u:"https://mg.co.za/the-green-guardian/2026-11-11-guterres-calls-for-climate-justice-compact-to-support-developing-countries/"},
    {k:"chn31", n:"Climate Home News", tier:"specialist", t:"COP31 Bulletin Day 3: With the people stuck outside, world leaders jet in", u:"https://www.climatechangenews.com/2026/11/11/cop31-bulletin-day-3-with-the-people-stuck-outside-world-leaders-jet-in/"},
    {k:"chn_tfff", n:"Climate Home News", tier:"specialist", t:"Norway pledges $3bn in boost for Brazil-led tropical forest fund", u:"https://climatechangenews.com/2025/11/06/norway-pledges-3bn-in-boost-for-brazil-led-tropical-forest-fund/"},
    {k:"sabin", n:"Sabin Center, Columbia Law School", tier:"specialist", t:"Trump administration orders withdrawal from Paris Agreement", u:"https://climate.law.columbia.edu/content/trump-administration-orders-withdrawal-paris-agreement"},
    {k:"live", n:"Live Science", tier:"specialist", t:"What is the Paris Agreement?", u:"https://livescience.com/paris-agreement"}
  ]
},
"iran-talks": {
  intro:"Iran’s nuclear programme is at the heart of its conflict with the US and Israel. A 2015 deal limited the programme, but the US left it in 2018. In 2025 Israel and the US bombed Iran’s nuclear sites, and in February 2026 they launched a full war. Iran answered by restricting the Strait of Hormuz, which normally carries about a fifth of the world’s oil. Mediators are now trying to restart talks.",
  is:["abc_jcpoa","aca",2,"reu_tank","euronews_oil"],
  players:[
    {n:"Donald Trump & JD Vance", r:"Trump decides on war or peace. Vance led the April talks in Islamabad and wrote to Iran in October.", s:[8,4]},
    {n:"Abbas Araghchi", r:"Iran’s foreign minister and its main diplomat in the talks.", s:[4,9]},
    {n:"Mohsen Rezaei", r:"Head of Iran’s Supreme National Security Council. Says no enriched uranium will leave Iran.", s:["ahram_rez","mayadeen"]},
    {n:"Revolutionary Guards (IRGC)", r:"Iran’s elite military force. Its navy attacks or stops ships in Hormuz.", s:["mee_irgc"]},
    {n:"Qatar & Pakistan", r:"Mediators who pass messages between the two sides.", s:[5,7]},
    {n:"Benjamin Netanyahu", r:"Israel’s caretaker prime minister. Wants the US to resume strikes.", s:["ani_isr"]}
  ],
  tl:[
    {d:"Jul 2015", t:"Nuclear deal (JCPOA): Iran accepts limits on its nuclear programme in exchange for sanctions relief.", s:["abc_jcpoa","nat_jcpoa"], key:true},
    {d:"May 2018", t:"President Trump pulls the US out of the deal and reimposes sanctions.", s:["abc_jcpoa","nat_jcpoa"], key:true},
    {d:"Jun 2025", t:"Twelve-day war: Israel strikes Iran, then US bombers hit the Fordow, Natanz and Isfahan nuclear sites.", s:["aca","ap_jun25"], key:true},
    {d:"28 Feb 2026", t:"The US and Israel launch a war against Iran. Iran restricts shipping through the Strait of Hormuz.", why:"Hormuz normally carries about a fifth of the world’s oil, so oil prices surge.", s:[2,6,"reu_tank","euronews_oil","cnbc_oil"], key:true, link:"oil-drop"},
    {d:"Spring 2026", t:"The US imposes a naval blockade on Iranian ports.", s:["reu_tank","euronews_oil"]},
    {d:"Apr 2026", t:"Talks in Islamabad led by JD Vance produce an initial agreement.", s:[8]},
    {d:"Summer 2026", t:"The deal unravels after new attacks on shipping. Qatar steps up mediation, and US forces escort tankers through Hormuz.", s:[8,5,"euronews_oil"]},
    {d:"Oct 2026", t:"37 ships attacked in and around Hormuz, the most in any month since the war began.", s:["reu_oct","usni"]},
    {d:"31 Oct 2026", t:"Iran calls a letter from Vance “a positive step”; its envoys meet mediators in Doha.", s:[1,4]},
    {d:"6 Nov 2026", t:"Trump says the US is talking to Tehran.", s:[8], tag:"now"},
    {d:"10 Nov 2026", t:"The Revolutionary Guards say two more tankers caught fire after hitting mines. The US has said all mines were cleared.", s:["mee_irgc","reu_oct","reu_tank"], tag:"after", at:"2026-11-10T12:08"},
    {d:"11 Nov 2026", t:"Rezaei says Iran is not negotiating, and that Hormuz stays shut until the US meets seven conditions.", s:["mayadeen","ani"], tag:"after", at:"2026-11-11T12:20"}
  ],
  src:[
    {k:"reu_tank", n:"Reuters (via The Manila Times)", tier:"agency", t:"Iran says two tankers caught fire in Hormuz after hitting mines", u:"https://www.manilatimes.net/2026/11/08/world/iran-says-two-tankers-caught-fire-in-hormuz-after-hitting-mines/2464665"},
    {k:"reu_oct", n:"Reuters (via BOE Report)", tier:"agency", t:"Oil rises from two-month low as Hormuz shipping attacks offset Iran truce hopes", u:"https://boereport.com/2026/11/10/oil-rises-from-two-month-low-as-hormuz-shipping-attacks-offset-iran-truce-hopes"},
    {k:"ap_jun25", n:"AP (via PBS NewsHour)", tier:"agency", t:"What to know about the U.S. military’s intervention in the Israel-Iran war", u:"https://www.pbs.org/newshour/world/what-to-know-about-the-u-s-militarys-intervention-in-the-israel-iran-war"},
    {k:"ahram_rez", n:"AFP (via Ahram Online)", tier:"agency", t:"Iran security chief rejects moving enriched uranium out of country", u:"https://english.ahram.org.eg/News/580453.aspx"},
    {k:"abc_jcpoa", n:"ABC News", tier:"intl", t:"What was in the Iran nuclear deal and why did Trump withdraw the US from it?", u:"https://abcnews.com/Politics/iran-nuclear-deal-trump-united-states/story?id=123020009"},
    {k:"cnbc_oil", n:"CNBC", tier:"intl", t:"A timeline of how the Iran war shook oil prices — and what comes next", u:"https://www.cnbc.com/2026/04/21/oil-price-iran-war-middle-east.html"},
    {k:"euronews_oil", n:"Euronews", tier:"intl", t:"Oil prices rise as investors monitor shipping disruption in the Strait of Hormuz", u:"https://www.euronews.com/2026/11/11/oil-markets-rise-as-investors-monitor-shipping-disruption-in-the-strait-of-hormuz"},
    {k:"mee_irgc", n:"Middle East Eye", tier:"intl", t:"Iran’s IRGC says two oil tankers catch fire in Strait of Hormuz", u:"https://www.middleeasteye.net/live-blog/live-blog-update/irans-irgc-says-two-oil-tankers-catch-fire-strait-hormuz"},
    {k:"nat_jcpoa", n:"The National (UAE)", tier:"national", t:"What is the JCPOA? The Iran nuclear deal explained", u:"https://www.thenationalnews.com/world/mena/what-is-the-jcpoa-the-iran-nuclear-deal-explained-1.858832"},
    {k:"ani", n:"ANI (via The Tribune)", tier:"national", t:"Iran security chief warns Tehran will target distant US bases, including in Europe", u:"https://www.tribuneindia.com/news/european-targets/iran-security-chief-warns-tehran-will-target-distant-us-bases-including-in-europe"},
    {k:"ani_isr", n:"ANI", tier:"national", t:"IDF ordered to intensify preparations for possible Iranian attack under Netanyahu cabinet directives", u:"https://aninews.in/news/world/middle-east/idf-ordered-to-intensify-preparations-for-possible-iranian-attack-under-netanyahu-cabinet-directives-israeli-media20261112091554/"},
    {k:"aca", n:"Arms Control Association", tier:"specialist", t:"Israel and U.S. strike Iran’s nuclear program", u:"https://armscontrol.org/act/2025-07/news/israel-and-us-strike-irans-nuclear-program"},
    {k:"usni", n:"USNI News", tier:"specialist", t:"October marks highest number of Strait of Hormuz attacks", u:"https://news.usni.org/?p=126111"},
    {k:"mayadeen", n:"Al Mayadeen (Lebanon, pro-Iran)", tier:"other", t:"Rezaei to Al Mayadeen: Iran will strike distant US bases if attacked", u:"https://english.almayadeen.net/news/politics/rezaei-to-al-mayadeen-iran-will-strike-distant-us-bases-if-a"}
  ]
},
"oil-drop": {
  intro:"Oil drives the cost of fuel, transport, food and heating, so its price touches almost everyone. About a fifth of the world’s oil normally passes through the Strait of Hormuz, between Iran and Oman. When the Iran war choked that route in 2026, prices had their biggest monthly jump on record. Since then, signs of peace push prices down and new attacks push them back up.",
  is:["reu_tank","wb","cnbc_mar"],
  players:[
    {n:"Iran", r:"Decides which ships may pass Hormuz and targets those that sail without its permission.", s:["euronews_oil"]},
    {n:"US Navy (Central Command)", r:"Escorts tankers through the strait.", s:["euronews_oil"]},
    {n:"Gulf exporters", r:"Their crude must pass Hormuz. Exports have recovered close to pre-war levels.", s:[1]},
    {n:"Traders", r:"Now price oil on diplomacy headlines as much as on supply.", s:[3]}
  ],
  tl:[
    {d:"27 Feb 2026", t:"The day before the war, Brent trades around $72 a barrel.", s:["cnbc_oil"]},
    {d:"Mar 2026", t:"War and the Hormuz closure: Brent nears $120 at its peak and has its biggest monthly rise on record.", why:"The World Bank calls it the largest oil market shock in history.", s:["cnbc_oil","cnbc_mar","wb"], key:true, link:"iran-talks"},
    {d:"Summer 2026", t:"US forces escort tankers through Hormuz; Gulf exports recover towards pre-war levels.", s:["euronews_oil",1]},
    {d:"Oct 2026", t:"A record 37 ships are attacked around Hormuz in a single month.", s:["reu_oct"]},
    {d:"3 Nov 2026", t:"Brent closes at $103.60, its lowest since 7 October, on hopes of ending the wars in Ukraine and Iran.", s:[2], link:"abu-dhabi-talks"},
    {d:"4 Nov 2026", t:"Prices drop 8% in a day after the US midterms.", s:[5], link:"midterms"},
    {d:"6 Nov 2026", t:"Weekly loss of about 14–15%; crude falls below $100.", s:[1,3], tag:"now", key:true},
    {d:"10 Nov 2026", t:"Brent falls to a two-month low and settles at $91.49, after US officials play down the need for more military action.", s:["reu_low","energynow"], tag:"after", at:"2026-11-10T21:00"},
    {d:"11 Nov 2026", t:"Brent rebounds about 1% to around $92 as attacks on ships continue. It is still about 47% higher than a year ago.", s:["te_brent","energynow"], tag:"after", at:"2026-11-11T18:30"}
  ],
  src:[
    {k:"reu_tank", n:"Reuters (via The Manila Times)", tier:"agency", t:"Iran says two tankers caught fire in Hormuz after hitting mines", u:"https://www.manilatimes.net/2026/11/08/world/iran-says-two-tankers-caught-fire-in-hormuz-after-hitting-mines/2464665"},
    {k:"reu_oct", n:"Reuters (via BOE Report)", tier:"agency", t:"Oil rises from two-month low as Hormuz shipping attacks offset Iran truce hopes", u:"https://boereport.com/2026/11/10/oil-rises-from-two-month-low-as-hormuz-shipping-attacks-offset-iran-truce-hopes"},
    {k:"reu_low", n:"Reuters (via BOE Report)", tier:"agency", t:"Tankers continue to burn in the Middle East despite hopes for de-escalation", u:"https://boereport.com/2026/11/10/tankers-continue-to-burn-in-the-middle-east-despite-hopes-for-de-escalation"},
    {k:"wb", n:"World Bank", tier:"official", t:"Strait of Hormuz disruption sends oil prices surging", u:"https://blogs.worldbank.org/en/opendata/strait-of-hormuz-disruption-sends-oil-prices-surging"},
    {k:"cnbc_oil", n:"CNBC", tier:"intl", t:"A timeline of how the Iran war shook oil prices — and what comes next", u:"https://www.cnbc.com/2026/04/21/oil-price-iran-war-middle-east.html"},
    {k:"cnbc_mar", n:"CNBC", tier:"intl", t:"Brent oil price surges more than 60% in March, biggest monthly gain dating back to 1988", u:"https://www.cnbc.com/2026/03/31/oil-price-today-wti-brent-trump-energy-sites-water-war-escalation-deal.html"},
    {k:"euronews_oil", n:"Euronews", tier:"intl", t:"Oil prices rise as investors monitor shipping disruption in the Strait of Hormuz", u:"https://www.euronews.com/2026/11/11/oil-markets-rise-as-investors-monitor-shipping-disruption-in-the-strait-of-hormuz"},
    {k:"te_brent", n:"Trading Economics", tier:"specialist", t:"Brent crude oil price", u:"https://tradingeconomics.com/commodity/brent-crude-oil"},
    {k:"energynow", n:"EnergyNow", tier:"specialist", t:"Oil prices rebound as Iran rejects key U.S. nuclear demand and Hormuz shipping attacks renew supply concerns", u:"https://energynow.com/2026/11/oil-prices-rebound-as-iran-rejects-key-u-s-nuclear-demand-and-strait-of-hormuz-shipping-attacks-renew-supply-concerns/"}
  ]
},
"midterms": {
  intro:"Halfway through a president’s four-year term, Americans elect the whole House and about a third of the Senate. These midterms usually go against the president’s party. In 2024 Republicans won the White House and both chambers; on 3 November 2026 Democrats won both chambers back. The new Congress only starts on 3 January, so the outgoing one is still voting until then.",
  is:[2,5,"aj_heg"],
  players:[
    {n:"Donald Trump", r:"President. His party has lost control of Congress.", s:[1,2]},
    {n:"John Thune", r:"Senate Republican leader. Vows to defend his party’s record on the border and tax cuts.", s:[8]},
    {n:"JD Vance", r:"Vice president. Among the Republicans who blamed the Iran war for the losses.", s:[6]},
    {n:"Thomas Massie", r:"Republican rebel. Led the push to impeach Defense Secretary Hegseth and the Epstein files petitions.", s:["npr_heg","axios_ep"]},
    {n:"Democrats in Congress", r:"Take control of both chambers in January, which starts a new era of divided government.", s:[5]}
  ],
  tl:[
    {d:"2018", t:"In Trump’s first term, Democrats win the House in the midterms.", s:[1]},
    {d:"Nov 2024", t:"Republicans win the White House and both chambers of Congress.", s:[2], key:true},
    {d:"Nov 2025", t:"After a petition bypasses Republican leaders, a bill forcing release of the Epstein files passes the House 427–1.", s:["rollcall"]},
    {d:"Feb 2026", t:"The US and Israel go to war with Iran. After the midterms, several Republican leaders blame the war for their losses.", s:["reu_war",6], key:true, link:"iran-talks"},
    {d:"Sep 2026", t:"The Fed raises rates as inflation stays high; the cost of living dominates the campaign.", s:[3], link:"fed-hold"},
    {d:"3 Nov 2026", t:"Democrats win both chambers.", s:[2,5], tag:"now", key:true},
    {d:"10 Nov 2026", t:"In the outgoing House, a 211–204 vote sends the impeachment articles against Defense Secretary Hegseth to committee, effectively ending them.", s:["npr_heg","nbc_heg"], tag:"after", at:"2026-11-11T01:00"},
    {d:"11 Nov 2026", t:"Massie’s second Epstein files petition reaches 218 signatures, enough to force a House vote.", s:["axios_ep","rollcall"], tag:"after", at:"2026-11-11T17:00"},
    {d:"3 Jan 2027", t:"The new Congress takes office.", s:["aj_heg"], tag:"next"}
  ],
  src:[
    {k:"reu_war", n:"Reuters (via Khaleej Times)", tier:"agency", t:"US to mediate Russia-Ukraine talks in Abu Dhabi next week, Witkoff says", u:"https://www.khaleejtimes.com/us-mediate-russia-ukraine-talks-abu-dhabi-november-witkoff"},
    {k:"npr_heg", n:"NPR", tier:"intl", t:"House votes to effectively end the impeachment effort against Pete Hegseth", u:"https://www.npr.org/2026/11/10/nx-s1-6036813/house-votes-to-effectively-end-the-impeachment-effort-against-pete-hegseth"},
    {k:"nbc_heg", n:"NBC News", tier:"intl", t:"Republican-led House rejects Hegseth impeachment effort", u:"https://www.nbcnews.com/politics/congress/republican-led-house-rejects-hegseth-impeachment-effort-rcna608534"},
    {k:"axios_ep", n:"Axios", tier:"intl", t:"Outgoing Trump foe Massie forces new Epstein files showdown", u:"https://www.axios.com/2026/11/11/massie-epstein-files-second-vote"},
    {k:"aj_heg", n:"Al Jazeera", tier:"intl", t:"Did Democrats save Pete Hegseth from impeachment?", u:"https://www.aljazeera.com/news/2026/11/11/did-democrats-save-pete-hegseth-from-impeachment"},
    {k:"rollcall", n:"Roll Call", tier:"specialist", t:"Another bill to release Epstein files headed to House floor", u:"https://rollcall.com/2026/11/11/another-bill-to-release-epstein-files-headed-to-house-floor/"}
  ]
},
"ecb-lagarde": {
  intro:"The European Central Bank sets interest rates for the countries that use the euro. Its job is to keep inflation close to 2%. When prices rise too fast it raises rates, which makes loans and mortgages more expensive and cools the economy. After fighting a big inflation wave in 2022 and cutting rates in 2024–25, it had to raise them again in 2026 when the Iran war pushed energy prices up. Now its president is leaving early.",
  is:["ecb_2022",10,1],
  players:[
    {n:"Christine Lagarde", r:"ECB president since 2019. Leaves on 7 February 2027.", s:[5,1]},
    {n:"Governing Council", r:"The ECB’s decision-makers. They set rates about every six weeks.", s:["ecb_2022"]},
    {n:"EU leaders", r:"Will choose her successor.", s:[1,4]},
    {n:"Klaas Knot & Pablo Hernández de Cos", r:"Named in reports as possible successors.", s:[12]},
    {n:"Germany", r:"Wants a successor who backs strict inflation targeting and sound public finances.", s:[9]},
    {n:"France", r:"Votes for a president in April 2027. Polls favour Marine Le Pen.", s:[4,14]}
  ],
  tl:[
    {d:"Nov 2019", t:"Christine Lagarde becomes ECB president for an eight-year term.", s:[5]},
    {d:"Jul 2022", t:"With euro area inflation at a record 8.6%, the ECB raises rates for the first time in 11 years.", s:["ap_2022","ecb_2022"], key:true},
    {d:"Sep 2022", t:"The biggest rate hike in the ECB’s history.", s:["ecb_2022"]},
    {d:"2024–25", t:"With inflation falling, the ECB cuts rates. By April 2026 the deposit rate is 2.00%.", s:[10]},
    {d:"Feb 2026", t:"Reports say Lagarde may leave early.", s:[12,14]},
    {d:"Spring 2026", t:"The Iran war pushes energy prices up. Euro area inflation reaches 3.2% in August.", s:[10,11], key:true, link:"oil-drop"},
    {d:"Jun & Sep 2026", t:"Two hikes take the deposit rate to 2.50%.", s:[10]},
    {d:"29 Oct 2026", t:"Rates on hold. Lagarde confirms she will leave on 7 February 2027.", s:[1,2], tag:"now", key:true},
    {d:"7 Feb 2027", t:"Lagarde steps down.", s:[1], tag:"next"},
    {d:"Apr 2027", t:"France’s presidential election.", s:[4], tag:"next"}
  ],
  src:[
    {k:"ecb_2022", n:"European Central Bank", tier:"official", t:"We have raised interest rates. What does that mean for you?", u:"https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/interest_rates.en.html"},
    {k:"ap_2022", n:"AP (via PBS NewsHour)", tier:"agency", t:"Europe’s central bank raises interest rates for first time in 11 years", u:"https://www.pbs.org/newshour/world/europes-central-bank-raises-interest-rates-for-first-time-in-11-years"}
  ]
},
"fed-hold": {
  intro:"The Federal Reserve is America’s central bank. It sets the cost of borrowing in the world’s largest economy, which moves the dollar, mortgages and markets everywhere. After raising rates sharply in 2022–23 to fight inflation, it cut them in 2024–25. Then the Iran war pushed inflation back up, and in 2026 the Fed started raising rates again, under a new chair picked by President Trump.",
  is:[5,"inquirer","ap_warsh"],
  players:[
    {n:"Kevin Warsh", r:"Fed chair since May 2026, nominated by President Trump.", s:["ap_warsh",2]},
    {n:"Donald Trump", r:"Criticised the September hike, mostly blaming the rate committee rather than Warsh.", s:[2]},
    {n:"Jerome Powell", r:"Former chair. Stays on the Fed’s board as a governor; his term runs to 2028.", s:["scripps"]},
    {n:"Lisa Cook & Beth Hammack", r:"Voted for an immediate hike in October.", s:[2,4]},
    {n:"Congress", r:"Democrats won both chambers in the midterms and take control in January.", s:["npr_mid"]}
  ],
  tl:[
    {d:"2022–23", t:"The Fed raises rates sharply to fight inflation.", s:[5]},
    {d:"Sep 2024", t:"First rate cut since 2020: a half point, to 4.75–5.00%.", s:["abc_2024","afp_2024"], key:true},
    {d:"Dec 2025", t:"Third cut of 2025, to 3.50–3.75%.", s:[5]},
    {d:"Mar 2026", t:"The Iran war sends oil prices soaring and inflation rises again.", s:["cnbc_oil","inquirer"], key:true, link:"oil-drop"},
    {d:"May 2026", t:"Kevin Warsh, nominated by Trump, is sworn in as Fed chair. Powell stays on the board.", s:["ap_warsh","scripps"], key:true},
    {d:"Sep 2026", t:"First hike since 2023, to 3.75–4.00%. The franc falls to its lowest against the dollar since 2025.", s:[2,6,7]},
    {d:"28 Oct 2026", t:"Rates on hold in a 10–2 vote; two officials want a hike.", s:[1,4], tag:"now"},
    {d:"3 Nov 2026", t:"Democrats win both chambers of Congress, starting a new era of divided government.", s:["npr_mid"], tag:"after", at:"2026-11-04T07:00", link:"midterms"},
    {d:"10 Nov 2026", t:"US inflation comes in hotter than expected. Markets now fully expect a December hike, and the 10-year Treasury yield ends near 5%.", s:["saxo","caixa"], tag:"after", at:"2026-11-10T16:00", key:true},
    {d:"8–9 Dec 2026", t:"Next Fed decision.", s:[1], tag:"next"}
  ],
  src:[
    {k:"ap_warsh", n:"AP (via WTOP)", tier:"agency", t:"Warsh is sworn in as the Fed chair after Trump’s bid for greater control over the independent bank", u:"https://wtop.com/business-finance/2026/05/warsh-is-sworn-in-as-the-fed-chair-after-trumps-bid-for-greater-control-over-the-independent-bank/"},
    {k:"afp_2024", n:"AFP (via The Times of Israel)", tier:"agency", t:"US Fed makes larger half-point cut in first rate reduction since 2020", u:"https://www.timesofisrael.com/liveblog_entry/us-fed-makes-larger-half-point-cut-in-first-rate-reduction-since-2020/"},
    {k:"abc_2024", n:"ABC News", tier:"intl", t:"Fed cuts interest rates a half point in landmark policy shift", u:"https://www.goodmorningamerica.com/news/story/federal-reserve-expected-cut-interest-rates-time-2020-113751446"},
    {k:"cnbc_oil", n:"CNBC", tier:"intl", t:"A timeline of how the Iran war shook oil prices — and what comes next", u:"https://www.cnbc.com/2026/04/21/oil-price-iran-war-middle-east.html"},
    {k:"npr_mid", n:"NPR", tier:"intl", t:"Democrats win full control of Congress, ushering in a new era of divided government", u:"https://www.kuow.org/npr-news/2026-11-03/democrats-win-full-control-of-congress-ushering-in-a-new-era-of-divided-government"},
    {k:"inquirer", n:"The Philadelphia Inquirer", tier:"national", t:"Fed chief sworn in at the White House, facing surging inflation", u:"https://www.inquirer.com/news/nation-world/kevin-warsh-federal-reserve-chair-sworn-in-white-house-trump-economy-inflation-interest-rates-powell-20260522.html"},
    {k:"scripps", n:"Scripps News", tier:"national", t:"Kevin Warsh sworn in as Fed chair, replacing Jerome Powell", u:"https://www.scrippsnews.com/politics/economy/kevin-warsh-to-be-sworn-in-as-fed-chair-replacing-jerome-powell"},
    {k:"saxo", n:"Saxo Bank", tier:"specialist", t:"Market Quick Take – US Treasury yields rip higher – 11 November 2026", u:"https://www.home.saxo/en-mena/content/articles/macro/market-quick-take---us-treasury-yields-rip-higher---11-november-2026-11112026"},
    {k:"caixa", n:"CaixaBank Research", tier:"specialist", t:"Financial Markets Daily Report, 11 November 2026", u:"https://www.caixabankresearch.com/en/publications/financial-markets-daily-report/11-november-2026"}
  ]
}
};

/* Merge context into stories: new sources are appended after each story's own, and string references become numbers. */
(function(){
  SEED.forEach(s => {
    const c = CTX[s.id]; if(!c) return;
    const idx = {};
    c.src.forEach(x => { idx[x.k] = s.sources.length + 1; s.sources.push({n:x.n, tier:x.tier, t:x.t, u:x.u}); });
    const fix = a => (a || []).map(v => typeof v === "number" ? v : idx[v]);
    s.ctx = {
      intro:c.intro, is:fix(c.is),
      players:c.players.map(p => ({n:p.n, r:p.r, s:fix(p.s)})),
      tl:c.tl.map(e => Object.assign({}, e, {s:fix(e.s)}))
    };
  });
})();
