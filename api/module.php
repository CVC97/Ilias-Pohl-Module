<?php
require_once __DIR__ . '/db.php';

function getModuleId(): int {
    static $moduleId = null;
    if ($moduleId !== null) return $moduleId;

    $cfg = require __DIR__ . '/config.php';
    $pdo = getDb();
    $pdo->prepare('INSERT IGNORE INTO modules (name) VALUES (?)')->execute([$cfg['module_name']]);
    $stmt = $pdo->prepare('SELECT id FROM modules WHERE name = ?');
    $stmt->execute([$cfg['module_name']]);
    $moduleId = (int) $stmt->fetchColumn();
    return $moduleId;
}
