import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Users, 
  TrendingUp, 
  Diamond, 
  Crown,
  Zap,
  Award,
  Medal,
  Gem
} from 'lucide-react';

const ACHIEVEMENT_ICONS = {
  trophy: Trophy,
  star: Star,
  fire: Flame,
  target: Target,
  users: Users,
  trending: TrendingUp,
  diamond: Diamond,
  crown: Crown,
  zap: Zap,
  award: Award,
  medal: Medal,
  gem: Gem,
  money: Diamond,
  chart: TrendingUp,
  football: Target,
  clock: Star,
  plus: Target
};

const TIER_COLORS = {
  bronze: {
    bg: 'from-amber-600 to-amber-800',
    text: 'text-amber-100',
    border: 'border-amber-300',
    icon: 'text-amber-200'
  },
  silver: {
    bg: 'from-gray-400 to-gray-600',
    text: 'text-gray-100',
    border: 'border-gray-300',
    icon: 'text-gray-200'
  },
  gold: {
    bg: 'from-yellow-500 to-yellow-700',
    text: 'text-yellow-100',
    border: 'border-yellow-300',
    icon: 'text-yellow-200'
  },
  platinum: {
    bg: 'from-teal-500 to-teal-700',
    text: 'text-teal-100',
    border: 'border-teal-300',
    icon: 'text-teal-200'
  },
  diamond: {
    bg: 'from-cyan-400 to-cyan-600',
    text: 'text-cyan-100',
    border: 'border-cyan-300',
    icon: 'text-cyan-200'
  }
};

const AchievementCard = ({ 
  achievement, 
  isUnlocked = false,
  isNew = false,
  size = 'md',
  showDescription = true,
  animated = true,
  className = '',
  progress = 0,
  showProgress = false,
  onUnlock = null
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const IconComponent = ACHIEVEMENT_ICONS[achievement.icon] || Trophy;
  const tierConfig = TIER_COLORS[achievement.tier] || TIER_COLORS.bronze;

  useEffect(() => {
    if (isUnlocked && onUnlock) {
      setIsAnimating(true);
      setShowCelebration(true);
      
      // Trigger unlock animation
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      
      // Hide celebration after 3 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
  }, [isUnlocked, onUnlock]);

  const progressPercentage = Math.min((progress / achievement.requirement_value) * 100, 100);
  
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const AchievementContent = () => (
    <div className="relative">
      <motion.div
        className={`
          relative rounded-xl border-2 transition-all duration-300
          ${isUnlocked 
            ? `bg-gradient-to-br ${tierConfig.bg} ${tierConfig.text} ${tierConfig.border} shadow-lg` 
            : 'bg-gray-100 border-gray-300 text-gray-500'
          }
          ${sizeClasses[size]}
          ${className}
          ${isAnimating ? 'scale-110 rotate-3' : ''}
        `}
        animate={isAnimating ? {
          scale: [1, 1.1, 1],
          rotate: [0, 3, 0],
          boxShadow: [
            '0 0 0 rgba(0,0,0,0)',
            '0 0 20px rgba(255,215,0,0.5)',
            '0 0 0 rgba(0,0,0,0)'
          ]
        } : {}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* New Badge */}
        {isNew && (
          <motion.div 
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            NEW!
          </motion.div>
        )}

        {/* Achievement Icon */}
        <div className="flex items-center justify-center mb-3">
          <motion.div 
            className={`
              p-3 rounded-full
              ${isUnlocked ? tierConfig.icon : 'text-gray-400'}
            `}
            animate={isAnimating ? {
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0]
            } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <IconComponent className={`${iconSizes[size]} ${isUnlocked ? '' : 'opacity-50'}`} />
          </motion.div>
        </div>

        {/* Achievement Info */}
        <div className="text-center">
          <h3 className={`font-bold ${textSizes[size]} mb-1`}>
            {achievement.name}
          </h3>
          
          {showDescription && (
            <p className={`text-xs opacity-90 mb-2`}>
              {achievement.description}
            </p>
          )}

          {/* Points */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs font-medium">
              {achievement.points} pts
            </span>
            <div className={`w-1 h-1 rounded-full ${isUnlocked ? 'bg-current' : 'bg-gray-400'}`} />
            <span className="text-xs capitalize">
              {achievement.tier}
            </span>
          </div>

          {/* Progress Bar */}
          {showProgress && !isUnlocked && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                {progress} / {achievement.requirement_value}
              </div>
            </div>
          )}

          {/* Unlock Status */}
          {!isUnlocked && !showProgress && (
            <div className="mt-2 text-xs opacity-75">
              Locked
            </div>
          )}

          {/* Unlocked Badge */}
          {isUnlocked && (
            <motion.div
              className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              ✓
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti Effect */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + (i * 5)}%`,
                  top: '50%'
                }}
                animate={{
                  y: [-20, -100],
                  x: [0, (Math.random() - 0.5) * 100],
                  opacity: [1, 0],
                  scale: [1, 0.5]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Sparkle Effect */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${30 + (i * 8)}%`,
                  top: '30%'
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <AchievementContent />
      </motion.div>
    );
  }

  return <AchievementContent />;
};

export default AchievementCard;
