const { db } = require('../db/database');

// Tier definitions
const TIERS = {
  'Rookie': { min: 0, max: 100, color: '#CD7F32', icon: '🥉' },
  'Amateur': { min: 101, max: 500, color: '#C0C0C0', icon: '🥈' },
  'Semi-Pro': { min: 501, max: 1500, color: '#FFD700', icon: '🥇' },
  'Professional': { min: 1501, max: 5000, color: '#00D4AA', icon: '💎' },
  'Expert': { min: 5001, max: 15000, color: '#B9F2FF', icon: '💠' },
  'Master': { min: 15001, max: 50000, color: '#8A2BE2', icon: '👑' },
  'Legend': { min: 50001, max: Infinity, color: '#FF6B35', icon: '🔥' }
};

// Calculate tier based on points
const getTierFromPoints = (points) => {
  for (const [tierName, tierData] of Object.entries(TIERS)) {
    if (points >= tierData.min && points <= tierData.max) {
      return tierName;
    }
  }
  return 'Rookie';
};

// Calculate points for a bet result
const calculateBetPoints = (betResult, betAmount, odds, isUnderdog = false, isHighConfidence = false) => {
  let basePoints = 0;
  
  if (betResult === 'win') {
    basePoints = 10 * odds; // Base points multiplied by odds
    if (isUnderdog && odds > 2.0) {
      basePoints *= 3; // 3x points for underdog wins
    }
    if (isHighConfidence && betAmount > 100) {
      basePoints *= 2; // 2x points for high confidence bets
    }
  } else if (betResult === 'loss') {
    basePoints = -5; // Fixed loss penalty
  }
  
  return Math.round(basePoints);
};

// Calculate streak bonus
const calculateStreakBonus = (currentStreak) => {
  if (currentStreak <= 0) return 0;
  return Math.min(currentStreak * 5, 50); // Max +50 points for streaks
};

// Update user ranking after a bet
const updateUserRanking = async (userId, betResult, betAmount, odds, category = 'general') => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM user_rankings WHERE user_id = ?',
      [userId],
      (err, ranking) => {
        if (err) {
          reject(err);
          return;
        }

        if (!ranking) {
          // Create new ranking entry
          db.run(
            'INSERT INTO user_rankings (user_id, tier, rank_points, global_rank, tier_rank, win_streak, best_streak, loss_streak) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, 'Rookie', 0, 0, 0, 0, 0, 0],
            (err) => {
              if (err) {
                reject(err);
                return;
              }
              updateUserRanking(userId, betResult, betAmount, odds, category).then(resolve).catch(reject);
            }
          );
          return;
        }

        // Calculate new points
        const isUnderdog = odds > 2.0;
        const isHighConfidence = betAmount > 100;
        const betPoints = calculateBetPoints(betResult, betAmount, odds, isUnderdog, isHighConfidence);
        
        // Update streaks
        let newWinStreak = ranking.win_streak;
        let newLossStreak = ranking.loss_streak;
        let newBestStreak = ranking.best_streak;

        if (betResult === 'win') {
          newWinStreak += 1;
          newLossStreak = 0;
          if (newWinStreak > newBestStreak) {
            newBestStreak = newWinStreak;
          }
        } else if (betResult === 'loss') {
          newWinStreak = 0;
          newLossStreak += 1;
        }

        // Calculate streak bonus
        const streakBonus = calculateStreakBonus(newWinStreak);
        const totalPoints = ranking.rank_points + betPoints + streakBonus;

        // Determine new tier
        const newTier = getTierFromPoints(totalPoints);

        // Update ranking
        db.run(
          'UPDATE user_rankings SET tier = ?, rank_points = ?, win_streak = ?, best_streak = ?, loss_streak = ?, last_updated = CURRENT_TIMESTAMP WHERE user_id = ?',
          [newTier, totalPoints, newWinStreak, newBestStreak, newLossStreak, userId],
          (err) => {
            if (err) {
              reject(err);
              return;
            }

            // Update global rankings
            updateGlobalRankings().then(() => {
              resolve({
                newTier,
                newPoints: totalPoints,
                newWinStreak: newWinStreak,
                newLossStreak: newLossStreak,
                streakBonus,
                betPoints
              });
            }).catch(reject);
          }
        );
      }
    );
  });
};

// Update global rankings
const updateGlobalRankings = async () => {
  return new Promise((resolve, reject) => {
    // Get all users ordered by rank_points
    db.all(
      'SELECT user_id, rank_points, tier FROM user_rankings ORDER BY rank_points DESC',
      (err, users) => {
        if (err) {
          reject(err);
          return;
        }

        // Update global ranks
        const updatePromises = users.map((user, index) => {
          return new Promise((resolveUpdate, rejectUpdate) => {
            const globalRank = index + 1;
            
            // Calculate tier rank within the same tier
            const sameTierUsers = users.filter(u => u.tier === user.tier);
            const tierRank = sameTierUsers.findIndex(u => u.user_id === user.user_id) + 1;

            db.run(
              'UPDATE user_rankings SET global_rank = ?, tier_rank = ? WHERE user_id = ?',
              [globalRank, tierRank, user.user_id],
              (err) => {
                if (err) rejectUpdate(err);
                else resolveUpdate();
              }
            );
          });
        });

        Promise.all(updatePromises)
          .then(() => resolve())
          .catch(reject);
      }
    );
  });
};

