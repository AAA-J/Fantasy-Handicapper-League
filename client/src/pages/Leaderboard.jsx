import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Clock, 
  Filter,
  RefreshCw,
  Medal,
  Crown,
  Star,
  Calendar
} from 'lucide-react';
import { gamificationAPI } from '../services/api';
import LeaderboardCard from '../components/gamification/LeaderboardCard';
import TierBadge from '../components/gamification/TierBadge';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all-time');
  const [category, setCategory] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  const timeframes = [
    { value: 'daily', label: 'Daily', icon: Clock },
    { value: 'weekly', label: 'Weekly', icon: TrendingUp },
    { value: 'monthly', label: 'Monthly', icon: Calendar },
    { value: 'all-time', label: 'All Time', icon: Trophy }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sports', label: 'Sports' },
    { value: 'finance', label: 'Finance' },
    { value: 'politics', label: 'Politics' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'weather', label: 'Weather' },
    { value: 'technology', label: 'Technology' }
  ];

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await gamificationAPI.getLeaderboard(timeframe, category, 50);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Fallback to mock data if API fails
      setLeaderboard([
        {
          user_id: 1,
          username: 'admin',
          tier: 'Amateur',
          rank_points: 150,
          global_rank: 1,
          tier_rank: 1,
          win_streak: 3,
          best_streak: 5,
          loss_streak: 0,
          total_profit: 250.50,
          win_rate: 0.533,
          total_bets: 15,
          winning_bets: 8,
          total_volume: 1500,
          roi: 0.167
        },
        {
          user_id: 2,
          username: 'player1',
          tier: 'Rookie',
          rank_points: 75,
          global_rank: 2,
          tier_rank: 1,
          win_streak: 1,
          best_streak: 2,
          loss_streak: 0,
          total_profit: -75.25,
          win_rate: 0.500,
          total_bets: 12,
          winning_bets: 6,
          total_volume: 800,
          roi: -0.094
        },
        {
          user_id: 3,
          username: 'player2',
          tier: 'Rookie',
          rank_points: 120,
          global_rank: 3,
          tier_rank: 2,
          win_streak: 2,
          best_streak: 3,
          loss_streak: 0,
          total_profit: 120.75,
          win_rate: 0.625,
          total_bets: 8,
          winning_bets: 5,
          total_volume: 600,
          roi: 0.201
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      // For demo, use user ID 1
      const response = await gamificationAPI.getUserStats(1);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error loading current user:', error);
      // Fallback to mock data if API fails
      setCurrentUser({
        id: 1,
        username: 'admin',
        tier: 'Amateur',
        rank_points: 150,
        global_rank: 1,
        tier_rank: 1,
        win_streak: 3,
        best_streak: 5,
        loss_streak: 0,
        total_profit: 250.50,
        win_rate: 0.533,
        total_bets: 15,
        winning_bets: 8,
        total_volume: 1500,
        roi: 0.167
      });
    }
  };

  useEffect(() => {
    loadLeaderboard();
    loadCurrentUser();
  }, [timeframe, category]);

  const getTopThree = () => {
    return leaderboard.slice(0, 3);
  };

  const getCurrentUserRank = () => {
    if (!currentUser) return null;
    return leaderboard.find(user => user.id === currentUser.id);
  };

  const getPodiumIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Handicapper Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compete with the best handicappers and climb the rankings based on your betting performance.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Timeframe Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeframe
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {timeframes.map((tf) => {
                  const Icon = tf.icon;
                  return (
                    <button
                      key={tf.value}
                      onClick={() => setTimeframe(tf.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        timeframe === tf.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tf.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={loadLeaderboard}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Podium */}
        {!loading && getTopThree().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Top Performers
            </h2>
            <div className="flex justify-center items-end gap-4">
              {/* 2nd Place */}
              {getTopThree()[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl p-4 mb-2 w-32 h-24 flex items-center justify-center">
                    {getPodiumIcon(2)}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-700">#{2}</div>
                    <div className="text-sm text-gray-600">{getTopThree()[1].username}</div>
                    <TierBadge tier={getTopThree()[1].tier} size="sm" />
                  </div>
                </motion.div>
              )}

              {/* 1st Place */}
              {getTopThree()[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl p-4 mb-2 w-32 h-32 flex items-center justify-center">
                    {getPodiumIcon(1)}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-700">#{1}</div>
                    <div className="text-sm text-gray-600">{getTopThree()[0].username}</div>
                    <TierBadge tier={getTopThree()[0].tier} size="sm" />
                  </div>
                </motion.div>
              )}

              {/* 3rd Place */}
              {getTopThree()[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-gradient-to-br from-amber-200 to-amber-400 rounded-xl p-4 mb-2 w-32 h-24 flex items-center justify-center">
                    {getPodiumIcon(3)}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-700">#{3}</div>
                    <div className="text-sm text-gray-600">{getTopThree()[2].username}</div>
                    <TierBadge tier={getTopThree()[2].tier} size="sm" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Current User Stats */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  #{currentUser.global_rank || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Global Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {currentUser.rank_points?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {currentUser.total_profit >= 0 ? '+' : ''}{currentUser.total_profit?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">P/L</div>
              </div>
              <div className="text-center">
                <TierBadge tier={currentUser.tier} size="md" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Full Leaderboard
            </h2>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(10)].map((_, i) => (
                <LoadingSkeleton key={i} type="leaderboard" />
              ))}
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {leaderboard.map((user, index) => (
                <LeaderboardCard
                  key={user.id}
                  user={user}
                  rank={index + 1}
                  isCurrentUser={currentUser && user.id === currentUser.id}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No data available
              </h3>
              <p className="text-gray-500">
                No handicappers found for the selected timeframe and category.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
