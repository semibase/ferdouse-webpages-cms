# Ferdouse.com Static PHP Export

Static, database-free PHP export of the public WordPress pages at:

- Source base URL: https://ferdouse.com (canonical host: https://www.ferdouse.com)
- Pages and public category archives: 33
- Static 404 document: `404.php`
- Slug routing: root `index.php`
- Assets: locally mirrored under `assets/`, `uploads/`, and `i.ytimg.com/`

The homepage is `/ferdouse-com/`. Other pages use extensionless URLs such as
`/ferdouse-com/movie` and `/ferdouse-com/category/writing`.

## Run locally

```sh
cd /path/to/repository
php -S 127.0.0.1:8000 -t . ferdouse-com/index.php
```

Open `/ferdouse-com/`; other pages use extensionless URLs such as
`/ferdouse-com/movie` and `/ferdouse-com/category/writing`.

For Apache deployment, enable `mod_rewrite` and allow `.htaccess` overrides.
The configuration disables directory listings and direct requests to folders,
while allowing files within asset folders to load.

Source scripts and form submissions that depend on WordPress or third-party
services are disabled; the local-only navigation script remains active.
