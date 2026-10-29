# ferdouse.com — static clone

The root of this repository is a hand-built, dependency-free static copy of
[ferdouse.com](https://www.ferdouse.com/) — the homepage plus every internal
route the site links to. Plain HTML, plain CSS, plain JavaScript: no framework,
no bundler, no build step, `npm install` nothing. Every page sits directly in
the repository root; there is no enclosing project directory.

| | |
| --- | --- |
| Pages | 36 (1 homepage + 35 interior) |
| Stylesheets | 4 241 lines — `css/styles.css` (2 763) + `css/pages.css` (1 478) |
| Scripts | 871 lines — `js/main.js` (792) + `js/pages.js` (79) |
| Local assets | 55 files / 25 MB (4 MP3 = 17 MB, 42 images, 9 `woff2`) |
| Local links in page bodies | 2 317 |
| External links left | 82 → `www.amazon.com` (39), `www.youtube.com` (15), `paintology.com` (9), `allpoetry.com` (7), `play.google.com` (5), `www.youtube-nocookie.com` (5), `salsapal.com` (2) |

## Run it

```bash
python3 -m http.server 4173 --bind 127.0.0.1   # http://127.0.0.1:4173/
```

Any static server works. Opening `index.html` straight from the filesystem also
renders, but the audio players need a server that answers HTTP Range requests —
`python3 -m http.server` replies `200` instead of `206`, so Chrome reports the
MP3s as failed to load. That is a dev-server artifact, not a defect in the
clone; the files are present and play under nginx, Caddy, Vercel, GitHub Pages,
etc.

## Layout

```
.                       repository root — the site itself
├── index.html          homepage, hand-written
├── <slug>.html         35 interior pages, all at the root
├── favicon.png
├── css/styles.css      design tokens, header, hero, sections, footer, forms, news
├── css/pages.css       interior page shell, breadcrumbs, grids, data-prefix blog rules
├── js/main.js          sticky header, mobile menu, Books dropdown, carousel,
│                       audio players, YouTube playlist switch, newsletter forms
├── js/pages.js         interior free-info + contact form validation
├── assets/{fonts,images,audio}/
└── README.md
```

## How the clean HTML was generated

The source is WordPress + Elementor + Blocksy with WPForms/reCAPTCHA. The clone
was built from measurement, not from a page-save: Elementor markup carries
hundreds of generated inline CSS variables, wrapper divs and plugin scripts that
cannot be maintained as a static artifact, so the DOM was treated as a spec and
re-implemented.

**1. Route discovery.** The homepage was walked and every internal link collected
— nav, the 12-item Books dropdown, footer columns, in-page CTAs, the sitemap —
then filtered to exclude Google Play, Amazon, YouTube and AllPoetry, which stay
live external links (the Paintology and SalsaPal product sites, which are not
part of ferdouse.com, stay external too). 36 routes. The blog half of that set
was re-derived on 2026-10-29 from the live `/blog/` archive, because the earlier
capture pointed at drafts the site had already retired.

**2. Raw capture.** Each route was fetched and the server HTML stored in a
scratch directory so structure could be re-read without re-hitting the site. The
blog pages needed their own pass: the archive, the five category archives and the
six posts were re-fetched from the live site, their Blocksy theme CSS bundles
(`page-blog.css`, `page-default.css`, the site adjustments and the inline
per-page blocks) captured, and the post bodies extracted into a data module that
preserves paragraph, heading, list, blockquote, image and logo-brand blocks. The
three lorem-ipsum URLs still linked from the live archive answer HTTP 410 with a
"page not found" body, so they are not cloned. Blog sections present in the
Elementor DOM but hidden at every breakpoint were identified here and are not
rendered in the clone.

**3. Geometry measurement.** Headless Chrome loaded the live pages and the clone
side by side at 1440 px, 768 px and 384 px and captured bounding boxes, computed
type ramps, colours and spacing for every section, plus document height as the
global check. Regions the DOM does not expose — background bands, gradient stops,
card edges — were recovered by pixel-scanning full-page screenshots. Breakpoints
were taken from the source's own media queries (1300 / 1100 / 1023 / 999.98 /
767 / 689.98) so the clone switches layout at the same widths.

**4. Asset localization.** Fonts (Orbitron, Teko 600, Roboto 400/700 `woff2`),
logo, 12 book covers, the Blue cover, 4 poem covers, 4 poem MP3s, the Paintology
artwork, portrait, newsletter photo, footer background, reCAPTCHA mark, the blog
author avatar and the Paintology and SalsaPal brand logos used inside posts were
downloaded and renamed semantically under `assets/`. Nothing loads from the
source host.

