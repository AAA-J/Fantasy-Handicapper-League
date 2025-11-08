import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';

const AchievementProgress = ({ 
  achievements = [], 
  userAchievements = [],
  showProgress = true,
  className = ''
}) => {
  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  // Group achievements by tier
  const achievementsByTier = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.tier]) {
      acc[achievement.tier] = { total: 0, unlocked: 0, achievements: [] };
    }
    acc[achievement.tier].total++;
    acc[achievement.tier].achievements.push(achievement);
    
    if (userAchievements.some(ua => ua.achievement_id === achievement.id)) {
      acc[achievement.tier].unlocked++;
    }
    
    return acc;
  }, {});

  const tierOrder = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  const tierColors = {
    bronze: 'from-amber-600 to-amber-800',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-500 to-yellow-700',
    platinum: 'from-teal-500 to-teal-700',
    diamond: 'from-cyan-400 to-cyan-600'
  };

  const tierIcons = {
    bronze: Trophy,
    silver: Target,
    gold: Award,
    platinum: TrendingUp,
    diamond: Award
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Achievement Progress</h3>
          <p className="text-sm text-gray-600">Track your accomplishments</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {unlockedCount}/{totalCount}
          </div>
          <div className="text-sm text-gray-500">Unlocked</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Tier Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">By Tier</h4>
        {tierOrder.map(tier => {
          const tierData = achievementsByTier[tier];
          if (!tierData || tierData.total === 0) return null;
          
          const tierProgress = (tierData.unlocked / tierData.total) * 100;
          const TierIcon = tierIcons[tier];
          const tierColor = tierColors[tier];
          
          return (
            <motion.div
              key={tier}
              className="bg-gray-50 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tierOrder.indexOf(tier) * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${tierColor} text-white`}>
                    <TierIcon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-900 capitalize">{tier}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {tierData.unlocked}/{tierData.total}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`bg-gradient-to-r ${tierColor} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${tierProgress}%` }}
                  transition={{ duration: 0.8, delay: tierOrder.indexOf(tier) * 0.1 + 0.3 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Achievements */}
      {userAchievements.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Unlocks</h4>
          <div className="space-y-2">
            {userAchievements.slice(-3).map((userAchievement, index) => {
              const achievement = achievements.find(a => a.id === userAchievement.achievement_id);
              if (!achievement) return null;
              
              return (
                <motion.div
                  key={userAchievement.id}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{achievement.name}</div>
                    <div className="text-sm text-gray-600">+{achievement.points} points</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(userAchievement.unlocked_at).toLocaleDateString()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievement Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{unlockedCount}</div>
          <div className="text-sm text-gray-600">Achievements</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {userAchievements.reduce((sum, ua) => {
              const achievement = achievements.find(a => a.id === ua.achievement_id);
              return sum + (achievement?.points || 0);
            }, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Points</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementProgress;
