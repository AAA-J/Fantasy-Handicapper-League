import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, TrendingUp, Trophy, Star, Plus, Minus } from 'lucide-react';
import TierBadge from '../gamification/TierBadge';
import StreakCounter from '../gamification/StreakCounter';

const UserCard = ({ 
  user, 
  currentUserId = null,
  isFollowing = false,
  onFollow = null,
  onUnfollow = null,
  showStats = true,
  size = 'md',
  className = ''
}) => {
  const isCurrentUser = currentUserId && user.id === currentUserId;
  const canFollow = !isCurrentUser && currentUserId;

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const avatarSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      onUnfollow?.(user.id);
    } else {
      onFollow?.(user.id);
    }
  };

  return (
    <motion.div
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md
        transition-all duration-300 ${sizeClasses[size]} ${className}
      `}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        {/* User Info */}
        <div className="flex items-start space-x-3 flex-1">
          {/* Avatar */}
          <div className={`
            ${avatarSizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600
            flex items-center justify-center text-white font-bold
          `}>
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.username}
              </h3>
              {user.is_verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            {/* Tier and Streak */}
            <div className="flex items-center gap-2 mb-2">
              {user.tier && (
                <TierBadge tier={user.tier} size="sm" />
              )}
              {user.win_streak !== undefined && (
                <StreakCounter 
                  winStreak={user.win_streak} 
                  bestStreak={user.best_streak}
                  size="sm"
                />
              )}
            </div>

            {/* Stats */}
            {showStats && (
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  <span>#{user.global_rank || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className={user.total_profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {user.total_profit >= 0 ? '+' : ''}{user.total_profit?.toFixed(0) || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{user.followers_count || 0} followers</span>
                </div>
                <div className="text-gray-500">
                  {user.win_rate ? `${(user.win_rate * 100).toFixed(1)}% win rate` : 'New user'}
                </div>
              </div>
            )}

            {/* Bio */}
            {user.bio && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Follow Button */}
        {canFollow && (
          <motion.button
            onClick={handleFollowToggle}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              flex items-center gap-2
              ${isFollowing 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFollowing ? (
              <>
                <Minus className="w-4 h-4" />
                Unfollow
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Follow
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Recent Activity Preview */}
      {user.recent_activity && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Recent Activity</p>
          <p className="text-sm text-gray-700 line-clamp-1">
            {user.recent_activity}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;
