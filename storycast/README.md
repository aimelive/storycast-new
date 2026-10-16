# StoryCast

A 3-page accessible microsite that brings together short video stories from young Rwandans and makes them easy for everyone to follow, with full transcripts and captions. Built with semantic HTML5, Sass and a little vanilla JavaScript. No frameworks.

- **Sitemap:** [`docs/sitemap.png`](docs/sitemap.png)
- **Wireframes (Figma):** https://www.figma.com/design/587MESOtmNrJcDWyv2U0uX/StoryCast?node-id=5-5474
- **High-fidelity mockups (Figma):** https://www.figma.com/design/587MESOtmNrJcDWyv2U0uX/StoryCast?node-id=0-1
- **Research document:** [`docs/research.pdf`](docs/research.pdf)
- **Documentation:** [`docs/documentation.pdf`](docs/documentation.pdf)

---

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Introduces StoryCast, plays our captioned intro video, shows the featured story and the story grid, and highlights the accessibility features |
| Story | `story/bahati-satir.html` | *Demanding Change With Facts*: Bahati Satir, social entrepreneur (featured) |
| Story | `story/yvan-munyengango.html` | *Becoming the Boss*: Yvan Munyengango, CEO of Cali Fitness Rwanda |
| Story | `story/vanessa-mutesi.html` | *An Open School for Every Child*: Vanessa Mutesi, Miss Geek Rwanda 2015 winner |
| About & Access | `about.html` | Mission, audio intro with transcript, accessibility features (`#accessibility`), how to take part, contact |

Every story page has an embedded video, a summary, a full timestamped transcript (show/hide, click a time to jump, download as .txt), and related stories.

## Project structure

```
storycast/
├── index.html
├── about.html
├── story/                      One HTML file per story
├── sass/
│   ├── main.scss               Entry point: loads every partial in layer order
│   ├── abstracts/              Tokens + mixins (output no CSS on their own)
│   │   ├── _colors.scss
│   │   ├── _typography.scss
│   │   ├── _spacing.scss
│   │   └── _mixins.scss
│   ├── base/
│   │   ├── _layers.scss        @layer reset, base, layout, components, utilities;
│   │   ├── _reset.scss         @layer reset
│   │   └── _base.scss          @layer base
│   ├── layout/
│   │   └── _layout.scss        @layer layout: container, header, footer, grids
│   ├── components/             @layer components (BEM blocks)
│   │   ├── _nav.scss           .logo, .nav
│   │   ├── _button.scss        .button, .badge, .eyebrow
│   │   ├── _hero.scss          .hero, .page-intro
│   │   ├── _media-card.scss    .media-card + container queries
│   │   ├── _story.scss         .breadcrumb, .story-meta, .player, .transcript, .related
│   │   └── _feature.scss       .feature, .mission, .contact
│   └── utilities/
│       └── _a11y.scss          @layer utilities: .skip-link, .visually-hidden
├── css/
│   └── main.css                Compiled output (do not edit by hand)
├── js/
│   └── main.js                 Menu toggle, transcript toggle, click-to-seek timestamps
├── assets/
│   ├── video/storycast-intro.mp4      Our own 30-second intro
│   ├── audio/storycast-intro.mp3      Audio-only version of the intro
│   ├── images/storycast-intro-poster.jpg
│   └── transcripts/            .vtt captions + .txt transcripts for every story
└── docs/                       Research + documentation PDFs
```

### Media approach

- **Our own media:** the intro video and its audio version were made for this project, so they are hosted in `assets/`. They use native `<video>` and `<audio>` elements, and the video has a WebVTT `<track>`.
- **Story videos:** these belong to their creators, so they are **embedded** from YouTube rather than downloaded and re-hosted. Embedding is the reuse method YouTube allows. Each embed loads with `cc_load_policy=1`, so captions are on, and each page credits the creator and links to the original. StoryCast adds a full, cleaned-up transcript to every story.

### How the Sass is organised

- **Tokens:** every colour, font size and spacing value lives in `abstracts/`. Components only use semantic tokens such as `$color-primary`, never raw hex values.
- **BEM naming:** each component is a block (`.media-card`), with elements (`.media-card__title`) and modifiers (`.media-card__thumb--sky`, `.story-grid__item--featured`, `.button--outline`).
- **Cascade layers:** `_layers.scss` declares `reset → base → layout → components → utilities`, and every partial wraps its rules in one of those layers. A later layer always wins, so we never need `!important` or extra-specific selectors to override styles. The one exception is the reduced-motion reset.
- **Modules:** the partials use `@use`, not the deprecated `@import`.

### Responsive layout