**5. Markup.** `index.html` was written by hand in measured section order
(header → hero → Blue → books carousel → poetry → divider → music → divider →
artwork → about → newsletter → news strip → footer). The 35 interior pages share
four Elementor-derived templates (primary, book detail, utility, plus the shared
newsletter/footer furniture) and were emitted by a data-driven generator: a
content data module keyed by slug, plus partials for the header, footer,
breadcrumbs, news strip and author card. The twelve blog pages are the exception:
they come from Blocksy's native archive and single templates rather than
Elementor, so they are generated from the captured post data onto the interior
shell and styled through the theme's own `<body data-prefix>` typography — 100/150
800 for the `/blog/` archive title, 50/75 800 for the single-post template, 30/45
700 for category archives and the four 2026 posts, each with the source's
999.98 px and 689.98 px steps. That generator and the measurement scripts lived in
an ephemeral scratch directory and are **not** part of this repository — the
committed output is plain static HTML, which is the deliverable.

**6. Behaviour re-implemented, not vendored.** Swiper, Elementor's sticky-header
effect and the Blocksy audio widget were rebuilt in `js/main.js` at their
observed settings: carousel autoplays every 5 s with a 500 ms transition, loops,
and adapts 3 / 2 / 1 slides per view; the header turns solid `#1a1a1a` after
200 px (300 px on tablet/mobile); the music playlist swaps the YouTube embed
video on selection; each poem gets a working player with play/pause,
restart/next, mute, repeat and a seekable progress bar.

**7. Link rewiring.** Every `href` outside `<head>` resolves to a local `.html`
file — 2 317 of them across the 36 pages, covering the header nav, mobile menu,
Books dropdown, footer, breadcrumbs, post category links and in-page
cross-links. Only `<link rel="canonical">` and hreflang tags still name the live
URLs, which is correct for pages that document a copy of a real site.

**8. Verification loop.** Each repair round re-ran the headless measurement on
the clone and diffed against the source numbers. Final gates: all 36 pages
loaded with zero broken internal links, zero 4xx/5xx responses, zero requests to
the source host for CSS, JS or images, and zero console errors; no horizontal
overflow at 384 px, 768 px or 1440 px on any page; interactions exercised in the
headless run (sticky state, mobile menu, dropdown, carousel stepping, audio play
+ track switch, playlist selection and mobile collapse, both invalid and valid
newsletter form paths).

## Comparative analysis — live site vs clone

### Homepage, section boxes (top / height, px)

| Element | Source 1440 | Clone 1440 | Source 390 | Clone 390 |
| --- | --- | --- | --- | --- |
| Document height | 7288 | 7285 | 11167 | 11166 |
| Blue section | 922 / 902.5 | 922 / 902.5 | 710.4 / 1530.1 | 710.4 / 1529.6 |
| Poetry card | 3079 / 453.6 | 3078.6 / 453.6 | 3837 / 466 | 3837 / 466 |
| Music card | 4044.3 / 516 | 4044 / 516 | 5947.1 / 498 | 5945.6 / 498 |
| Artwork section | 4651.3 / 910.4 | 4651 / 909.4 | 6476.1 / 1586.9 | 6474.6 / 1589 |
| Newsletter | not captured | 6222.1 / 538.8 | 9042.1 / 874.3 | 9040.9 / 874.3 |
| Footer | 6764 / 524 | 6760.9 / 524 | 9916.4 / 1250.5 | 9915.3 / 1250.7 |
| Carousel bullets | 10 | 10 | 12 | 12 |

Desktop matches within 3 px of total document height and within sub-pixel to 1 px
per section; mobile within 1–2 px of 11 167 px. The homepage document is now
7975 px because the `News` card strip (610 px, three cards) below the newsletter
was added to match the source DOM.

### Interior pages, document height at 1440

| Page | Source | Clone | Δ | Page | Source | Clone | Δ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `books` | 5991 | 5991 | +0.0% | `poetry` | 2193 | 2141 | −2.4% |
| `movie` | 2036 | 2034 | −0.1% | `music` | 2429 | 2358 | −2.9% |
| `about-us` | 3728 | 3734 | +0.2% | `free-book` | 2514 | 2438 | −3.0% |
| `about` | 1573 | 1577 | +0.3% | `art` | 2397 | 2215 | −7.6% |
| `contact` | 2154 | 2138 | −0.7% | `blue-the-ancient-rock` | 2441 | 2385 | −2.3% |

