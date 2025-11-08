import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  TrendingDown,
  Star,
  Crown,
  Zap
} from 'lucide-react';
import TierBadge from '../gamification/TierBadge';

const LeaderboardTable = ({ 
  leaderboard = [], 
  currentUserId = null,
  timeframe = 'all-time',
  category = 'all',
  showTier = true,
  showStreak = true,
  className = ''
}) => {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    if (rank <= 10) return <Trophy className="w-4 h-4 text-blue-500" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
    if (rank <= 10) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatValue = (value, type) => {
    if (type === 'profit') {
      return value >= 0 ? `+${value.toFixed(0)}` : value.toFixed(0);
    }
    if (type === 'percentage') {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (type === 'count') {
      return value.toLocaleString();
    }
    return value;
  };

  const getValueColor = (value, type) => {
    if (type === 'profit') {
      return value >= 0 ? 'text-green-600' : 'text-red-600';
    }
    if (type === 'percentage') {
      return value >= 0.5 ? 'text-green-600' : value >= 0.3 ? 'text-yellow-600' : 'text-red-600';
    }
    return 'text-gray-900';
  };

  const getTimeframeLabel = (timeframe) => {
    const labels = {
      'all-time': 'All Time',
      'monthly': 'This Month',
      'weekly': 'This Week',
      'daily': 'Today'
    };
    return labels[timeframe] || timeframe;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'all': 'All Categories',
      'sports': 'Sports',
      'finance': 'Finance',
      'politics': 'Politics',
      'entertainment': 'Entertainment',
      'crypto': 'Crypto',
      'other': 'Other'
    };
    return labels[category] || category;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
            <p className="text-blue-100">
              {getTimeframeLabel(timeframe)} • {getCategoryLabel(category)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{leaderboard.length}</div>
            <div className="text-sm text-blue-100">Handicappers</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Handicapper
              </th>
              {showTier && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                P/L
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Win Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bets
              </th>
              {showStreak && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Streak
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = currentUserId && user.user_id === currentUserId;
              
              return (
                <motion.tr
                  key={user.user_id}
                  className={`
                    hover:bg-gray-50 transition-colors
                    ${isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Rank */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${getRankColor(rank)}
                      `}>
                        {getRankIcon(rank)}
                      </div>
                    </div>
                  </td>

                  {/* Handicapper */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username || 'Unknown User'}
                          </div>
                          {user.is_verified && (
                            <Star className="w-4 h-4 text-blue-500" />
                          )}
                          {isCurrentUser && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.global_rank ? `#${user.global_rank} globally` : 'New user'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tier */}
                  {showTier && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TierBadge tier={user.tier} size="sm" />
                    </td>
                  )}

                  {/* P/L */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getValueColor(user.total_profit, 'profit')}`}>
                      {formatValue(user.total_profit, 'profit')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.roi ? `${formatValue(user.roi, 'percentage')} ROI` : 'N/A'}
                    </div>
                  </td>

                  {/* Win Rate */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getValueColor(user.win_rate, 'percentage')}`}>
                      {formatValue(user.win_rate, 'percentage')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.winning_bets || 0} wins
                    </div>
                  </td>

                  {/* Bets */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatValue(user.total_bets, 'count')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.total_volume ? `${formatValue(user.total_volume, 'count')} volume` : 'N/A'}
                    </div>
                  </td>

                  {/* Streak */}
                  {showStreak && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {user.win_streak > 0 ? (
                          <Zap className="w-4 h-4 text-orange-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          user.win_streak > 0 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {user.win_streak > 0 ? user.win_streak : Math.abs(user.loss_streak || 0)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.win_streak > 0 ? 'win streak' : 'loss streak'}
                      </div>
                    </td>
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {leaderboard.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
          <p className="text-gray-500">Check back later for leaderboard updates</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
