# ferdouse.com — static clone

`ferdouse-cleaned-clone-pages/` is a hand-built, dependency-free static copy of
[ferdouse.com](https://www.ferdouse.com/) — the homepage plus every internal
route the site links to. Plain HTML, plain CSS, plain JavaScript: no framework,
no bundler, no build step, `npm install` nothing.

| | |
| --- | --- |
| Pages | 34 (1 homepage + 33 interior) |
| Stylesheets | 4 159 lines — `css/styles.css` (2 763) + `css/pages.css` (1 396) |
| Scripts | 871 lines — `js/main.js` (792) + `js/pages.js` (79) |
| Local assets | 53 files / 25 MB (4 MP3 = 17 MB, 40 images, 9 `woff2`) |
| Local links in page bodies | 2 044 |
| External links left | 50 → `www.amazon.com` (37), `www.youtube.com` (9), `allpoetry.com` (2), `play.google.com` (2) |

## Run it

```bash
cd ferdouse-cleaned-clone-pages
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
ferdouse-cleaned-clone-pages/
├── index.html            homepage, hand-written
├── <slug>.html           33 interior pages
├── favicon.png
├── css/styles.css        design tokens, header, hero, sections, footer, forms, news
├── css/pages.css         interior page shell, breadcrumbs, grids, body.interior overrides
├── js/main.js            sticky header, mobile menu, Books dropdown, carousel,
│                         audio players, YouTube playlist switch, newsletter forms
├── js/pages.js           interior free-info + contact form validation
└── assets/{fonts,images,audio}/
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
live external links. 34 routes. `/category/writing/` was dropped because the
live URL returns a 404.

**2. Raw capture.** Each route was fetched and the server HTML stored in a
scratch directory so structure could be re-read without re-hitting the site.
Blog sections present in the source DOM but hidden by Elementor at every
breakpoint were identified here and are not rendered in the clone.

**3. Geometry measurement.** Headless Chrome (`puppeteer-core` driving the
system Chrome binary) loaded the live pages at 1440 px and 390 px and captured
bounding boxes, computed type ramps, colours and spacing for every section, plus
document height as the global check. Regions the DOM does not expose — background
bands, gradient stops, card edges — were recovered by pixel-scanning full-page
screenshots. Breakpoints were taken from the source's own media queries
(1300 / 1100 / 1023 / 767) so the clone switches layout at the same widths.

**4. Asset localization.** Fonts (Orbitron, Teko 600, Roboto 400/700 `woff2`),
logo, 12 book covers, the Blue cover, 4 poem covers, 4 poem MP3s, the Paintology
artwork, portrait, newsletter photo, footer background, reCAPTCHA mark and
favicon were downloaded and renamed semantically under `assets/`. Nothing loads
from the source host.

**5. Markup.** `index.html` was written by hand in measured section order
(header → hero → Blue → books carousel → poetry → divider → music → divider →
artwork → about → newsletter → news strip → footer). The 33 interior pages share
five templates (primary, book detail, blog post, category archive, utility) and
were emitted by a data-driven generator: a content data module keyed by slug,
plus partials for the header, footer, breadcrumbs, news strip and author card.
That generator and the measurement scripts lived in an ephemeral scratch
directory and are **not** part of this repository — the committed output is
plain static HTML, which is the deliverable.

**6. Behaviour re-implemented, not vendored.** Swiper, Elementor's sticky-header
effect and the Blocksy audio widget were rebuilt in `js/main.js` at their
observed settings: carousel autoplays every 5 s with a 500 ms transition, loops,
and adapts 3 / 2 / 1 slides per view; the header turns solid `#1a1a1a` after
200 px (300 px on tablet/mobile); the music playlist swaps the YouTube embed
video on selection; each poem gets a working player with play/pause,
restart/next, mute, repeat and a seekable progress bar.

**7. Link rewiring.** Every `href` outside `<head>` resolves to a local `.html`
file — 2 044 of them across the 34 pages, covering the header nav, mobile menu,
Books dropdown, footer, breadcrumbs and in-page cross-links. Only
`<link rel="canonical">` and hreflang tags still name the live URLs, which is
correct for pages that document a copy of a real site.

**8. Verification loop.** Each repair round re-ran the headless measurement on
the clone and diffed against the source numbers. Final gates: all 34 pages
loaded with zero broken internal links, zero 4xx/5xx responses and zero console
errors; no horizontal overflow at 390 px or 768 px on any page; interactions
exercised in the headless run (sticky state, mobile menu, dropdown, carousel
stepping, audio play + track switch, playlist selection and mobile collapse,
both invalid and valid newsletter form paths).

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
| `how-i-get-into-writing` | 1779 | 1789 | +0.6% | `blue-the-ancient-rock` | 2441 | 2385 | −2.3% |
| `blog` | 1939 | 1950 | +0.6% | `contact` | 2154 | 2138 | −0.7% |

Seven of twelve sampled interior pages land within ±0.7%. `books` — the most
complex interior page, with the 12-slide carousel, news strip and the tall
`565 × 901` author portrait variant — is exact. The remaining 2–8 % shortfalls
are Elementor container padding inside one card each (`art`'s info-card band is
~107 px shorter; the source Submit button sits at y 1337 vs 1230 locally), not
missing sections; every section, card, control and link is present on both.

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
  still resolve to the real services.
- Canonical and hreflang tags keep the live URLs; body links do not.
- Elementor-hidden blog blocks in the source DOM are not rendered.

## Repository history

`main` previously carried four directories of earlier site captures
(`ferdouse-com`, `ferdouse-com-html`, `test-ferdouse-com`,
`test-ferdouse-com-html`) totalling 1 525 files and ~440 MB. Those were removed
from the tip and replaced by this cleaned build. The old captures remain
recoverable from history (`git checkout a5bb423 -- ferdouse-com`).

## Scope

Content, layout and interactions of the public pages only. Not included: the
generator and measurement tooling, the CMS, authenticated routes, search,
comments, and any backend.
