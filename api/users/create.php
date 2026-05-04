<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../module.php';

$body    = json_decode(file_get_contents('php://input'), true);
$username = trim($body['username'] ?? '');

if (!$username) {
    http_response_code(400);
    exit(json_encode(['error' => 'username required']));
}

$pdo  = getDb();
$stmt = $pdo->prepare('INSERT INTO users (module_id, username) VALUES (?, ?)');
$stmt->execute([getModuleId(), $username]);

http_response_code(201);
exit(json_encode(['id' => (int) $pdo->lastInsertId(), 'username' => $username]));
