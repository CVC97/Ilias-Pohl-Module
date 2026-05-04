<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../module.php';

$username = $_GET['username'] ?? '';
if (!$username) {
    http_response_code(400);
    exit(json_encode(['error' => 'username required']));
}

$pdo  = getDb();
$stmt = $pdo->prepare('SELECT id FROM users WHERE module_id = ? AND username = ?');
$stmt->execute([getModuleId(), $username]);
$userId = $stmt->fetchColumn();

if (!$userId) {
    http_response_code(404);
    exit(json_encode(['error' => 'User not found']));
}

$s = $pdo->prepare('SELECT * FROM page_visits WHERE user_id = ? ORDER BY visited_at ASC');
$s->execute([$userId]);
$pageVisits = $s->fetchAll();

$s = $pdo->prepare('SELECT * FROM module_results WHERE user_id = ? ORDER BY answered_at ASC');
$s->execute([$userId]);
$moduleResults = array_map(function ($r) {
    $r['is_correct']       = (bool) $r['is_correct'];
    $r['selected_answers'] = json_decode($r['selected_answers'], true);
    $r['correct_answers']  = json_decode($r['correct_answers'],  true);
    return $r;
}, $s->fetchAll());

$s = $pdo->prepare('SELECT * FROM test_results WHERE user_id = ? ORDER BY answered_at ASC');
$s->execute([$userId]);
$testResults = array_map(function ($r) {
    $r['is_correct']    = (bool) $r['is_correct'];
    $r['user_answer']   = json_decode($r['user_answer'],   true);
    $r['correct_answer'] = json_decode($r['correct_answer'], true);
    return $r;
}, $s->fetchAll());

exit(json_encode([
    'pageVisits'    => $pageVisits,
    'moduleResults' => $moduleResults,
    'testResults'   => $testResults,
]));
