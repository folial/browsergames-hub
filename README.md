# BrowserGames Hub

Static content + 21 playable pixel games + SEO-ready pages. No build step required.

## Preview locally

A preview server is already running at:

```
http://127.0.0.1:8081
```

If it stops, start it again with:

```
C:\Users\Administrator\.dsh\start-server2.cmd
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
3. Add Analytics (GA4) and AdSense after first content is indexed.

## SEO already applied

- Unique title + meta description on every page
- Canonical URL on every page
- Open Graph + Twitter card tags on every page
- JSON-LD: WebSite, CollectionPage, Article + BreadcrumbList, VideoGame + BreadcrumbList
- `robots.txt` + `sitemap.xml` with all pages
- 404 page with `noindex`

