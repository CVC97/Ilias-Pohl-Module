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
$key      = $body['key'] ?? '';

if (!$username) {
    http_response_code(400);
    exit(json_encode(['error' => 'username required']));
}

$cfg = require __DIR__ . '/../config.php';
if (!empty($cfg['module_key']) && $key !== $cfg['module_key']) {
    http_response_code(401);
    exit(json_encode(['error' => 'invalid key']));
}

$pdo  = getDb();
$stmt = $pdo->prepare(
    'SELECT id, username, created_at, last_active FROM users WHERE module_id = ? AND username = ?'
);
$stmt->execute([getModuleId(), $username]);
$user = $stmt->fetch();

if (!$user) {
    exit(json_encode(['exists' => false]));
}
exit(json_encode(['exists' => true, 'user' => $user]));
