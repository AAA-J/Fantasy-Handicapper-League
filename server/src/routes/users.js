const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Get all users
router.get('/', (req, res) => {
  const sql = 'SELECT id, username, prediction_coins, fantasy_coins, created_at FROM users ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new user
router.post('/', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }
  
  const sql = 'INSERT INTO users (username) VALUES (?)';
  db.run(sql, [username], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({ 
      id: this.lastID, 
      username, 
      prediction_coins: 1000, 
      fantasy_coins: 1000 
    });
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  
  const sql = 'SELECT id, username, prediction_coins, fantasy_coins, created_at FROM users WHERE id = ?';
  db.get(sql, [userId], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  });
});

module.exports = router;
