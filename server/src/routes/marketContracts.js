const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const marketMaker = require('../utils/marketMaker');
const userStats = require('../controllers/userStatsController');
const { updateUserRanking, checkAchievements } = require('../utils/rankingSystem');
const { 
  validateBetPlacement, 
  validateContractCreation, 
  validateContractResolution,
  validateUserId,
  validateContractId,
  asyncHandler 
} = require('../middleware/validation');

// Get all market contracts
router.get('/', asyncHandler(async (req, res) => {
  const sql = `
    SELECT mc.*, 
           COUNT(mb.id) as bet_count,
           SUM(CASE WHEN mb.position = 'yes' THEN mb.amount ELSE 0 END) as yes_amount,
           SUM(CASE WHEN mb.position = 'no' THEN mb.amount ELSE 0 END) as no_amount,
           u.username as creator_name
    FROM market_contracts mc
    LEFT JOIN market_bets mb ON mc.id = mb.contract_id
    LEFT JOIN users u ON mc.creator_id = u.id
    GROUP BY mc.id
    ORDER BY mc.created_at DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Add market state to each contract
    const contractsWithMarketState = rows.map(contract => {
      const marketState = marketMaker.getMarketState(contract.yes_pool, contract.no_pool);
      return {
        ...contract,
        ...marketState
      };
    });
    
    res.json(contractsWithMarketState);
  });
}));

// Create new market contract
router.post('/', validateContractCreation, asyncHandler(async (req, res) => {
  const { title, description, category = 'general', creatorId, closingDate } = req.body;
  
  const sql = `
    INSERT INTO market_contracts 
    (title, description, category, creator_id, closing_date, yes_pool, no_pool, liquidity_pool, current_yes_probability) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const initialPool = 500; // Half of default liquidity pool
  const initialProbability = 0.5;
  
  db.run(sql, [
    title, 
    description, 
    category, 
    creatorId, 
    closingDate, 
    initialPool, 
    initialPool, 
    initialPool * 2, 
    initialProbability
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Record initial price in history
    const historySql = `
      INSERT INTO contract_price_history (contract_id, yes_probability, yes_pool, no_pool) 
      VALUES (?, ?, ?, ?)
    `;
    db.run(historySql, [this.lastID, initialProbability, initialPool, initialPool]);
    
    res.json({ 
      id: this.lastID, 
      title, 
      description, 
      category,
      status: 'open',
      current_yes_probability: initialProbability,
      yes_pool: initialPool,
      no_pool: initialPool
    });
  });
}));

