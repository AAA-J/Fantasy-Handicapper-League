const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          prediction_coins INTEGER DEFAULT 1000,
          fantasy_coins INTEGER DEFAULT 1000,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Market contracts table
      db.run(`
        CREATE TABLE IF NOT EXISTS market_contracts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL UNIQUE,
          description TEXT,
          status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
          resolution TEXT CHECK (resolution IN ('yes', 'no')),
          initial_probability REAL DEFAULT 0.5,
          current_yes_probability REAL DEFAULT 0.5,
          liquidity_pool INTEGER DEFAULT 1000,
          yes_pool INTEGER DEFAULT 500,
          no_pool INTEGER DEFAULT 500,
          category TEXT DEFAULT 'general',
          creator_id INTEGER,
          closing_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (creator_id) REFERENCES users (id)
        )
      `);

      // Market bets table
      db.run(`
        CREATE TABLE IF NOT EXISTS market_bets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          contract_id INTEGER NOT NULL,
          position TEXT NOT NULL CHECK (position IN ('yes', 'no')),
          amount INTEGER NOT NULL,
          shares REAL NOT NULL DEFAULT 0,
          purchase_price REAL NOT NULL DEFAULT 0,
          potential_payout REAL DEFAULT 0,
          payout_amount REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (contract_id) REFERENCES market_contracts (id)
        )
      `);

      // Prop bets table
      db.run(`
        CREATE TABLE IF NOT EXISTS prop_bets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL UNIQUE,
          description TEXT,
          odds REAL DEFAULT 1.0,
          status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
          result TEXT CHECK (result IN ('win', 'loss')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Fantasy bets table
      db.run(`
        CREATE TABLE IF NOT EXISTS fantasy_bets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          prop_bet_id INTEGER NOT NULL,
          amount INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (prop_bet_id) REFERENCES prop_bets (id)
        )
      `);

      // User statistics table
      db.run(`
        CREATE TABLE IF NOT EXISTS user_statistics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          total_bets INTEGER DEFAULT 0,
          winning_bets INTEGER DEFAULT 0,
          total_profit REAL DEFAULT 0,
          total_volume REAL DEFAULT 0,
          win_rate REAL DEFAULT 0,
          roi REAL DEFAULT 0,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(user_id)
        )
      `, (err) => {
        if (err) {
          console.log('Error creating user_statistics table:', err);
        } else {
          // Add roi column if it doesn't exist
          db.run(`ALTER TABLE user_statistics ADD COLUMN roi REAL DEFAULT 0`, (err) => {
            if (err && !err.message.includes('duplicate column name')) {
              console.log('Error adding roi column:', err);
            }
          });
        }
      });

      // Contract price history table
      db.run(`
        CREATE TABLE IF NOT EXISTS contract_price_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contract_id INTEGER NOT NULL,
          yes_probability REAL NOT NULL,
          yes_pool INTEGER NOT NULL,
          no_pool INTEGER NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contract_id) REFERENCES market_contracts (id)
        )
      `);

      // User rankings and tiers
      db.run(`
        CREATE TABLE IF NOT EXISTS user_rankings (
          user_id INTEGER PRIMARY KEY,
          tier VARCHAR(50) DEFAULT 'Rookie',
          rank_points INTEGER DEFAULT 0,
          global_rank INTEGER,
          tier_rank INTEGER,
          win_streak INTEGER DEFAULT 0,
          best_streak INTEGER DEFAULT 0,
          loss_streak INTEGER DEFAULT 0,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Achievements
      db.run(`
        CREATE TABLE IF NOT EXISTS achievements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          icon VARCHAR(50),
          tier VARCHAR(50),
          points INTEGER DEFAULT 0,
          requirement_type VARCHAR(50),
          requirement_value INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // User achievements
      db.run(`
        CREATE TABLE IF NOT EXISTS user_achievements (
          user_id INTEGER,
          achievement_id INTEGER,
          unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, achievement_id),
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (achievement_id) REFERENCES achievements (id)
        )
      `);

      // Leaderboards (cached)
      db.run(`
        CREATE TABLE IF NOT EXISTS leaderboard_cache (
          timeframe VARCHAR(20),
          category VARCHAR(50),
          user_id INTEGER,
          rank INTEGER,
          value DECIMAL,
          cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (timeframe, category, user_id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Seasons
      db.run(`
        CREATE TABLE IF NOT EXISTS seasons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          start_date DATE,
          end_date DATE,
          status VARCHAR(20) DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Season rankings
      db.run(`
        CREATE TABLE IF NOT EXISTS season_rankings (
          season_id INTEGER,
          user_id INTEGER,
          final_rank INTEGER,
          total_profit DECIMAL DEFAULT 0,
          PRIMARY KEY (season_id, user_id),
          FOREIGN KEY (season_id) REFERENCES seasons (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Social follows
      db.run(`
        CREATE TABLE IF NOT EXISTS user_follows (
          follower_id INTEGER,
          following_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (follower_id, following_id),
          FOREIGN KEY (follower_id) REFERENCES users (id),
          FOREIGN KEY (following_id) REFERENCES users (id)
        )
      `);

      // Challenges
      db.run(`
        CREATE TABLE IF NOT EXISTS challenges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          start_date DATETIME,
          end_date DATETIME,
          prize_pool INTEGER DEFAULT 0,
          entry_fee INTEGER DEFAULT 0,
          status VARCHAR(20) DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Challenge participants
      db.run(`
        CREATE TABLE IF NOT EXISTS challenge_participants (
          challenge_id INTEGER,
          user_id INTEGER,
          current_profit DECIMAL DEFAULT 0,
          current_rank INTEGER,
          joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (challenge_id, user_id),
          FOREIGN KEY (challenge_id) REFERENCES challenges (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          // Tournaments
          db.run(`
            CREATE TABLE IF NOT EXISTS tournaments (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name VARCHAR(100) NOT NULL,
              description TEXT,
              type VARCHAR(50) DEFAULT 'weekly',
              status VARCHAR(20) DEFAULT 'upcoming',
              start_date DATETIME,
              end_date DATETIME,
              prize_pool INTEGER DEFAULT 0,
              entry_fee INTEGER DEFAULT 0,
              category VARCHAR(50),
              prize_distribution TEXT,
              rules TEXT,
              participant_count INTEGER DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `, (err) => {
            if (err) {
              reject(err);
            } else {
              // Tournament participants
              db.run(`
                CREATE TABLE IF NOT EXISTS tournament_participants (
                  tournament_id INTEGER,
                  user_id INTEGER,
                  current_profit DECIMAL DEFAULT 0,
                  current_rank INTEGER,
                  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (tournament_id, user_id),
                  FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
                  FOREIGN KEY (user_id) REFERENCES users (id)
                )
              `, (err) => {
                if (err) {
                  reject(err);
                } else {
                  // Weekly challenges
                  db.run(`
                    CREATE TABLE IF NOT EXISTS weekly_challenges (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      name VARCHAR(100) NOT NULL,
                      description TEXT,
                      type VARCHAR(50) DEFAULT 'volume',
                      status VARCHAR(20) DEFAULT 'upcoming',
                      start_date DATETIME,
                      end_date DATETIME,
                      requirement INTEGER NOT NULL,
                      requirement_text TEXT,
                      reward INTEGER DEFAULT 0,
                      bonus_reward INTEGER DEFAULT 0,
                      bonus_conditions TEXT,
                      achievement_reward VARCHAR(100),
                      category VARCHAR(50),
                      entry_fee INTEGER DEFAULT 0,
                      participant_count INTEGER DEFAULT 0,
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                  `, (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
};

// Seed demo data
const seedDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create demo users
      db.run(`
        INSERT OR IGNORE INTO users (username, prediction_coins, fantasy_coins) 
        VALUES 
          ('admin', 1000, 1000),
          ('player1', 1000, 1000),
          ('player2', 1000, 1000)
      `);

      // Create demo market contracts
      db.run(`
        INSERT OR IGNORE INTO market_contracts (title, description, status, category, creator_id, yes_pool, no_pool, liquidity_pool) 
        VALUES 
          ('Will it rain tomorrow?', 'Simple weather prediction for tomorrow', 'open', 'weather', 1, 500, 500, 1000),
          ('Will the stock market go up?', 'S&P 500 closes higher than today', 'open', 'finance', 1, 500, 500, 1000),
          ('Will the home team win?', 'Local team wins their next game', 'closed', 'sports', 1, 500, 500, 1000)
      `);

      // Create demo prop bets
      db.run(`
        INSERT OR IGNORE INTO prop_bets (title, description, odds, status) 
        VALUES 
          ('Player X scores 20+ points', 'Basketball player scores at least 20 points', 1.5, 'open'),
          ('Team Y wins by 10+ points', 'Football team wins by double digits', 2.0, 'open'),
          ('Over 2.5 goals in match', 'Soccer match has 3 or more goals', 1.8, 'closed')
      `);

      // Create initial user rankings
      db.run(`
        INSERT OR IGNORE INTO user_rankings (user_id, tier, rank_points, global_rank, tier_rank, win_streak, best_streak) 
        VALUES 
          (1, 'Amateur', 150, 1, 1, 3, 5),
          (2, 'Rookie', 75, 2, 1, 1, 2),
          (3, 'Rookie', 120, 3, 2, 2, 3)
      `);

      // Create initial user statistics
      db.run(`
        INSERT OR IGNORE INTO user_statistics (user_id, total_bets, winning_bets, total_profit, total_volume, win_rate, roi) 
        VALUES 
          (1, 15, 8, 250.50, 1500.00, 0.533, 0.167),
          (2, 12, 6, -75.25, 800.00, 0.500, -0.094),
          (3, 8, 5, 120.75, 600.00, 0.625, 0.201)
      `);

      // Create achievements
      db.run(`
        INSERT OR IGNORE INTO achievements (name, description, icon, tier, points, requirement_type, requirement_value) 
        VALUES 
          ('Getting Started', 'Place your first 10 bets', 'trophy', 'bronze', 10, 'bet_count', 10),
          ('Active Trader', 'Place 50 bets', 'trophy', 'silver', 25, 'bet_count', 50),
          ('Market Veteran', 'Place 100 bets', 'trophy', 'gold', 50, 'bet_count', 100),
          ('Hot Hand', 'Win 5 bets in a row', 'fire', 'bronze', 20, 'win_streak', 5),
          ('On Fire', 'Win 10 bets in a row', 'fire', 'silver', 50, 'win_streak', 10),
          ('Unstoppable', 'Win 20 bets in a row', 'fire', 'gold', 100, 'win_streak', 20),
          ('Perfect Week', 'Win all bets in a week', 'star', 'gold', 75, 'perfect_week', 7),
          ('High Roller', 'Place a bet over 500 coins', 'diamond', 'silver', 30, 'bet_amount', 500),
          ('Whale', 'Place a bet over 1000 coins', 'diamond', 'gold', 75, 'bet_amount', 1000),
          ('Profit Machine', 'Earn 1,000 total profit', 'money', 'gold', 100, 'total_profit', 1000),
          ('Sports Specialist', 'Win 100 sports bets with >60% win rate', 'football', 'gold', 75, 'category_specialist', 100),
          ('Finance Guru', 'Win 100 finance bets with >60% win rate', 'chart', 'gold', 75, 'category_specialist', 100),
          ('Political Prophet', 'Win 100 politics bets with >60% win rate', 'users', 'gold', 75, 'category_specialist', 100),
          ('Influencer', 'Have 10 followers', 'users', 'silver', 25, 'followers', 10),
          ('Celebrity', 'Have 50 followers', 'users', 'gold', 50, 'followers', 50),
          ('Icon', 'Have 100 followers', 'users', 'platinum', 100, 'followers', 100),
          ('Trendsetter', 'Create a market that gets 100+ bets', 'trending', 'gold', 50, 'market_popularity', 100),
          ('Early Adopter', 'Join in first month', 'clock', 'bronze', 15, 'early_user', 1),
          ('Underdog Champion', 'Win 10 bets with odds >3.0', 'target', 'gold', 60, 'underdog_wins', 10),
          ('Contrarian', 'Win bet where you were in minority (<20%)', 'zap', 'silver', 40, 'contrarian_win', 1),
          ('Market Maker', 'Create 10 markets', 'plus', 'silver', 30, 'markets_created', 10),
          ('Diamond Hands', 'Hold winning position without selling', 'gem', 'gold', 50, 'diamond_hands', 1)
      `);

      // Create current season
      db.run(`
        INSERT OR IGNORE INTO seasons (name, start_date, end_date, status) 
        VALUES 
          ('Season 1', '2024-01-01', '2024-03-31', 'active')
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          // Create demo tournaments
          db.run(`
            INSERT OR IGNORE INTO tournaments (name, description, type, status, start_date, end_date, prize_pool, entry_fee, category, prize_distribution, rules, participant_count) 
            VALUES 
              ('Weekly Sports Championship', 'Compete for the best sports betting performance this week', 'weekly', 'active', '2024-01-15 00:00:00', '2024-01-22 23:59:59', 5000, 100, 'sports', '[50, 25, 15, 10]', '["Place at least 5 sports bets", "Best P/L wins", "Ties broken by win rate"]', 25),
              ('Monthly Finance Master', 'Show your financial prediction skills', 'monthly', 'upcoming', '2024-02-01 00:00:00', '2024-02-29 23:59:59', 15000, 250, 'finance', '[40, 25, 15, 10, 5, 5]', '["Place at least 20 finance bets", "Minimum 60% win rate", "Best ROI wins"]', 0),
              ('Championship Tournament', 'The ultimate handicapper competition', 'championship', 'upcoming', '2024-03-01 00:00:00', '2024-03-31 23:59:59', 50000, 500, 'all', '[50, 20, 15, 10, 5]', '["Top 100 handicappers only", "All categories count", "Best overall performance wins"]', 0)
          `, (err) => {
            if (err) {
              reject(err);
            } else {
              // Create demo weekly challenges
              db.run(`
                INSERT OR IGNORE INTO weekly_challenges (name, description, type, status, start_date, end_date, requirement, requirement_text, reward, bonus_reward, bonus_conditions, achievement_reward, category, entry_fee, participant_count) 
                VALUES 
                  ('Volume Trader', 'Place the most bets this week', 'volume', 'active', '2024-01-15 00:00:00', '2024-01-22 23:59:59', 20, 'Place at least 20 bets this week', 500, 200, 'Place 30+ bets for bonus', 'Volume King', 'all', 0, 15),
                  ('Profit Hunter', 'Earn the most profit this week', 'profit', 'active', '2024-01-15 00:00:00', '2024-01-22 23:59:59', 1000, 'Earn at least 1000 coins profit this week', 1000, 500, 'Earn 2000+ coins for bonus', 'Profit Master', 'all', 0, 12),
                  ('Streak Master', 'Build the longest win streak', 'streak', 'active', '2024-01-15 00:00:00', '2024-01-22 23:59:59', 5, 'Build a win streak of at least 5', 300, 150, 'Build 10+ streak for bonus', 'Streak Legend', 'all', 0, 8),
                  ('Sports Specialist', 'Master sports betting this week', 'category', 'active', '2024-01-15 00:00:00', '2024-01-22 23:59:59', 10, 'Place at least 10 sports bets with 70%+ win rate', 400, 200, 'Achieve 80%+ win rate for bonus', 'Sports Expert', 'sports', 0, 6)
              `, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }
          });
        }
      });
    });
  });
};

module.exports = { db, initDatabase, seedDatabase };
