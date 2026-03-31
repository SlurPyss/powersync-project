<?php

return [
    'paths' => ['api/*'],   // aktifkan CORS untuk semua route API

    'allowed_methods' => ['*'],  // izinkan semua method (GET, POST, PUT, DELETE)

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],  // izinkan frontend React/Vite

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],  // izinkan semua header

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];