- **Grid** for page structure: the story grid (`auto-fit` + `minmax`, with the featured story spanning the full row), feature grids, the hero split, the story page's content + sidebar, the About audio + transcript split, and the footer columns.
- **Flexbox** for rows inside components: header, nav, buttons, card meta, transcript header, story metadata.
- **Container queries:** every story card sits inside a `card` container, and `.media-card` changes layout based on the space it has, not the screen size:
  - **Default:** stacked, with the thumbnail on top (the regular story grid and mobile).
  - **Container ≥ 36rem:** horizontal (the full-width featured story, and every card on tablet).
  - **Container ≤ 21rem:** compact, with a narrow thumbnail and no meta (the story-page sidebar).
- Type sizes are fluid with `clamp()`. Media queries are mobile-first at 48rem and 64rem.

---

## Accessibility checklist (WCAG 2.1 AA)

| Requirement | How it is met |
|---|---|
| Semantic structure | `header`, `nav`, `main`, `article`, `section`, `aside`, `figure`/`figcaption`, `footer`, `blockquote`, `dl` for story metadata, `ol` for breadcrumb and transcript, `time` for lengths, `address` for contact. |
| Heading order | One `h1` per page, then `h2` for sections and `h3` for cards. No levels are skipped (checked on every page). |
| Captions | The intro video uses `<track kind="captions" srclang="en" default>` with `assets/transcripts/storycast-intro.vtt`. Story embeds open with captions on. |
| Transcripts | Every story and the audio intro have a full transcript on the page, plus a `.txt` download. Estimated timestamps are labelled "Timestamps are approximate". |
| Media description | Every player is inside a `<figure>` with a `<figcaption>` (linked to the player with `aria-describedby`). Native players have fallback text with a download link. Each iframe has a descriptive `title`. |
| Keyboard navigation | A skip link comes first on every page. Native `<button>`s and links are used everywhere. Each card has a single link, made clickable over the whole card with `::after`. Escape closes the mobile menu. Transcript timestamps are buttons that seek the player, including YouTube embeds through the player API. The scrollable transcript panel can take focus (`tabindex="0"`). |
| Visible focus | A shared `focus-ring` mixin draws a 3px sky-blue outline with offset. Cards show the ring on the whole card via `:focus-within`. The footer uses a yellow ring so it stays visible on the dark background. |
| Colour contrast | Body text #14201A on #FAF7F0 is 15.7:1. Muted text #4A5850 is 7.0:1. Green links #1B6B45 are 6.1:1. White on green buttons is 6.5:1. Footer text is 10.9:1. Yellow is only used behind dark text (10:1). |
| ARIA (only where HTML is not enough) | `aria-expanded` + `aria-controls` on the menu and transcript toggles. `aria-current="page"` on the active nav and breadcrumb link. `aria-label` on landmark navs, transcript regions and timestamp buttons ("Play from 0:30"). `aria-hidden` on decorative SVG icons and patterns. Visually hidden text gives extra context to "Download .txt", "Watch on YouTube" and the logo link. |
| Reduced motion | `prefers-reduced-motion: reduce` turns off transitions, hover lifts and smooth scrolling. |
| Works without JS | With JS off, the menu shows as a plain list and transcripts are visible. |
| No autoplay | No media starts on its own. |
| Automated check | axe-core (WCAG 2.0/2.1 A + AA + best practice) reports 0 violations on all 5 pages. |

---

## Running locally

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/storycast.git
   cd storycast
   ```
2. Serve the folder. A server is needed because browsers block caption files and YouTube embeds on `file://`. Use either option:
   - **VS Code:** install the Live Server extension, right-click `index.html`, then choose **Open with Live Server**.
   - **Python:**
     ```bash
     python -m http.server 8000
     ```
     Then open <http://localhost:8000>.
3. To edit the styles, install Sass and recompile:
   ```bash
   npm install -g sass
   sass --watch sass/main.scss css/main.css
   ```

## Credits

- *Demanding Change With Facts*: Bahati Satir. Video by PinedaFoundation on YouTube (2012), from the African Youth with Disabilities Network gathering.
- *Becoming the Boss*: Yvan Munyengango. Video by theoisback on YouTube (2020).
- *An Open School for Every Child*: Vanessa Mutesi. Interview recorded at ITU Telecom World 2015, Budapest, on YouTube.
- Transcripts were cleaned up from YouTube auto-captions by the StoryCast team.
- The intro narration is generated with eSpeak NG.
- Fonts are Bricolage Grotesque, Source Sans 3 and IBM Plex Mono, from Google Fonts.

All story videos remain the property of their creators. StoryCast is a student project.