Five of ten sampled Elementor pages land within ±0.7%. `books` — the most
complex interior page, with the 12-slide carousel, news strip and the tall
`565 × 901` author portrait variant — is exact. The remaining 2–8 % shortfalls
are Elementor container padding inside one card each (`art`'s info-card band is
~107 px shorter; the source Submit button sits at y 1337 vs 1230 locally), not
missing sections; every section, card, control and link is present on both.

### Blog set, document height — re-cloned from the live archive on 2026-10-29

| Page | Source 1440 | Clone 1440 | Source 384 | Clone 384 |
| --- | --- | --- | --- | --- |
| `blog` | 2166 | 2166 | 4150 | 4151 |
| `category-art` | 1274 | 1274 | 2529 | 2529 |
| `category-writing` | 1526 | 1527 | 2834 | 2835 |
| `category-video` | 1047 | 1047 | 1934 | 1935 |
| `category-vfx` | 1020 | 1033 \* | 1600 | 1601 \* |
| `category-commercial` | 1020 | 1033 \* | 1600 | 1601 \* |
| `the-throne` | 3678 | 3679 | 5751 | 5752 |
| `for-the-love-of-art` | 4581 | 4582 | 8614 | 8615 |
| `turning-a-book-into-an-ai-movie` | 2505 | 2506 | 4513 | 4514 |
| `from-poetry-to-sci-fi-blue-the-ancient-rock` | 2653 | 2654 | 4936 | 4937 |
| `does-paintology-teach-the-fundamentals-of-art` | 2684 | 2684 | 4992 | 4993 |
| `how-i-get-into-writing` | 1779 | 1779 | 2708 | 2709 |

\* The two empty archives hold almost no content, so their height comes from
Blocksy stretching `#main` to the viewport above the footer: total =
`max(content 399, 100vh − 404) + 524`. The clone does exactly what the source
does; the figure tracks the browser window height rather than the page.

