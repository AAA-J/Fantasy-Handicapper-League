import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Award, 
  Target,
  Clock,
  Users,
  Star,
  Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed = ({ 
  activities = [], 
  currentUserId = null,
  onLoadMore = null,
  hasMore = false,
  loading = false,
  className = ''
}) => {
  const [filter, setFilter] = useState('all');

  const getActivityIcon = (type) => {
    const icons = {
      bet_placed: Target,
      bet_won: Trophy,
      bet_lost: TrendingDown,
      achievement_unlocked: Award,
      rank_up: TrendingUp,
      streak_milestone: Zap,
      followed: Users,
      market_created: Activity
    };
    const IconComponent = icons[type] || Activity;
    return <IconComponent className="w-5 h-5" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      bet_placed: 'text-blue-500',
      bet_won: 'text-green-500',
      bet_lost: 'text-red-500',
      achievement_unlocked: 'text-yellow-500',
      rank_up: 'text-purple-500',
      streak_milestone: 'text-orange-500',
      followed: 'text-indigo-500',
      market_created: 'text-cyan-500'
    };
    return colors[type] || 'text-gray-500';
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'bet_placed':
        return `placed a ${activity.position} bet on "${activity.contract_title}"`;
      case 'bet_won':
        return `won ${activity.profit} coins on "${activity.contract_title}"`;
      case 'bet_lost':
        return `lost ${Math.abs(activity.profit)} coins on "${activity.contract_title}"`;
      case 'achievement_unlocked':
        return `unlocked achievement "${activity.achievement_name}"`;
      case 'rank_up':
        return `ranked up to ${activity.new_tier}!`;
      case 'streak_milestone':
        return `reached ${activity.streak_count} win streak!`;
      case 'followed':
        return `started following ${activity.target_username}`;
      case 'market_created':
        return `created market "${activity.contract_title}"`;
      default:
        return activity.message || 'performed an action';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'bets') return ['bet_placed', 'bet_won', 'bet_lost'].includes(activity.type);
    if (filter === 'achievements') return ['achievement_unlocked', 'rank_up', 'streak_milestone'].includes(activity.type);
    if (filter === 'social') return ['followed', 'market_created'].includes(activity.type);
    return true;
  });

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Activity Feed</h2>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">{activities.length} activities</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'all', label: 'All' },
            { key: 'bets', label: 'Bets' },
            { key: 'achievements', label: 'Achievements' },
            { key: 'social', label: 'Social' }
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filter === filterOption.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No activities found</p>
            <p className="text-sm">Follow some users to see their activity!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`
                      p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}
                    `}>
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {activity.username}
                        </span>
                        {activity.is_verified && (
                          <Star className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="text-sm text-gray-500">
                          {getActivityMessage(activity)}
                        </span>
                      </div>

                      {/* Additional Details */}
                      {activity.details && (
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.details}
                        </p>
                      )}

                      {/* Time */}
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Value/Points */}
                    {activity.value && (
                      <div className={`
                        text-sm font-medium px-2 py-1 rounded-full
                        ${activity.value > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}
                      `}>
                        {activity.value > 0 ? '+' : ''}{activity.value}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
