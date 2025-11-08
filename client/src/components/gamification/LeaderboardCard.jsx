import React from 'react';
import { motion } from 'framer-motion';
import TierBadge from './TierBadge';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const LeaderboardCard = ({ 
  user, 
  rank, 
  isCurrentUser = false,
  showChange = false,
  change = 0,
  className = '' 
}) => {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={`
        flex items-center justify-between p-4 rounded-xl shadow-sm border
        ${isCurrentUser 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' 
          : 'bg-white border-gray-200 hover:border-gray-300'
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className="flex items-center gap-2">
          {getRankIcon(rank)}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
            ${isCurrentUser ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-gray-400 to-gray-600'}
          `}>
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Username and Tier */}
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                {user.username}
              </span>
              {isCurrentUser && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  You
                </span>
              )}
            </div>
            <TierBadge tier={user.tier} size="sm" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6">
        {/* Points */}
        <div className="text-right">
          <div className={`text-lg font-bold ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
            {formatNumber(user.rank_points || 0)}
          </div>
          <div className="text-xs text-gray-500">points</div>
        </div>

        {/* P/L */}
        {user.total_profit !== undefined && (
          <div className="text-right">
            <div className={`text-lg font-bold ${
              (user.total_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {user.total_profit >= 0 ? '+' : ''}{formatNumber(user.total_profit || 0)}
            </div>
            <div className="text-xs text-gray-500">P/L</div>
          </div>
        )}

        {/* Win Rate */}
        {user.win_rate !== undefined && (
          <div className="text-right">
            <div className={`text-lg font-bold ${
              (user.win_rate || 0) >= 0.6 ? 'text-green-600' : 
              (user.win_rate || 0) >= 0.4 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {Math.round((user.win_rate || 0) * 100)}%
            </div>
            <div className="text-xs text-gray-500">win rate</div>
          </div>
        )}

        {/* Streak */}
        {user.win_streak > 0 && (
          <div className="text-right">
            <div className="text-lg font-bold text-orange-600 flex items-center gap-1">
              🔥 {user.win_streak}
            </div>
            <div className="text-xs text-gray-500">streak</div>
          </div>
        )}

        {/* Rank Change */}
        {showChange && change !== 0 && (
          <div className="flex items-center gap-1">
            {getChangeIcon(change)}
            <span className={`text-sm font-medium ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(change)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeaderboardCard;