// Get leaderboard data
const getLeaderboard = async (timeframe = 'all-time', category = 'all', limit = 50) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        u.id as user_id,
        u.username,
        u.prediction_coins,
        u.fantasy_coins,
        ur.tier,
        ur.rank_points,
        ur.global_rank,
        ur.tier_rank,
        ur.win_streak,
        ur.best_streak,
        ur.loss_streak,
        us.total_profit,
        us.win_rate,
        us.total_bets,
        us.winning_bets,
        us.total_volume,
        us.roi
      FROM users u
      JOIN user_rankings ur ON u.id = ur.user_id
      LEFT JOIN user_statistics us ON u.id = us.user_id
    `;

    const params = [];

    // Add timeframe filter
    if (timeframe !== 'all-time') {
      const days = timeframe === 'daily' ? 1 : timeframe === 'weekly' ? 7 : 30;
      query += ` WHERE ur.last_updated >= datetime('now', '-${days} days')`;
    }

    // Add category filter (if we had category-specific stats)
    // For now, we'll use the general leaderboard

    query += ` ORDER BY ur.rank_points DESC LIMIT ?`;
    params.push(limit);

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows.map(row => ({
        ...row,
        tierInfo: TIERS[row.tier] || TIERS['Rookie'],
        // Ensure all expected fields are present
        total_profit: row.total_profit || 0,
        win_rate: row.win_rate || 0,
        total_bets: row.total_bets || 0,
        winning_bets: row.winning_bets || 0,
        total_volume: row.total_volume || 0,
        roi: row.roi || 0,
        win_streak: row.win_streak || 0,
        best_streak: row.best_streak || 0,
        loss_streak: row.loss_streak || 0,
        global_rank: row.global_rank || 999,
        tier_rank: row.tier_rank || 999
      })));
    });
  });
};

// Get user ranking details
const getUserRanking = async (userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 
        ur.*,
        u.username,
        us.total_profit,
        us.win_rate,
        us.total_bets
      FROM user_rankings ur
      JOIN users u ON ur.user_id = u.id
      LEFT JOIN user_statistics us ON ur.user_id = us.user_id
      WHERE ur.user_id = ?`,
      [userId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        resolve({
          ...row,
          tierInfo: TIERS[row.tier] || TIERS['Rookie']
        });
      }
    );
  });
};

// Check and unlock achievements
const checkAchievements = async (userId) => {
  return new Promise((resolve, reject) => {
    // Get user's current stats
    db.get(
      `SELECT 
        ur.*,
        us.total_bets,
        us.winning_bets,
        us.total_profit,
        us.win_rate
      FROM user_rankings ur
      LEFT JOIN user_statistics us ON ur.user_id = us.user_id
      WHERE ur.user_id = ?`,
      [userId],
      (err, userStats) => {
        if (err) {
          reject(err);
          return;
        }

        if (!userStats) {
          resolve([]);
          return;
        }

        // Get all achievements
        db.all('SELECT * FROM achievements', (err, achievements) => {
          if (err) {
            reject(err);
            return;
          }

          // Get user's unlocked achievements
          db.all(
            'SELECT achievement_id FROM user_achievements WHERE user_id = ?',
            [userId],
            (err, unlockedAchievements) => {
              if (err) {
                reject(err);
                return;
              }

              const unlockedIds = new Set(unlockedAchievements.map(a => a.achievement_id));
              const newAchievements = [];

              // Check each achievement
              achievements.forEach(achievement => {
                if (unlockedIds.has(achievement.id)) return; // Already unlocked

                let shouldUnlock = false;

                switch (achievement.requirement_type) {
                  case 'bet_count':
                    shouldUnlock = userStats.total_bets >= achievement.requirement_value;
                    break;
                  case 'win_streak':
                    shouldUnlock = userStats.win_streak >= achievement.requirement_value;
                    break;
                  case 'bet_amount':
                    // This would need to be tracked per bet, simplified for now
                    shouldUnlock = false;
                    break;
                  case 'total_profit':
                    shouldUnlock = userStats.total_profit >= achievement.requirement_value;
                    break;
                  case 'followers':
                    // This would need social features
                    shouldUnlock = false;
                    break;
                  case 'perfect_week':
                    // This would need weekly tracking
                    shouldUnlock = false;
                    break;
                  case 'category_specialist':
                    // This would need category-specific tracking
                    shouldUnlock = false;
                    break;
                  case 'early_user':
                    // Check if user joined in first month
                    shouldUnlock = true; // Simplified for demo
                    break;
                  default:
                    shouldUnlock = false;
                }

                if (shouldUnlock) {
                  newAchievements.push(achievement);
                  
                  // Unlock the achievement
                  db.run(
                    'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                    [userId, achievement.id],
                    (err) => {
                      if (err) console.error('Error unlocking achievement:', err);
                    }
                  );
                }
              });

              resolve(newAchievements);
            }
          );
        });
      }
    );
  });
};

module.exports = {
  TIERS,
  getTierFromPoints,
  calculateBetPoints,
  updateUserRanking,
  updateGlobalRankings,
  getLeaderboard,
  getUserRanking,
  checkAchievements
};
