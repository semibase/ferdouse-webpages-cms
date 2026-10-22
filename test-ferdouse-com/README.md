# AI-Agnostic CMS Project

Static PHP export of the source website:

- Base URL: https://test.ferdouse.com
- Pages: 20 static pages served by the root `index.php` slug router
- Assets: mirrored locally under `assets/`, `uploads/`, and `i.ytimg.com/`
- Backend: no database dependency

## Run locally

```sh
cd /path/to/repository
php -S 127.0.0.1:8000 -t . test-ferdouse-com/index.php
```

Open `/test-ferdouse-com/`; other pages use extensionless slugs, for example
`/test-ferdouse-com/movie` or `/test-ferdouse-com/about`.

For Apache deployments, enable `mod_rewrite` and allow `.htaccess` overrides
so clean URLs, folder restrictions, and the custom 404 route work as configured.
