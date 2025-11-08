import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Trophy, 
  DollarSign,
  BarChart3,
  Zap,
  Award
} from 'lucide-react';
import TierBadge from './TierBadge';
import StreakCounter from './StreakCounter';
import RankProgress from './RankProgress';

const ProfileStats = ({ 
  userStats = {},
  showProgress = true,
  showStreaks = true,
  showAchievements = true,
  className = '' 
}) => {
  const {
    tier = 'Rookie',
    rank_points = 0,
    global_rank = 0,
    tier_rank = 0,
    win_streak = 0,
    best_streak = 0,
    loss_streak = 0,
    total_profit = 0,
    win_rate = 0,
    total_bets = 0,
    total_volume = 0
  } = userStats;

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num) => {
    return `${Math.round(num * 100)}%`;
  };

  const StatCard = ({ icon: Icon, label, value, color = 'text-gray-900', trend = null }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-gray-500" />
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
             trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
            {trend !== 0 && Math.abs(trend)}
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold ${color}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600">
        {label}
      </div>
    </motion.div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Trophy}
          label="Global Rank"
          value={`#${global_rank || 'N/A'}`}
          color="text-blue-600"
        />
        <StatCard
          icon={Target}
          label="Tier Rank"
          value={`#${tier_rank || 'N/A'}`}
          color="text-purple-600"
        />
        <StatCard
          icon={DollarSign}
          label="Total P/L"
          value={formatNumber(total_profit)}
          color={total_profit >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <StatCard
          icon={BarChart3}
          label="Win Rate"
          value={formatPercentage(win_rate)}
          color={win_rate >= 0.6 ? 'text-green-600' : win_rate >= 0.4 ? 'text-yellow-600' : 'text-red-600'}
        />
      </div>

      {/* Tier and Progress */}
      {showProgress && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ranking Progress</h3>
            <TierBadge tier={tier} size="md" />
          </div>
          <RankProgress 
            currentTier={tier}
            currentPoints={rank_points}
            size="md"
          />
        </div>
      )}

      {/* Streaks */}
      {showStreaks && (win_streak > 0 || loss_streak > 0) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Streaks</h3>
          <div className="flex flex-wrap gap-4">
            {win_streak > 0 && (
              <StreakCounter
                currentStreak={win_streak}
                bestStreak={best_streak}
                type="win"
                size="md"
              />
            )}
            {loss_streak > 0 && (
              <StreakCounter
                currentStreak={loss_streak}
                type="loss"
                size="md"
              />
            )}
          </div>
        </div>
      )}

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Target}
          label="Total Bets"
          value={formatNumber(total_bets)}
          color="text-gray-700"
        />
        <StatCard
          icon={DollarSign}
          label="Total Volume"
          value={formatNumber(total_volume)}
          color="text-gray-700"
        />
        <StatCard
          icon={Award}
          label="Rank Points"
          value={formatNumber(rank_points)}
          color="text-purple-600"
        />
      </div>

      {/* Performance Indicators */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-medium">
                {win_rate >= 0.7 ? 'Excellent' : 
                 win_rate >= 0.6 ? 'Good' : 
                 win_rate >= 0.4 ? 'Average' : 'Needs Improvement'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  win_rate >= 0.7 ? 'bg-green-500' : 
                  win_rate >= 0.6 ? 'bg-yellow-500' : 
                  win_rate >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${win_rate * 100}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Profitability</span>
              <span className="font-medium">
                {total_profit >= 1000 ? 'High' : 
                 total_profit >= 100 ? 'Medium' : 
                 total_profit >= 0 ? 'Low' : 'Negative'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  total_profit >= 1000 ? 'bg-green-500' : 
                  total_profit >= 100 ? 'bg-yellow-500' : 
                  total_profit >= 0 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(Math.max(total_profit / 1000, 0), 1) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