// Place a bet on a market contract
router.post('/:id/bet', validateContractId, validateBetPlacement, asyncHandler(async (req, res) => {
  const { userId, position, amount } = req.body;
  const contractId = req.params.id;
  
  db.serialize(() => {
    // Check if contract is open and get current state
    db.get('SELECT * FROM market_contracts WHERE id = ?', [contractId], (err, contract) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!contract) {
        res.status(404).json({ error: 'Contract not found' });
        return;
      }
      
      if (contract.status !== 'open') {
        res.status(400).json({ error: 'Contract is not open for betting' });
        return;
      }
      
      // Check user balance
      db.get('SELECT prediction_coins FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        
        if (user.prediction_coins < amount) {
          res.status(400).json({ error: 'Insufficient prediction coins' });
          return;
        }
        
        // Calculate price using AMM
        const priceResult = marketMaker.calculatePrice(amount, contract.yes_pool, contract.no_pool, position);
        
        // Place the bet with calculated values
        const betSql = `
          INSERT INTO market_bets 
          (user_id, contract_id, position, amount, shares, purchase_price, potential_payout) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const potentialPayout = marketMaker.calculatePotentialPayout(
          priceResult.shares, 
          priceResult.newYesPool, 
          priceResult.newNoPool, 
          position
        );
        
        db.run(betSql, [
          userId, 
          contractId, 
          position, 
          amount, 
          priceResult.shares, 
          priceResult.price,
          potentialPayout
        ], function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          // Update contract pools and probability
          const updateContractSql = `
            UPDATE market_contracts 
            SET yes_pool = ?, no_pool = ?, current_yes_probability = ?
            WHERE id = ?
          `;
          
          db.run(updateContractSql, [
            priceResult.newYesPool,
            priceResult.newNoPool,
            priceResult.newProbability,
            contractId
          ], (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            
            // Record price history
            const historySql = `
              INSERT INTO contract_price_history (contract_id, yes_probability, yes_pool, no_pool) 
              VALUES (?, ?, ?, ?)
            `;
            db.run(historySql, [contractId, priceResult.newProbability, priceResult.newYesPool, priceResult.newNoPool]);
            
            // Deduct coins from user
            const updateUserSql = 'UPDATE users SET prediction_coins = prediction_coins - ? WHERE id = ?';
            db.run(updateUserSql, [amount, userId], (err) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              
              // Update user statistics
              userStats.updateUserStatistics(userId);
              
              // Update ranking system (bet is pending, no points yet)
              // Points will be awarded when bet is resolved
              
              res.json({ 
                id: this.lastID, 
                userId, 
                contractId, 
                position, 
                amount,
                shares: priceResult.shares,
                price: priceResult.price,
                potentialPayout,
                newProbability: priceResult.newProbability,
                message: 'Bet placed successfully'
              });
            });
          });
        });
      });
    });
  });
}));

// Resolve a market contract
router.post('/:id/resolve', validateContractId, validateContractResolution, asyncHandler(async (req, res) => {
  const { resolution } = req.body;
  const contractId = req.params.id;
  
  db.serialize(() => {
    // Get contract details for payout calculation
    db.get('SELECT * FROM market_contracts WHERE id = ?', [contractId], (err, contract) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!contract) {
        res.status(404).json({ error: 'Contract not found' });
        return;
      }
      
      // Update contract status and resolution
      const updateSql = 'UPDATE market_contracts SET status = "closed", resolution = ? WHERE id = ?';
      db.run(updateSql, [resolution, contractId], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        if (this.changes === 0) {
          res.status(404).json({ error: 'Contract not found' });
          return;
        }
        
        // Get all bets for this contract
        db.all('SELECT * FROM market_bets WHERE contract_id = ?', [contractId], (err, bets) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          // Calculate payouts for each bet
          const totalPool = contract.yes_pool + contract.no_pool;
          let totalPayouts = 0;
          
          // Process each bet and update rankings
          const rankingUpdates = [];
          
          bets.forEach(bet => {
            const actualPayout = marketMaker.calculateActualPayout(
              bet.shares, 
              totalPool, 
              bet.position, 
              resolution
            );
            
            // Determine if bet was won or lost
            const betResult = actualPayout > 0 ? 'win' : 'loss';
            const odds = bet.purchase_price > 0 ? 1 / bet.purchase_price : 1;
            const isUnderdog = odds > 2.0;
            const isHighConfidence = bet.amount > 100;
            
            // Update bet with actual payout
            db.run(
              'UPDATE market_bets SET payout_amount = ? WHERE id = ?',
              [actualPayout, bet.id]
            );
            
            // Pay out to user if they won
            if (actualPayout > 0) {
              db.run(
                'UPDATE users SET prediction_coins = prediction_coins + ? WHERE id = ?',
                [actualPayout, bet.user_id]
              );
              totalPayouts += actualPayout;
            }
            
            // Update user statistics
            userStats.updateUserStatistics(bet.user_id);
            
            // Queue ranking update
            rankingUpdates.push(
              updateUserRanking(bet.user_id, betResult, bet.amount, odds, contract.category)
                .then(async (rankingResult) => {
                  // Check for new achievements
                  const newAchievements = await checkAchievements(bet.user_id);
                  return { rankingResult, newAchievements };
                })
                .catch(err => console.error('Error updating ranking:', err))
            );
          });
          
          // Wait for all ranking updates to complete
          Promise.all(rankingUpdates).then(() => {
            console.log('All ranking updates completed');
          });
          
          res.json({ 
            contractId, 
            resolution, 
            totalPayouts,
            totalBets: bets.length,
            message: 'Contract resolved and payouts distributed'
          });
        });
      });
    });
  });
}));

// Get user's market balance
router.get('/users/:id/balance', validateUserId, asyncHandler(async (req, res) => {
  const userId = req.params.id;
  
  db.get('SELECT prediction_coins FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ prediction_coins: user.prediction_coins });
  });
}));

// Get user's bet history
router.get('/users/:id/history', validateUserId, asyncHandler(async (req, res) => {
  try {
    const history = await userStats.getUserHistory(req.params.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

// Get user's statistics
router.get('/users/:id/statistics', validateUserId, asyncHandler(async (req, res) => {
  try {
    const statistics = await userStats.getUserStatistics(req.params.id);
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

// Get user's active positions
router.get('/users/:id/active-positions', validateUserId, asyncHandler(async (req, res) => {
  try {
    const positions = await userStats.getActivePositions(req.params.id);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

// Get leaderboard
router.get('/leaderboard', asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await userStats.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

// Get contract price history
router.get('/:id/price-history', validateContractId, asyncHandler(async (req, res) => {
  const contractId = req.params.id;
  
  const sql = `
    SELECT yes_probability, yes_pool, no_pool, timestamp
    FROM contract_price_history 
    WHERE contract_id = ? 
    ORDER BY timestamp ASC
  `;
  
  db.all(sql, [contractId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
}));

// Get user's position in a specific contract
router.get('/:id/user-position', validateContractId, asyncHandler(async (req, res) => {
  const contractId = req.params.id;
  const userId = req.query.userId;
  
  if (!userId) {
    res.status(400).json({ error: 'userId query parameter is required' });
    return;
  }
  
  const sql = `
    SELECT 
      mb.position,
      mb.amount,
      mb.shares,
      mb.purchase_price,
      mb.potential_payout,
      mb.created_at
    FROM market_bets mb
    WHERE mb.contract_id = ? AND mb.user_id = ?
    ORDER BY mb.created_at DESC
  `;
  
  db.all(sql, [contractId, userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
}));

module.exports = router;
