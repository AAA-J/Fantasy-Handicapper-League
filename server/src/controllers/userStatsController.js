const { db } = require('../db/database');

/**
 * Get user's complete bet history with outcomes
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of bet history records
 */
function getUserHistory(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        mb.id,
        mb.contract_id,
        mc.title as contract_title,
        mb.position,
        mb.amount,
        mb.shares,
        mb.purchase_price,
        mb.payout_amount,
        mb.created_at as bet_date,
        mc.status as contract_status,
        mc.resolution,
        CASE 
          WHEN mc.status = 'closed' AND mb.position = mc.resolution THEN 'win'
          WHEN mc.status = 'closed' AND mb.position != mc.resolution THEN 'loss'
          ELSE 'pending'
        END as outcome,
        CASE 
          WHEN mc.status = 'closed' AND mb.position = mc.resolution THEN mb.payout_amount - mb.amount
          WHEN mc.status = 'closed' AND mb.position != mc.resolution THEN -mb.amount
          ELSE 0
        END as profit_loss
      FROM market_bets mb
      JOIN market_contracts mc ON mb.contract_id = mc.id
      WHERE mb.user_id = ?
      ORDER BY mb.created_at DESC
    `;
    
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Get user's statistics summary
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User statistics
 */
function getUserStatistics(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        COUNT(*) as total_bets,
        SUM(CASE 
          WHEN mc.status = 'closed' AND mb.position = mc.resolution THEN 1 
          ELSE 0 
        END) as winning_bets,
        SUM(CASE 
          WHEN mc.status = 'closed' AND mb.position = mc.resolution THEN mb.payout_amount - mb.amount
          WHEN mc.status = 'closed' AND mb.position != mc.resolution THEN -mb.amount
          ELSE 0
        END) as total_profit,
        SUM(mb.amount) as total_volume,
        AVG(CASE 
          WHEN mc.status = 'closed' AND mb.position = mc.resolution THEN 1.0
          WHEN mc.status = 'closed' AND mb.position != mc.resolution THEN 0.0
          ELSE NULL
        END) as win_rate
      FROM market_bets mb
      JOIN market_contracts mc ON mb.contract_id = mc.id
      WHERE mb.user_id = ?
    `;
    
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        const stats = {
          total_bets: row.total_bets || 0,
          winning_bets: row.winning_bets || 0,
          total_profit: row.total_profit || 0,
          total_volume: row.total_volume || 0,
          win_rate: row.win_rate || 0
        };
        resolve(stats);
      }
    });
  });
}

/**
 * Get user's active positions (unresolved contracts)
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of active positions
 */
function getActivePositions(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        mb.id,
        mb.contract_id,
        mc.title as contract_title,
        mb.position,
        mb.amount,
        mb.shares,
        mb.purchase_price,
        mc.current_yes_probability,
        mc.yes_pool,
        mc.no_pool,
        mb.created_at as bet_date
      FROM market_bets mb
      JOIN market_contracts mc ON mb.contract_id = mc.id
      WHERE mb.user_id = ? AND mc.status = 'open'
      ORDER BY mb.created_at DESC
    `;
    
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Calculate potential payouts for each position
        const positionsWithPayouts = rows.map(position => {
          const totalPool = position.yes_pool + position.no_pool;
          const potentialPayout = totalPool > 0 ? 
            (position.shares * totalPool) / (position.position === 'yes' ? position.yes_pool : position.no_pool) : 0;
          
          return {
            ...position,
            potential_payout: potentialPayout,
            potential_profit: potentialPayout - position.amount
          };
        });
        
        resolve(positionsWithPayouts);
      }
    });
  });
}

/**
 * Get leaderboard of top users by profit
 * @param {number} limit - Number of users to return (default 10)
 * @returns {Promise<Array>} Array of leaderboard entries
 */
function getLeaderboard(limit = 10) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        u.id,
        u.username,
        COALESCE(stats.total_bets, 0) as total_bets,
        COALESCE(stats.winning_bets, 0) as winning_bets,
        COALESCE(stats.total_profit, 0) as total_profit,
        COALESCE(stats.total_volume, 0) as total_volume,
        COALESCE(stats.win_rate, 0) as win_rate
      FROM users u
      LEFT JOIN (
        SELECT 
          mb.user_id,
          COUNT(*) as total_bets,
          SUM(CASE 
            WHEN mc.status = 'closed' AND mb.position = mc.resolution THEN 1 
            ELSE 0 
          END) as winning_bets,
          SUM(CASE 
            WHEN mc.status = 'closed' AND mb.position = mc.resolution THEN mb.payout_amount - mb.amount
            WHEN mc.status = 'closed' AND mb.position != mc.resolution THEN -mb.amount
            ELSE 0
          END) as total_profit,
          SUM(mb.amount) as total_volume,
          AVG(CASE 
            WHEN mc.status = 'closed' AND mb.position = mc.resolution THEN 1.0
            WHEN mc.status = 'closed' AND mb.position != mc.resolution THEN 0.0
            ELSE NULL
          END) as win_rate
        FROM market_bets mb
        JOIN market_contracts mc ON mb.contract_id = mc.id
        GROUP BY mb.user_id
      ) stats ON u.id = stats.user_id
      ORDER BY COALESCE(stats.total_profit, 0) DESC, COALESCE(stats.total_volume, 0) DESC
      LIMIT ?
    `;
    
    db.all(sql, [limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Update user statistics after a bet is placed or resolved
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 */
function updateUserStatistics(userId) {
  return new Promise((resolve, reject) => {
    getUserStatistics(userId).then(stats => {
      const sql = `
        INSERT OR REPLACE INTO user_statistics 
        (user_id, total_bets, winning_bets, total_profit, total_volume, win_rate, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;
      
      db.run(sql, [
        userId,
        stats.total_bets,
        stats.winning_bets,
        stats.total_profit,
        stats.total_volume,
        stats.win_rate
      ], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).catch(reject);
  });
}

module.exports = {
  getUserHistory,
  getUserStatistics,
  getActivePositions,
  getLeaderboard,
  updateUserStatistics
};
