const express = require('express');
const router = express.Router();
const { getLeaderboard, getUserRanking, checkAchievements } = require('../utils/rankingSystem');
const { db } = require('../db/database');

// Get leaderboard
router.get('/leaderboard/:timeframe/:category', async (req, res) => {
  try {
    const { timeframe, category } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const leaderboard = await getLeaderboard(timeframe, category, limit);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user ranking
router.get('/users/:id/ranking', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const ranking = await getUserRanking(userId);
    
    if (!ranking) {
      return res.status(404).json({ error: 'User ranking not found' });
    }
    
    res.json(ranking);
  } catch (error) {
    console.error('Error fetching user ranking:', error);
    res.status(500).json({ error: 'Failed to fetch user ranking' });
  }
});

// Get user stats
router.get('/users/:id/stats', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const stats = await new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          u.id,
          u.username,
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
        WHERE u.id = ?`,
        [userId],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
    
    if (!stats) {
      return res.status(404).json({ error: 'User stats not found' });
    }
    
    res.json({
      ...stats,
      total_profit: stats.total_profit || 0,
      win_rate: stats.win_rate || 0,
      total_bets: stats.total_bets || 0,
      winning_bets: stats.winning_bets || 0,
      total_volume: stats.total_volume || 0,
      roi: stats.roi || 0,
      win_streak: stats.win_streak || 0,
      best_streak: stats.best_streak || 0,
      loss_streak: stats.loss_streak || 0,
      global_rank: stats.global_rank || 999,
      tier_rank: stats.tier_rank || 999
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get user achievements
router.get('/users/:id/achievements', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const achievements = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          a.*,
          ua.unlocked_at
        FROM achievements a
        JOIN user_achievements ua ON a.id = ua.achievement_id
        WHERE ua.user_id = ?
        ORDER BY ua.unlocked_at DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ error: 'Failed to fetch user achievements' });
  }
});

// Get all achievements
router.get('/achievements', async (req, res) => {
  try {
    const achievements = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM achievements ORDER BY tier, points DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get user stats
router.get('/users/:id/stats', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const stats = await new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          u.id,
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
          us.total_bets,
          us.winning_bets,
          us.total_profit,
          us.total_volume,
          us.win_rate,
          us.last_updated
        FROM users u
        JOIN user_rankings ur ON u.id = ur.user_id
        LEFT JOIN user_statistics us ON u.id = us.user_id
        WHERE u.id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (!stats) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Follow user
router.post('/users/:id/follow', async (req, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const followerId = req.body.followerId || 1; // Default to user 1 for demo
    
    if (followingId === followerId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO user_follows (follower_id, following_id) VALUES (?, ?)',
        [followerId, followingId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ success: true, message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow user
router.delete('/users/:id/follow', async (req, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const followerId = req.body.followerId || 1; // Default to user 1 for demo
    
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?',
        [followerId, followingId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ success: true, message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

// Get followers
router.get('/users/:id/followers', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const followers = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          u.id,
          u.username,
          ur.tier,
          ur.rank_points,
          ur.global_rank,
          uf.created_at as followed_at
        FROM user_follows uf
        JOIN users u ON uf.follower_id = u.id
        JOIN user_rankings ur ON u.id = ur.user_id
        WHERE uf.following_id = ?
        ORDER BY uf.created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(followers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// Get following
router.get('/users/:id/following', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const following = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          u.id,
          u.username,
          ur.tier,
          ur.rank_points,
          ur.global_rank,
          uf.created_at as followed_at
        FROM user_follows uf
        JOIN users u ON uf.following_id = u.id
        JOIN user_rankings ur ON u.id = ur.user_id
        WHERE uf.follower_id = ?
        ORDER BY uf.created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(following);
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

// Get challenges
router.get('/challenges', async (req, res) => {
  try {
    const challenges = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM challenges WHERE status = "active" ORDER BY created_at DESC',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// Join challenge
router.post('/challenges/:id/join', async (req, res) => {
  try {
    const challengeId = parseInt(req.params.id);
    const userId = req.body.userId || 1; // Default to user 1 for demo
    
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO challenge_participants (challenge_id, user_id) VALUES (?, ?)',
        [challengeId, userId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ success: true, message: 'Joined challenge successfully' });
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ error: 'Failed to join challenge' });
  }
});

// Get current season
router.get('/seasons/current', async (req, res) => {
  try {
    const season = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM seasons WHERE status = "active" ORDER BY created_at DESC LIMIT 1',
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    res.json(season);
  } catch (error) {
    console.error('Error fetching current season:', error);
    res.status(500).json({ error: 'Failed to fetch current season' });
  }
});

// Get activity feed
router.get('/feed', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    // Get recent bets from followed users
    const feed = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          'bet' as type,
          u.username,
          u.id as user_id,
          mc.title as contract_title,
          mb.position,
          mb.amount,
          mb.created_at,
          ur.tier
        FROM market_bets mb
        JOIN users u ON mb.user_id = u.id
        JOIN user_rankings ur ON u.id = ur.user_id
        JOIN market_contracts mc ON mb.contract_id = mc.id
        JOIN user_follows uf ON u.id = uf.following_id
        WHERE uf.follower_id = ?
        ORDER BY mb.created_at DESC
        LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(feed);
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    res.status(500).json({ error: 'Failed to fetch activity feed' });
  }
});

// Get user challenges
router.get('/users/:id/challenges', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const challenges = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          c.*,
          cp.current_profit,
          cp.current_rank as rank
        FROM challenges c
        JOIN challenge_participants cp ON c.id = cp.challenge_id
        WHERE cp.user_id = ?
        ORDER BY c.start_date DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ error: 'Failed to fetch user challenges' });
  }
});

// Leave challenge
router.delete('/challenges/:id/leave', async (req, res) => {
  try {
    const challengeId = parseInt(req.params.id);
    const userId = req.body.userId || 1;
    
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM challenge_participants WHERE challenge_id = ? AND user_id = ?',
        [challengeId, userId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ success: true, message: 'Left challenge successfully' });
  } catch (error) {
    console.error('Error leaving challenge:', error);
    res.status(500).json({ error: 'Failed to leave challenge' });
  }
});

// Get tournaments
router.get('/tournaments', async (req, res) => {
  try {
    const tournaments = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM tournaments WHERE status IN ("active", "upcoming") ORDER BY created_at DESC',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// Join tournament
router.post('/tournaments/:id/join', async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.id);
    const userId = req.body.userId || 1;
    
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO tournament_participants (tournament_id, user_id) VALUES (?, ?)',
        [tournamentId, userId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ success: true, message: 'Joined tournament successfully' });
  } catch (error) {
    console.error('Error joining tournament:', error);
    res.status(500).json({ error: 'Failed to join tournament' });
  }
});

// Leave tournament
router.delete('/tournaments/:id/leave', async (req, res) => {
  try {
    const tournamentId = parseInt(req.params.id);
    const userId = req.body.userId || 1;
    
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM tournament_participants WHERE tournament_id = ? AND user_id = ?',
        [tournamentId, userId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    res.json({ success: true, message: 'Left tournament successfully' });
  } catch (error) {
    console.error('Error leaving tournament:', error);
    res.status(500).json({ error: 'Failed to leave tournament' });
  }
});

// Get user tournaments
router.get('/users/:id/tournaments', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const tournaments = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
          t.*,
          tp.current_profit,
          tp.current_rank as rank
        FROM tournaments t
        JOIN tournament_participants tp ON t.id = tp.tournament_id
        WHERE tp.user_id = ?
        ORDER BY t.start_date DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    res.status(500).json({ error: 'Failed to fetch user tournaments' });
  }
});

// Get weekly challenges
router.get('/weekly-challenges', async (req, res) => {
  try {
    const challenges = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM weekly_challenges WHERE status IN ("active", "upcoming") ORDER BY created_at DESC',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching weekly challenges:', error);
    res.status(500).json({ error: 'Failed to fetch weekly challenges' });
  }
});

module.exports = router;
