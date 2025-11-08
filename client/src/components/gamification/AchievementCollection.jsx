import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Users, 
  TrendingUp, 
  Award, 
  Star,
  Zap,
  Crown,
  Medal,
  Gem
} from 'lucide-react';
import AchievementCard from './AchievementCard';

const ACHIEVEMENT_ICONS = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  users: Users,
  trending: TrendingUp,
  award: Award,
  crown: Crown,
  medal: Medal,
  gem: Gem
};

const COLLECTION_CATEGORIES = {
  performance: {
    name: 'Performance',
    icon: Trophy,
    color: 'from-red-500 to-pink-600',
    description: 'Betting accuracy and win streaks'
  },
  volume: {
    name: 'Volume',
    icon: Target,
    color: 'from-blue-500 to-cyan-600',
    description: 'Activity and participation'
  },
  category: {
    name: 'Category',
    icon: Award,
    color: 'from-green-500 to-emerald-600',
    description: 'Specialization by betting category'
  },
  social: {
    name: 'Social',
    icon: Users,
    color: 'from-purple-500 to-violet-600',
    description: 'Community and following'
  },
  special: {
    name: 'Special',
    icon: Crown,
    color: 'from-yellow-500 to-orange-600',
    description: 'Unique and rare achievements'
  }
};

const AchievementCollection = ({ 
  achievements = [], 
  userAchievements = [],
  className = '' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');

  // Group achievements by category
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    const category = achievement.requirement_type || 'special';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {});

  // Filter achievements based on selected filters
  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || 
      (achievement.requirement_type || 'special') === selectedCategory;
    const tierMatch = selectedTier === 'all' || achievement.tier === selectedTier;
    return categoryMatch && tierMatch;
  });

  // Get user's unlocked achievement IDs
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievement_id));

  // Calculate completion stats
  const getCategoryStats = (category) => {
    const categoryAchievements = achievementsByCategory[category] || [];
    const unlocked = categoryAchievements.filter(a => unlockedIds.has(a.id)).length;
    return {
      total: categoryAchievements.length,
      unlocked,
      percentage: categoryAchievements.length > 0 ? (unlocked / categoryAchievements.length) * 100 : 0
    };
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievement Collection</h2>
        <p className="text-gray-600">Unlock achievements to earn points and showcase your skills</p>
      </div>

      {/* Category Tabs */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {Object.entries(COLLECTION_CATEGORIES).map(([key, category]) => {
            const stats = getCategoryStats(key);
            const IconComponent = category.icon;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === key
                    ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
                <span className="text-xs opacity-75">({stats.unlocked}/{stats.total})</span>
              </button>
            );
          })}
        </div>

        {/* Tier Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedTier === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Tiers
          </button>
          {['bronze', 'silver', 'gold', 'platinum', 'diamond'].map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                selectedTier === tier
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="p-6">
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more achievements.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAchievements.map((achievement, index) => {
              const isUnlocked = unlockedIds.has(achievement.id);
              const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AchievementCard
                    achievement={achievement}
                    isUnlocked={isUnlocked}
                    isNew={userAchievement && 
                      new Date(userAchievement.unlocked_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                    size="md"
                    showDescription={true}
                    animated={true}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Collection Stats */}
      <div className="p-6 bg-gray-50 rounded-b-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {userAchievements.length}
            </div>
            <div className="text-sm text-gray-600">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {achievements.length - userAchievements.length}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((userAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {userAchievements.reduce((sum, ua) => {
                const achievement = achievements.find(a => a.id === ua.achievement_id);
                return sum + (achievement?.points || 0);
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCollection;