All twelve are within 1 px at both viewports, and the agreement is block-level,
not just page height: the `/blog/` archive title box (x75 w1290 h150 at 1440,
100/150 800), the post list (y334 h1203) and its six card heights
(176 / 150 / 229 / 176 / 176 / 176); on `/the-throne/` the hero (138), the
two-line title inside the centred 750 px column (30/45 700, 90 tall), the article
(2759 source vs the clone's 2736 body plus the same 40 px header gap) and the
category footer (26). The tablet step was checked too — the archive title
resolves to 50/75 at 768 px (page 1468 vs 1467) and 25/37.5 at 384 px.

Matching those twelve took three repairs that the first pass had missed: the
mobile container is the theme's edge spacing, not the fixed offset the Elementor
pages use; the source footer Site Menu has no Movie item, so the clone's extra
entry added 26.4 px to every interior page; and Blocksy flexes `.site-main` to
fill the viewport above its footer, which is only visible on the two empty
category archives (`category-vfx`, `category-commercial`).

### Blog set, styles and spacing — parity pass, 2026-10-29

Geometry already matched; colour, type and page furniture did not. Reading the
source's own `page-blog.css`, `page-default.css` and `site-adjustments.css`
bundles turned up ten differences, all now reproduced in `css/pages.css` under
the `body[data-prefix]` and `.entry-header` hooks, so the twenty-four Elementor
pages keep the styling they were verified against:

| Aspect | Live | Clone before | Clone now |
| --- | --- | --- | --- |
| Page container | `min(100%, 90vw)` capped at 1290, `88vw` under 690 | `100% − 150/80/40 px`, `88%` | live formula |
| Header row | `#1f1f1f`, no border, no shadow | `#1a1a1a` plus a hairline shadow | `var(--card)`, `box-shadow: none` |
| Menu spacing | `clamp(24px, (100vw − 1000px)/8, 34px)` | fixed 17 px padding | same clamp, halved into the padding |
| Books item | caret icon, no active state on blog pages | no caret, yellow underline | caret, no active state |
| Copy colour in `#main` | `#898989` | `#ffffff` | `var(--muted)` |
| Breadcrumb | `line-height 19.8`, inline-flex crumbs, 8×8 chevron with `margin: 0 8px`, colour per prefix (white on `blog` / `single_blog_post`, muted on archives) | flex row with 16 px gaps around a `›` glyph, last crumb forced muted | live layout, glyph and colours |
| Breadcrumb on a post | pulled out of the 750 px column to the container edge (x 75) | left inside the column (x 345) | `margin-left: calc(50% − min(1290px, 90vw)/2)` |
| Content links | yellow, underlined until hovered | yellow, never underlined | underlined at rest, none on hover |
| Post list | `margin-block-end: 1.5em` | 0 | 24 px |
| `h3` bottom margin | `calc(.3em + 10px)` = 19 px | 20.5 px | 19 px |

Paragraph (16/26.4 `#898989`), card title (35/52.5 700 yellow), blockquote
(4 px `#FFCC00` bar, 24 px padding, no margin of its own), list indent (40 px
disc), the 750 px post column, the 40 px hero gap, the 28 px title offset and
the 136/86 px header clearance were already right and are unchanged. The
dropdown caret was added to the shared header, so it now shows on every page.

### Structural comparison

| Aspect | Live site | Clone |
| --- | --- | --- |
| Stack | WordPress + Elementor + Blocksy + WPForms | static files |
| Stylesheet/script requests per page | many — theme CSS, plugin CSS, per-post Elementor CSS, jQuery, Elementor frontend, Swiper, WPForms, Google Fonts, media | 2 on the homepage (`styles.css` + `main.js`), 4 on interior (`+ pages.css` + `pages.js`) |
| Third-party JS | jQuery, Elementor, Swiper, reCAPTCHA, WPForms, YouTube iframe | none |
| Fonts | `woff2` served from the source host | the same `woff2`, copied locally |
| CSS | Elementor-generated per-post stylesheets and inline custom properties | two hand-written layers, design tokens in `:root` |
| Forms | POST to WPForms, reCAPTCHA-verified | validate locally, show a confirmation, never post |
| Navigation | permalinks on the source host | local `.html` files |

### Deliberate differences

- Backend behaviour is out of scope: newsletter, free-book and contact
  submission are visual only, and the reCAPTCHA badge is a static image.
- Amazon, Google Play, YouTube and AllPoetry links stay external by request, so
  book purchase buttons, hero/artwork video embeds and AllPoetry poem pages
  still resolve to the real services; the same holds for the Paintology and
  SalsaPal sites, which live outside ferdouse.com.
- Canonical and hreflang tags keep the live URLs; body links do not.
- Elementor-hidden blog blocks in the source DOM are not rendered.
- The live `/blog/` archive still links three lorem-ipsum drafts that answer
  HTTP 410 with Blocksy's "page not found" body. They are not cloned; the clone
  carries the six posts that render real content, and its homepage `News` strip —
  which on the source points at two of those 410 URLs and shows four cards —
  points at the newest real posts instead so no internal link dead-ends.
- The footer Site Menu mirrors the source's seven items (Home, Books, Poetry,
  Music, Art, About, Contact); the Movie entry this clone originally carried
  there was removed. The header nav and mobile menu keep Movie, as on the source.
- The clone's interior header is `position: fixed` with compensating
  `.page-shell` padding (136 px desktop, 86 px at ≤ 1023) while the source header
  is in flow; heights agree, stacking contexts differ.

## Repository history

Three shapes of this repository have lived on `main`:

1. Four directories of earlier site captures (`ferdouse-com`,
   `ferdouse-com-html`, `test-ferdouse-com`, `test-ferdouse-com-html`) — 1 525
   files, ~440 MB of raw CMS exports.
2. The cleaned static build inside an enclosing `ferdouse-cleaned-clone-pages/`
   directory, at 34 pages.
3. This version: the enclosing directory is gone and every page, stylesheet,
   script and asset sits in the repository root, so the repo is the site and
   GitHub Pages or any static host serves `index.html` without a path prefix.
   `README.md` is the only file at the root that is not part of the site.

The page set also grew from 34 to 36 in this round. `/blog/`, the five category
archives and the six live posts were re-cloned from the current site, the four
retired lorem-ipsum drafts were deleted, `css/pages.css` gained the Blocksy
`data-prefix` blog typography and the 750 px single-post header column, and
every interior page lost the extra footer Movie item. A follow-up pass then
brought those twelve pages into style parity — container formula, header
colour, breadcrumb, copy colour, link decoration and list spacing, as tabulated
above — and gave the shared header the Books caret the source renders.

Earlier states stay recoverable from history: the CMS exports at
`git checkout a5bb423 -- ferdouse-com`, the directory-nested static build at
`git checkout 1c81d5e -- ferdouse-cleaned-clone-pages`.

## Scope

Content, layout and interactions of the public pages only. Not included: the
generator and measurement tooling, the CMS, authenticated routes, search,
comments, and any backend.
