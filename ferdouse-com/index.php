<?php
declare(strict_types=1);

if (PHP_SAPI === 'cli-server') {
    $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $relativePath = is_string($requestPath) ? trim(rawurldecode($requestPath), '/') : '';
    $relativePath = preg_replace('~^ferdouse-com(?:/|$)~', '', $relativePath) ?? '';
    $staticPath = $relativePath !== '' ? realpath(__DIR__ . '/' . $relativePath) : false;
    $siteRoot = realpath(__DIR__);
    if (
        $staticPath !== false
        && $siteRoot !== false
        && strpos($staticPath, $siteRoot . DIRECTORY_SEPARATOR) === 0
        && is_file($staticPath)
    ) {
        return false;
    }
}

if (array_key_exists('page', $_GET)) {
    $requestedPage = $_GET['page'];
    $pageSlug = $requestedPage === ''
        ? 'homepage'
        : (is_string($requestedPage) ? trim($requestedPage, '/') : '');
} else {
    $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $pageSlug = is_string($requestPath) ? trim(rawurldecode($requestPath), '/') : '';
    $pageSlug = preg_replace('~^ferdouse-com(?:/|$)~', '', $pageSlug) ?? '';
    if ($pageSlug === '') {
        $pageSlug = 'homepage';
    }
}

if (preg_match('/\A[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*\z/', $pageSlug) === 1) {
    $fileSlug = str_replace('/', '-', $pageSlug);
    $pageFile = __DIR__ . '/' . $fileSlug . '.php';
    if (is_file($pageFile)) {
        if ($pageSlug === '404') {
            http_response_code(404);
        }
        require $pageFile;
        exit;
    }
}

http_response_code(404);
require __DIR__ . '/404.php';
