# BrowserGames Hub — 建站总览

> 本文档是网站的建站总览，供站长快速了解全站结构与状态。最后更新：2026-08-28。

## 一、站点概况

| 项目 | 内容 |
|---|---|
| 站点名称 | BrowserGames Hub |
| 域名 | https://browsergames.click |
| 定位 | 免费网页游戏导航站：可玩像素游戏 + 游戏指南文章 + 游戏筛选工具 |
| 目标受众 | 想"免下载、免注册"直接玩的玩家（朋友聚会、异地情侣、学生、低配设备用户等），英文受众 |
| 技术栈 | 纯静态 HTML + CSS + 原生 JS，**无构建步骤、无框架、无依赖** |
| 托管 | GitHub Pages（仓库 `folial/browsergames-hub`，分支 `main`，绑定 CNAME `browsergames.click`） |
| 分析 | GA4（测量 ID `G-579DPCHJ6G`），Google Search Console 已验证 |
| 页面总数 | 39 个 HTML：1 首页 + 11 指南文章 + 1 工具页 + 3 个信任/联系页面 + 1 隐私政策 + 21 游戏页 + 1 个 404 |

## 二、目录结构

```
browsergames-hub/
├── index.html                 # 首页：hero + Quick Play 随机游戏 + 分类导航 + 最新指南
├── game-finder.html           # 工具页：按 玩法/类型 筛选 21 个站内游戏
├── about.html                 # 关于本站、内容边界与编辑范围
├── testing-method.html        # 游戏与指南的测试说明
├── contact.html               # 内容纠错、隐私请求与合作联系
├── online-games-for-long-distance-couples.html   # 指南：异地情侣游戏
├── games-like-shell-shockers.html                 # 指南：类似的 FPS 游戏
├── how-to-play-slope.html                         # 指南：Slope 玩法教学
├── best-co-op-browser-games.html                  # 指南：合作游戏
├── games-to-play-with-friends-online.html         # 指南：和朋友联机
├── best-2-player-browser-games-no-download.html   # 指南：双人游戏
├── best-browser-games-for-school-chromebook.html  # 指南：Chromebook 游戏
├── browser-games-for-low-end-pcs.html             # 指南：低配电脑游戏
├── best-io-games-2026.html                        # 指南：io 游戏
├── best-free-browser-games-2026.html              # 指南：2026 年度十佳
├── best-browser-games-for-kids.html               # 指南：儿童安全游戏
├── privacy-policy.html        # 隐私政策
├── 404.html                   # 自定义 404 页（GitHub Pages 会使用它）
├── games/                     # 21 个可玩游戏（每个一个 HTML，游戏逻辑内联）
├── css/
│   ├── style.css              # 基础样式（布局、变量）
│   └── pixel.css              # 像素复古风覆盖层（主题视觉）
├── js/main.js                 # 全站共享交互：导航、声音、Quick Play、粒子特效等
├── favicon.svg                # 像素风红色笑脸图标
├── og-image.png               # 1200×630 社交分享图（og:image / twitter:image）
├── robots.txt                 # 允许全站抓取 + sitemap 声明
├── sitemap.xml                # 38 条可索引 URL（含指南、信任页面与游戏页）
├── CNAME                      # 自定义域名绑定文件
├── deploy-to-github.bat       # 一键提交推送脚本
└── README.md                  # 部署说明（Cloudflare / Netlify / Vercel 备选方案）
```

## 三、页面架构与内容策略

### 1. 首页（index.html）
从上到下：
- **导航栏**：Home / Couples / Game Finder / Guides（移动端汉堡菜单）
- **Hero**：一句卖点 + CTA（打开 Game Finder / 读指南）+ "Popular right now" 热门排行
- **Quick Play**：随机加载 21 个游戏之一进 iframe 直接玩（点 "Start Game" 开始，可暂停/换游戏）
- **Explore by mood**：按场景分类卡片（异地情侣 / Game Finder / 指南 / 双人游戏）
- **Latest guides**：最新文章网格（11 篇文章，带标签和阅读时长）
- **底部 CTA**：引导使用 Game Finder
- **页脚**：版权 + 隐私/关于/测试/联系入口 + 全站导航

### 2. 指南文章（11 篇）
每篇结构一致：H1 + 摘要 + 推荐游戏卡片 + 正文 + 相关页推荐。定位为"有清晰边界、可复核的实用指南"：
- 场景类：异地情侣、朋友联机、双人同屏、公司合作
- 设备/人群类：Chromebook、低配 PC、儿童
- 品类类：Slope 玩法、Shell Shockers 替代、io 游戏、年度十佳

文章中的站内自研像素游戏会链接到本站落地页；真正的远程联机推荐保留官方外链，并明确标注为外部服务。

### 3. Game Finder（game-finder.html）
前端筛选工具：按玩家数、设备、玩法、时长与类型 chip 过滤 21 个游戏卡片，一点直达游戏页；支持结果计数、空结果恢复与最近游玩。

### 4. 游戏页（games/*.html，21 个）
每个游戏一个独立页面：玩法标题 + 游戏区（canvas 或 DOM 棋盘）+ 分数/最佳记录（存 localStorage）+ 控制说明 + 面包屑导航。游戏逻辑全部为该页面内联脚本，不依赖外部库。
支持 `?embed=1` 嵌入模式（隐藏站点头尾，供首页 Quick Play 的 iframe 使用）。

