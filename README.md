# BrowserGames Hub

Static content + 21 playable pixel games + SEO-ready pages. No build step required.
The site is intentionally dependency-free: deploy the folder as-is.

## Preview locally

A preview server can be started from this folder with:

```
python -m http.server 8091 --bind 127.0.0.1
```

Then open:

```
http://127.0.0.1:8091
```

## Deploy (choose one)

### Option A: Cloudflare Pages (recommended, free)
1. Open https://dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets
2. Drag this whole folder in
3. Project name: `browsergames-hub`
4. Production branch: `main` (leave build command empty, output dir `.`)
5. Deploy

### Option B: Netlify Drop (fastest)
1. Open https://app.netlify.com/drop
2. Drag this folder in
3. Done

### Option C: GitHub + Vercel
1. Create a repo and push this folder
2. Import in Vercel (framework preset: Other, build: none, output: `.`)

## Structure

```
browsergames-site/
├── index.html                                # Homepage + random quick play
├── online-games-for-long-distance-couples.html  # Couples guide
├── games-like-shell-shockers.html            # FPS alternatives
├── how-to-play-slope.html                    # Slope guide
├── best-co-op-browser-games.html             # Co-op list
├── games-to-play-with-friends-online.html    # Friends list
├── game-finder.html                          # 21 on-site games
├── about.html                                 # Editorial scope and site ownership
├── testing-method.html                        # How game and guide claims are checked
├── contact.html                               # Corrections, privacy, and partnership contact
├── privacy-policy.html                        # Analytics and future advertising disclosure
├── ads.txt.template                           # Placeholder only; publish after receiving a real seller ID
├── 404.html
├── games/                                    # All 21 playable games
├── css/style.css + css/pixel.css             # Base + pixel theme
├── js/main.js                                # Shared interactions + sound
├── favicon.svg
├── robots.txt
└── sitemap.xml
```

## SEO setup before launch

1. Replace `browsergames.click` in `robots.txt` and `sitemap.xml` with your real domain.
   Also search-replace it in all HTML files (canonical/og tags use it).
2. Add Google Search Console and submit `sitemap.xml`.
3. Keep GA4 and Search Console connected, then wait for real search and gameplay data.
4. Apply for an advertising provider only after the site has useful, original content and a working correction/contact path.
5. Before personalized advertising, publish a real /ads.txt record from the provider and add a certified consent-management platform for applicable regions.

## SEO already applied

- Unique title + meta description on every page
- Canonical URL on every page
- Open Graph + Twitter card tags on every page
- JSON-LD: WebSite, CollectionPage, Article + BreadcrumbList, VideoGame + BreadcrumbList
- `robots.txt` + `sitemap.xml` with all pages
- 404 page with `noindex`
- Game Finder filters by players, device, play style, genre, and session length
- Game pages expose keyboard/touch guidance, accessible status updates, related games, rematch, next-game, and share actions
- Guides distinguish original same-screen games from external remote multiplayer services
- About, testing-method, contact, and privacy pages provide a basic trust and correction path

## Measurement and advertising guardrails

- The current site includes GA4 measurement ID G-579DPCHJ6G; gameplay and finder events are sent only when the page is used.
- GA4 and advertising consent signals default to denied. The first-visit notice lets a visitor allow optional analytics or continue without it.
- GA4 is loaded only after optional analytics consent, and the footer includes a Privacy choices control.
- Game telemetry separates `game_view`, interaction-based `game_start`, 30-second `game_engaged`, and `game_end`.
- The homepage restores recent on-site games locally; game pages include a report-a-problem link.
- No AdSense publisher script is active in the repository yet. Do not add a fake publisher ID.
- ads.txt.template is deliberately not /ads.txt. Copy it to /ads.txt only after an advertising provider supplies the exact seller record.
- Ads should be added in reserved content gaps (guide articles, finder list, or after a game session), never over a game board, start control, or navigation.
- Update privacy-policy.html and add the provider's consent controls before enabling personalized ads.

## Local QA

The project has no build step. Before publishing, run:

```
node --check js/main.js
git diff --check
```

Also open the home page, Game Finder, one solo game, one two-player game, and one guide at desktop and narrow mobile widths. Confirm that the game starts, the filter count updates, the share/rematch controls do not cover the board, and the footer privacy/contact links work.

