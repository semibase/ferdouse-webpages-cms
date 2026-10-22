<?php
declare(strict_types=1);

$requestedPage = $_GET['page'] ?? null;
$pageSlug = $requestedPage === null || $requestedPage === ''
    ? 'home'
    : (is_string($requestedPage) ? $requestedPage : '');

if (
    preg_match('/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/', $pageSlug) === 1
    && is_file(__DIR__ . '/' . $pageSlug . '.php')
) {
    if ($pageSlug === '404') {
        http_response_code(404);
    }
    require __DIR__ . '/' . $pageSlug . '.php';
    exit;
}

http_response_code(404);
require __DIR__ . '/404.php';
