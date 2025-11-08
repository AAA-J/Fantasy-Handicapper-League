const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// Get all prop bets
router.get('/', (req, res) => {
  const sql = `
    SELECT pb.*, 
           COUNT(fb.id) as bet_count,
           SUM(fb.amount) as total_amount
    FROM prop_bets pb
    LEFT JOIN fantasy_bets fb ON pb.id = fb.prop_bet_id
    GROUP BY pb.id
    ORDER BY pb.created_at DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new prop bet
router.post('/', (req, res) => {
  const { title, description, odds } = req.body;
  
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  
  const sql = 'INSERT INTO prop_bets (title, description, odds) VALUES (?, ?, ?)';
  db.run(sql, [title, description, odds || 1.0], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, description, odds: odds || 1.0, status: 'open' });
  });
});

// Place a bet on a prop bet
router.post('/:id/bet', (req, res) => {
  const { userId, amount } = req.body;
  const propBetId = req.params.id;
  
  if (!userId || !amount) {
    res.status(400).json({ error: 'userId and amount are required' });
    return;
  }
  
  if (amount <= 0) {
    res.status(400).json({ error: 'Amount must be positive' });
    return;
  }
  
  // Check if prop bet is open
  db.get('SELECT status FROM prop_bets WHERE id = ?', [propBetId], (err, propBet) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!propBet) {
      res.status(404).json({ error: 'Prop bet not found' });
      return;
    }
    
    if (propBet.status !== 'open') {
      res.status(400).json({ error: 'Prop bet is not open for betting' });
      return;
    }
    
    // Check user balance
    db.get('SELECT fantasy_coins FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      if (user.fantasy_coins < amount) {
        res.status(400).json({ error: 'Insufficient fantasy coins' });
        return;
      }
      
      // Place the bet
      const sql = 'INSERT INTO fantasy_bets (user_id, prop_bet_id, amount) VALUES (?, ?, ?)';
      db.run(sql, [userId, propBetId, amount], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Deduct coins from user
        const updateSql = 'UPDATE users SET fantasy_coins = fantasy_coins - ? WHERE id = ?';
        db.run(updateSql, [amount, userId], (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          res.json({ 
            id: this.lastID, 
            userId, 
            propBetId, 
            amount,
            message: 'Fantasy bet placed successfully'
          });
        });
      });
    });
  });
});

// Resolve a prop bet
router.post('/:id/resolve', (req, res) => {
  const { result } = req.body;
  const propBetId = req.params.id;
  
  if (!['win', 'loss'].includes(result)) {
    res.status(400).json({ error: 'Result must be "win" or "loss"' });
    return;
  }
  
  // Update prop bet status and result
  const sql = 'UPDATE prop_bets SET status = "closed", result = ? WHERE id = ?';
  db.run(sql, [result, propBetId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Prop bet not found' });
      return;
    }
    
    // Pay out winning bets
    if (result === 'win') {
      const payoutSql = `
        UPDATE users 
        SET fantasy_coins = fantasy_coins + (fb.amount * pb.odds)
        FROM fantasy_bets fb
        JOIN prop_bets pb ON fb.prop_bet_id = pb.id
        WHERE users.id = fb.user_id 
        AND fb.prop_bet_id = ?
      `;
      
      db.run(payoutSql, [propBetId], (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({ 
          propBetId, 
          result, 
          message: 'Prop bet resolved and payouts distributed'
        });
      });
    } else {
      res.json({ 
        propBetId, 
        result, 
        message: 'Prop bet resolved - no payouts for losing bets'
      });
    }
  });
});

// Get user's fantasy balance
router.get('/users/:id/balance', (req, res) => {
  const userId = req.params.id;
  
  db.get('SELECT fantasy_coins FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ fantasy_coins: user.fantasy_coins });
  });
});

module.exports = router;
