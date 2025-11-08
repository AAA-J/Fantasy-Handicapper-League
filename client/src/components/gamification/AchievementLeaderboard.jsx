import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Star, Users, TrendingUp } from 'lucide-react';

const AchievementLeaderboard = ({ 
  users = [], 
  achievements = [],
  userAchievements = [],
  className = '' 
}) => {
  const [timeframe, setTimeframe] = useState('all-time');
  const [category, setCategory] = useState('all');

  // Calculate achievement points for each user
  const userStats = users.map(user => {
    const userAchs = userAchievements.filter(ua => ua.user_id === user.id);
    const totalPoints = userAchs.reduce((sum, ua) => {
      const achievement = achievements.find(a => a.id === ua.achievement_id);
      return sum + (achievement?.points || 0);
    }, 0);
    
    const achievementCount = userAchs.length;
    const recentAchievements = userAchs.filter(ua => 
      new Date(ua.unlocked_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      ...user,
      achievementCount,
      totalPoints,
      recentAchievements,
      rank: 0 // Will be calculated after sorting
    };
  });

  // Sort by total points (descending)
  userStats.sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Assign ranks
  userStats.forEach((user, index) => {
    user.rank = index + 1;
  });

  // Filter by timeframe and category
  const filteredUsers = userStats.filter(user => {
    // Add filtering logic here if needed
    return true;
  });

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <Trophy className="w-5 h-5 text-gray-400" />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-amber-500 to-amber-700';
    return 'from-gray-100 to-gray-300';
  };

  const getRankTextColor = (rank) => {
    if (rank <= 3) return 'text-white';
    return 'text-gray-700';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievement Leaders</h2>
            <p className="text-gray-600">Top performers by achievement points</p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Leaderboard</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all-time">All Time</option>
              <option value="monthly">This Month</option>
              <option value="weekly">This Week</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="performance">Performance</option>
              <option value="volume">Volume</option>
              <option value="social">Social</option>
              <option value="special">Special</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="p-6">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
            <p className="text-gray-500">Check back later for leaderboard updates.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Podium for top 3 */}
            {filteredUsers.slice(0, 3).length > 0 && (
              <div className="flex justify-center items-end gap-4 mb-8">
                {filteredUsers.slice(0, 3).map((user, index) => {
                  const isFirst = index === 0;
                  const isSecond = index === 1;
                  const isThird = index === 2;
                  
                  return (
                    <motion.div
                      key={user.id}
                      className={`text-center ${isFirst ? 'order-2' : isSecond ? 'order-1' : 'order-3'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`
                        w-20 h-20 rounded-full flex items-center justify-center mb-2
                        bg-gradient-to-br ${getRankColor(user.rank)}
                        ${isFirst ? 'w-24 h-24' : isSecond ? 'w-22 h-22' : 'w-20 h-20'}
                      `}>
                        {getRankIcon(user.rank)}
                      </div>
                      <div className={`font-bold ${getRankTextColor(user.rank)}`}>
                        #{user.rank}
                      </div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-20">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-600">
                        {user.totalPoints} pts
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Full leaderboard */}
            <div className="space-y-2">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border-2 transition-all
                    ${user.rank <= 3 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      bg-gradient-to-br ${getRankColor(user.rank)}
                    `}>
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-600">
                        {user.achievementCount} achievements
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {user.totalPoints}
                    </div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="p-6 bg-gray-50 rounded-b-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredUsers.length}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredUsers.reduce((sum, user) => sum + user.achievementCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredUsers.reduce((sum, user) => sum + user.totalPoints, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {filteredUsers.reduce((sum, user) => sum + user.recentAchievements, 0)}
            </div>
            <div className="text-sm text-gray-600">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementLeaderboard;