### 5. 游戏清单
| 游戏 | 类型（finder 标签） |
|---|---|
| Pixel Snake | Arcade |
| Pixel Pong | 2P 同屏 |
| 2048 Pixel | Puzzle |
| Pixel Breakout | Arcade |
| Tic-Tac-Toe | 2P · Board |
| Memory Match | Puzzle · Memory |
| Simon Says | Memory |
| Flappy Pixel | Arcade |
| Connect 4 | 2P · Board |
| Checkers | 2P · Board |
| Word Guess | Word |
| Draw & Guess | Party |
| Egg Shooter | Shooter |
| Block Shooter | Shooter |
| Neon Shooter | Shooter |
| Slope Dash | Arcade · Racing |
| Drift Dash | Racing |
| Party Quiz | Party |
| Pixel Runner | Arcade |
| Whack-a-Mole | Arcade |
| Reaction Time | Arcade |

## 四、视觉设计

- **主题**：像素复古风（致敬经典游戏机界面），主色为天空蓝 `#8ed0f5`、深棕边框 `#3b2e25`、黄色 CTA `#ffd23f`、绿色 `#4aa13e`、红色 `#e05a4e`
- **字体**：Google Fonts —— "Press Start 2P"（像素显示字体）+ "Pixelify Sans"（正文）
- **细节**：硬阴影（无圆角）、像素方块图标、按钮点击粒子特效、页面装饰（像素蝴蝶 + 行走史莱姆）、可选音效（SND ON/OFF，WebAudio 合成，本地存储记忆偏好）
- **实现方式**：`pixel.css` 覆盖 `style.css` 的变量与组件样式（两文件并列加载）

## 五、SEO 配置（已全部完成）

- 每页唯一的 `title` + `meta description`
- 每页 `canonical`（首页指向 `https://browsergames.click/`）
- `og:type / og:site_name / og:title / og:description / og:url / og:image` + `twitter:card`（`summary_large_image`）+ `twitter:image`，全站统一使用 `og-image.png`
- JSON-LD 结构化数据（按页面类型）：`WebSite`、`CollectionPage`、`Article`/`BreadcrumbList`、`VideoGame`/`BreadcrumbList`、`WebPage`
- `robots.txt` + `sitemap.xml`（38 条可索引 URL，与站内页面一一对应）
- 404.html 带 `noindex`
- Google Search Console 已验证；GA4 全站埋点

## 六、部署与发布

- **正式部署**：GitHub Pages。推 `main` 分支 → Pages 自动构建。域名经 `CNAME` 文件绑定，`http`/`www` 会自动 301 到 `https://browsergames.click`（GitHub 托管行为）
- **一键发布**：运行 `deploy-to-github.bat`（git add → commit（固定提交信息）→ push）
- **本地预览**：仓库 README 记录了 `127.0.0.1:8081` 的预览服务器方式；通用做法为任意静态服务器（如 `python -m http.server`）
- **备选方案（README 中记录）**：Cloudflare Pages / Netlify Drop / Vercel（均免构建、输出目录 `.`）

## 七、已知要点与注意

1. **Search Console「备用网页（有适当的规范标记）」**：属正常状态。`/` 与 `/index.html`、带/不带斜杠等 URL 变体会被 Google 标为备用，因 canonical 正确指向标准 URL，**不影响排名，无需处理**。
2. **GitHub Pages 不支持自定义 301 重定向规则**，无法把 `/index.html` 强制跳到 `/`；当前依赖 canonical 处理重复即可。
3. 游戏最高分、音效偏好存于浏览器 `localStorage`，隐私政策已说明"数据不离开设备"。
4. 站内偶发内容含指向`外部游戏官网`的文案链接（隐私政策章节有提及），移动端、无障碍（`prefers-reduced-motion`）均有处理。
5. 网站为纯英文内容（面向英文搜索），改写任何页面注意保持英文。

## 八、近期改动记录

历史基线记录继续保留在本节末尾；本轮优化状态单独列在下一节。

## 九、2026-08-28 optimization implementation status

- Added `about.html`, `testing-method.html`, and `contact.html` so visitors and advertisers can see the site's editorial scope, testing limits, and correction path.
- Reworked privacy wording to describe the GA4 measurement and the consent-gated closurenosy.com advertising placements now present, plus the remaining ads.txt/provider requirements.
- GA4 is now loaded only after optional analytics consent; every page exposes a footer Privacy choices control.
- Advertising consent now has three choices: analytics and ads, analytics only, or continue without non-essential tools. Ad snippets are isolated in sandboxed frames.
- Gameplay telemetry now separates page views, real interaction starts, 30-second engaged sessions, and game ends.
- The homepage restores recent local games, and game pages include a direct report-a-problem path.
- Rebuilt Game Finder filters around player count, device, play style, genre, and session length. It now exposes result counts, an empty state, keyboard navigation, recent games, and share/rematch/next-game actions.
- Added accessible skip links and runtime labels/status updates for game boards, scores, filters, and the mobile navigation.
- Added a distinct, honest explanatory section to all 21 game pages. Local two-player games are labeled as same-screen/pass-and-play; external multiplayer services remain clearly separated in guides.
- Replaced the sitemap with the 38 indexable URLs now intended for launch and added `ads.txt.template` without a fake publisher ID.
- Remaining launch tasks are external: verify the real domain in Search Console, obtain the advertising provider's exact seller record for ads.txt, and confirm the provider's regional consent/policy requirements before serving personalized ads.

- **2026-08-23**：全站新增 `og-image.png` 社交分享图并接入所有页面 `og:image`/`twitter:image`；`twitter:card` 升级为 `summary_large_image`；补全 `privacy-policy.html` 的 canonical/open graph/JSON-LD；修正首页 hero 第 3 条热门的错配标题；`pixel.css` 移除 `@import` 改为页面并列引用 `style.css` + `pixel.css`（消除串行渲染阻塞）。
