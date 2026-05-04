<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../module.php';

$body      = json_decode(file_get_contents('php://input'), true);
$username  = $body['username']  ?? '';
$sessionId = $body['sessionId'] ?? '';

if (!$username || !$sessionId) {
    http_response_code(400);
    exit(json_encode(['error' => 'username and sessionId required']));
}

$pdo  = getDb();
$stmt = $pdo->prepare('SELECT id FROM users WHERE module_id = ? AND username = ?');
$stmt->execute([getModuleId(), $username]);
$userId = $stmt->fetchColumn();

if (!$userId) {
    http_response_code(404);
    exit(json_encode(['error' => 'User not found']));
}

// Handles both ISO-string timestamps and JS millisecond timestamps.
function toDatetime($ts): string {
    if (is_numeric($ts) && $ts > 1e10) {
        return gmdate('Y-m-d H:i:s', intval($ts / 1000));
    }
    return gmdate('Y-m-d H:i:s', strtotime((string) $ts));
}

$analytics     = $body['analytics']     ?? [];
$moduleResults = $body['moduleResults'] ?? [];
$testResults   = $body['testResults']   ?? [];

try {
    $pdo->beginTransaction();

    if (!empty($analytics['visits'])) {
        $s = $pdo->prepare(
            'INSERT INTO page_visits (user_id, session_id, page, duration_s, visited_at)
             VALUES (?, ?, ?, ?, ?)'
        );
        foreach ($analytics['visits'] as $v) {
            $s->execute([$userId, $sessionId, $v['page'], $v['duration_s'] ?? null,
                         toDatetime($v['timestamp'])]);
        }
    }

    if ($moduleResults) {
        $s = $pdo->prepare(
            'INSERT INTO module_results
               (user_id, session_id, module_id, question_id, is_correct,
                selected_answers, correct_answers, attempt_count, answered_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        foreach ($moduleResults as $mod) {
            foreach ($mod['results'] ?? [] as $q) {
                $s->execute([
                    $userId, $sessionId, $mod['moduleId'], $q['questionId'],
                    $q['isCorrect'] ? 1 : 0,
                    json_encode($q['selectedAnswers']),
                    json_encode($q['correctAnswers']),
                    $q['attemptCount'],
                    toDatetime($q['timestamp']),
                ]);
            }
        }
    }

    if ($testResults) {
        $s = $pdo->prepare(
            'INSERT INTO test_results
               (user_id, session_id, test_id, question_id, is_correct,
                user_answer, correct_answer, points_awarded, max_points, answered_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        foreach ($testResults as $test) {
            foreach ($test['results'] ?? [] as $q) {
                $s->execute([
                    $userId, $sessionId, $test['testId'], $q['questionId'],
                    $q['isCorrect'] ? 1 : 0,
                    json_encode($q['userAnswer']),
                    json_encode($q['correctAnswer']),
                    $q['pointsAwarded'],
                    $q['maxPoints'],
                    toDatetime($q['timestamp']),
                ]);
            }
        }
    }

    $pdo->prepare('UPDATE users SET last_active = NOW() WHERE id = ?')->execute([$userId]);
    $pdo->commit();
    echo json_encode(['ok' => true]);

} catch (Exception $e) {
    $pdo->rollBack();
    error_log('Progress save failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save progress']);
}
