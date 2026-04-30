const express = require('express');
const router = express.Router();
const pool = require('../db');

// Check if a username exists. Returns user data if found.
router.post('/check', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });

  const [rows] = await pool.query('SELECT id, username, created_at, last_active FROM users WHERE username = ?', [username]);
  if (rows.length === 0) return res.json({ exists: false });

  res.json({ exists: true, user: rows[0] });
});

// Create a new user.
router.post('/create', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });

  const [result] = await pool.query('INSERT INTO users (username) VALUES (?)', [username]);
  res.status(201).json({ id: result.insertId, username });
});

module.exports = router;
