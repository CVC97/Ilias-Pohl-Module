const express = require('express');
const router = express.Router();
const pool = require('../db');

// Save all progress data for a user (analytics + module results + test results).
router.post('/save', async (req, res) => {
  const { username, sessionId, analytics, moduleResults, testResults } = req.body;
  if (!username || !sessionId) return res.status(400).json({ error: 'username and sessionId required' });

  // Resolve username to DB user ID.
  const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
  if (users.length === 0) return res.status(404).json({ error: 'User not found' });
  const userId = users[0].id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // analytics.visits matches the AnalyticsData interface from the Angular service
    if (analytics?.visits?.length) {
      for (const visit of analytics.visits) {
        await conn.query(
          `INSERT INTO page_visits (user_id, session_id, page, duration_s, visited_at)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, sessionId, visit.page, visit.duration_s ?? null, new Date(visit.timestamp)]
        );
      }
    }

    if (moduleResults?.length) {
      for (const mod of moduleResults) {
        for (const q of mod.results ?? []) {
          await conn.query(
            `INSERT INTO module_results
               (user_id, session_id, module_id, question_id, is_correct, selected_answers, correct_answers, attempt_count, answered_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, sessionId, mod.moduleId, q.questionId, q.isCorrect,
             JSON.stringify(q.selectedAnswers), JSON.stringify(q.correctAnswers),
             q.attemptCount, new Date(q.timestamp)]
          );
        }
      }
    }

    if (testResults?.length) {
      for (const test of testResults) {
        for (const q of test.results ?? []) {
          await conn.query(
            `INSERT INTO test_results
               (user_id, session_id, test_id, question_id, is_correct, user_answer, correct_answer, points_awarded, max_points, answered_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, sessionId, test.testId, q.questionId, q.isCorrect,
             JSON.stringify(q.userAnswer), JSON.stringify(q.correctAnswer),
             q.pointsAwarded, q.maxPoints, new Date(q.timestamp)]
          );
        }
      }
    }

    await conn.query('UPDATE users SET last_active = NOW() WHERE id = ?', [userId]);
    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error('Progress save failed:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  } finally {
    conn.release();
  }
});

// Load all progress for a user by username.
router.get('/:username', async (req, res) => {
  const { username } = req.params;

  const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
  if (users.length === 0) return res.status(404).json({ error: 'User not found' });
  const userId = users[0].id;

  const [pageVisits] = await pool.query(
    'SELECT * FROM page_visits WHERE user_id = ? ORDER BY visited_at ASC',
    [userId]
  );
  const [moduleResults] = await pool.query(
    'SELECT * FROM module_results WHERE user_id = ? ORDER BY answered_at ASC',
    [userId]
  );
  const [testResults] = await pool.query(
    'SELECT * FROM test_results WHERE user_id = ? ORDER BY answered_at ASC',
    [userId]
  );

  res.json({ pageVisits, moduleResults, testResults });
});

module.exports = router;
