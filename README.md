# vocollision.com

Pixel-faithful static clone of [vocollision.com](https://vocollision.com/), built for GitHub Pages.

The live site is a Framer project. This repo mirrors its published SSR HTML, CSS, JS modules, fonts, images, and videos with assets localized under `assets/`.

## Pages

| Path | Description |
|------|-------------|
| `/` | Home |
| `/about/` | About |
| `/contact/` | Contact |
| `/audition/` | Auditions |
| `/nyu-acapella/` | SEO landing: NYU a cappella groups |
| `/book-us/` | SEO landing: book / hire in NYC |
| `/spaceset/` | Space Set (Spotify embed redirect page) |
| `/rsvp/`, `/encore/` | Event RSVP (Partiful) |
| `/presave/` | Presave / DistroKid redirect |
| `/spotlight-guest/` | Guest list sheet embed |
| `/archived109387417059/audition/` | Archived audition page |
| `/llms.txt` | AI crawler summary |
| `/llms-full.txt` | Expanded AI / citation summary |

## SEO

On-site SEO is applied via `scripts/apply_seo.py` (re-run after editing page heads):

- Unique titles/descriptions + absolute canonicals + Open Graph
- JSON-LD (`MusicGroup` / `Organization`, `WebSite`, `WebPage`, FAQ where relevant)
- Keyword landing pages: `/nyu-acapella/`, `/book-us/`
- `robots.txt` allows major AI crawlers; `sitemap.xml` lists priority URLs
- Internal “More pages” links on core Framer pages for crawl paths

After deploy: submit `https://vocollision.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Local preview

```bash
python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

Requires serving from the repo root so absolute `/assets/...` paths resolve.

## GitHub Pages

- `.nojekyll` — serve files as-is
- `CNAME` — `vocollision.com`
- Publish the repo root (or `main` branch root) as the Pages source

## Stack

- Framer SSR HTML + embedded CSS (breakpoints: 1440 / 1200 / 1024 / mobile)
- Fonts: DM Serif Display, Inter (localized)
- Accent pink: `rgb(246, 57, 227)` / `#F639E3`
- Client hydration via localized Framer modules in `assets/site/`

## Note on `/icca`

The original `/icca` route 308-redirects to an external FreshTix event URL and is not cloned as a local page.


## Folder structure

```
/
├── index.html                 # Home
├── about/index.html
├── contact/index.html
├── audition/index.html
├── spaceset/index.html        # External Spotify page shell
├── rsvp/index.html            # Partiful embed shell
├── encore/index.html
├── presave/index.html
├── spotlight-guest/index.html
├── archived109387417059/audition/index.html
├── assets/
│   ├── images/                # Photos, icons, award badges, logos
│   ├── fonts/                 # Inter + DM Serif Display (woff2/ttf)
│   ├── videos/                # Hero + set performance videos
│   ├── site/                  # Framer JS modules (React hydration)
│   └── other/                 # Misc (OG images)
├── 404.html
├── CNAME                      # vocollision.com
├── .nojekyll
├── robots.txt
└── sitemap.xml
```

## Assets that could not be fully cloned

- **`/icca`** — live site 308-redirects to FreshTix; not a Framer page (left as external link only).
- **Framer analytics** (`events.framer.com`) — intentionally omitted.
- **Framer editor bar** preload — intentionally omitted.
- **Some Inter unicode-range font files** referenced only inside minified font-loader strings may still fall back to Google/Framer CDN if a rare glyph set is needed (latin core fonts are local).
- **Spotify / Partiful / Instagram / Google Sheets** embeds on utility pages load from those third parties (same as original).

## Remaining differences from the original

- Hero **video frame** and **rotating “CONTACT US” badge** phase will not match any single screenshot (animations).
- Pixel diffs vs live at 1440×900 were typically **&lt;2%** of pixels beyond the hero; hero ~**4%** due to video/badge timing.
- Contact form uses Framer’s **Formspark** component — submission still depends on the configured Formspark form ID / Framer integration remaining valid.
- Utility pages (`spaceset`, `rsvp`, `encore`, `presave`, `spotlight-guest`) are thin Framer shells that hand off to third-party UIs.
- Absolute asset paths (`/assets/...`) assume site root hosting (custom domain / user Pages), not a project subpath.
