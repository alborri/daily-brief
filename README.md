# Daily Brief

A phone-first news app. Every story is checked against at least two independent sources, summarised in one minute, and comes with context, a timeline, other viewpoints and a daily quiz. English and French.

**Open the app:** https://alborri.github.io/daily-brief/

To install it on an iPhone, open the link in Safari, tap Share, then "Add to Home Screen". It then opens full screen like any app and keeps the latest articles for offline reading.

## How it works

- `index.html` is the whole app in one file. It is built from `src/`.
- `data/news.json` is the news the app loads. An AI newsroom checks the news every 6 hours, verifies it against the sourcing rules, and republishes this file. The app picks it up when it opens and every 10 minutes while open.
- `sw.js` and `manifest.webmanifest` make the app installable and usable offline.

## Folders

| Path | What it holds |
| --- | --- |
| `src/` | The app's source: page shell and styles, the story archive, interface text, app code |
| `newsroom/stories/` | One document per story the newsroom has added or updated |
| `newsroom/site.json` | Newsroom status, items waiting for confirmation, corrections, calendar |
| `newsroom/fr.json` | French for every text shown to readers |
| `tools/` | Build scripts |
| `data/`, `icons/` | Published news file and app icons |

## Commands (Node 18 or later, no packages to install)

```
node tools/news.mjs          # check the newsroom documents and rebuild data/news.json
node tools/fr.mjs list       # list the texts that still need French
node tools/build.mjs         # rebuild index.html and sw.js after changing src/
```

A push to this repository republishes the app through GitHub Pages within a minute or two.
