# Static PHP Website Exports

This repository contains two database-free exports of public websites. Each site
is kept in its own directory and includes complete page snapshots, a PHP slug
router, an Apache `.htaccess` file, and locally mirrored assets.

## Sites and cloned pages

### `test-ferdouse-com/`

Source site: [https://test.ferdouse.com](https://test.ferdouse.com)  
Captured: 20 content pages, plus the custom 404 page.

Routes:

- `/about`
- `/art`
- `/blue-the-ancient-rock`
- `/books`
- `/contact`
- `/death-of-a-star`
- `/enlightenment`
- `/home` (homepage)
- `/jupiter-earth-project`
- `/movie`
- `/multiverse-timeline`
- `/music`
- `/planet-blue`
- `/planet-seracuse`
- `/planet-seracuse-2`
- `/poetry`
- `/seracuse-island`
- `/singularity-mindscape`
- `/the-dark-web`
- `/tim-the-super-sentient`

### `ferdouse-com/`

Source site: [https://ferdouse.com](https://ferdouse.com) (canonical host:
`www.ferdouse.com`).  
Captured: 29 site pages and 4 public category archive pages, plus the custom
404 page.

Routes:

- `/about`
- `/about-us`
- `/art`
- `/blog`
- `/blue-the-ancient-rock`
- `/books`
- `/category/commercial`
- `/category/vfx`
- `/category/video`
- `/category/writing`
- `/contact`
- `/death-of-a-star`
- `/duis-mauris-augue-efficitur-posuere-dignissim-neque`
- `/enlightenment`
- `/free-book`
- `/home`
- `/homepage` (homepage route)
- `/how-i-get-into-writing`
- `/jupiter-earth-project`
- `/movie`
- `/multiverse-timeline`
- `/music`
- `/planet-blue`
- `/planet-seracuse`
- `/planet-seracuse-2`
- `/poetry`
- `/proin-ex-ipsum-facilisis-tincidunt-vulputate`
- `/quam-vulputate-dignissim-suspendisse-intellus`
- `/seracuse-island`
- `/singularity-mindscape`
- `/the-dark-web`
- `/tim-the-super-sentient`
- `/vestibulum-commodo-sapien-non-elit-vitae`

The category routes above map to flat files such as
`ferdouse-com/category-writing.php`; the router translates the nested URL
`/category/writing` to that file.

## Differences between the two exports

The inventories below count files in each site directory, including its router,
404 page, local README, and `.htaccess` configuration. The page count is the
content routes only; the 404 document and router are listed separately.

| File type / role | `test-ferdouse-com/` | `ferdouse-com/` | Difference |
| --- | ---: | ---: | --- |
| Content page PHP files | 20 | 33 | Ferdouse.com has 13 more |
| Router and 404 PHP files | 2 | 2 | Same count |
| Local README and `.htaccess` files | 2 | 2 | Same count |
| PNG images | 160 | 168 | Ferdouse.com has 8 more |
| WebP images | 154 | 160 | Ferdouse.com has 6 more |
| JPG images | 19 | 20 | Ferdouse.com has 1 more |
| CSS stylesheets | 31 | 40 | Ferdouse.com has 9 more |
| JavaScript files | 26 | 26 | Same count |
| Font and icon resources | 71 | 71 | Same count |
| Total files | 485 | 522 | Ferdouse.com has 37 more |

Both snapshots use full HTML documents rather than fragments: each content page
has its own `<html>`, `<head>`, and `<body>`, with captured metadata and inline
markup. The common visual structure includes header/navigation, a main content
area, and footer markup. These are duplicated in page snapshots; there is no
shared PHP header/footer include.

The `test.ferdouse.com` export is the smaller, more uniform set of 20 content
pages: each typically has one main content article, alongside the captured site
chrome.
The `ferdouse.com` export contains 33 content routes, including four category
archives. Its page markup has more variation: archive pages use listing-specific
markup and `<time>` metadata, while regular pages retain the common site
chrome. The additional routes and archive content contribute to its higher
overall amount of captured markup, image files, and stylesheets. Both exports
preserve the source markup and classes rather than normalizing the two sites to
a shared DOM.

## HTML and file structure

Each page is a standalone `.php` file containing a complete captured HTML
document: its document metadata, page content, and the site's header and footer
markup are present in the page file. These are static snapshots, not a shared
template system or server-side CMS. PHP is used for URL routing and serving the
snapshot; the exported pages do not connect to a database.

Images, stylesheets, fonts, and other captured resources are stored locally in
each site's `assets/`, `uploads/`, and `i.ytimg.com/` directories. Internal page
links and asset references use the corresponding site-folder URL prefix. A
separate `404.php` supplies the site's not-found page, and `index.php` maps
extensionless slugs to page files. WordPress-dependent features such as dynamic
forms or server-side behavior are not reproduced as backend services.

## Deploy with Apache and PHP

The checked-in rewrite rules expect this repository's root to be the Apache
document root, with both site directories accessible at `/test-ferdouse-com/`
and `/ferdouse-com/`.

1. Copy or check out the repository into the document root configured for an
   Apache virtual host. Ensure the Apache worker can read the PHP files and
   assets.
2. Install/enable PHP for Apache and enable `mod_rewrite`.
3. Allow `.htaccess` overrides for the document root (for example,
   `AllowOverride All`) and ensure `Options` and rewrite directives are
   permitted.
4. Restart or reload Apache, then visit:
   - `https://your-host.example/test-ferdouse-com/`
   - `https://your-host.example/ferdouse-com/`

Each site's `.htaccess` handles extensionless routes, redirects direct `.php`
page requests to clean URLs, disables directory listings, and blocks direct
requests to directories while allowing requests for individual asset files.
Unknown slugs are routed to the matching site's custom 404 page with an HTTP
404 status.

To host the exports at separate domains or at the web root rather than under
these folder prefixes, update that site's `.htaccess` rewrite base/targets and
the absolute folder-prefixed links in its page snapshots to match the chosen
deployment path.

### Local preview

From the repository root, either site can also be previewed with PHP's
development server:

```sh
php -S 127.0.0.1:8000 -t . test-ferdouse-com/index.php
```

Use `ferdouse-com/index.php` as the router argument to preview the second site
instead. This built-in server is for local testing, not production hosting.
