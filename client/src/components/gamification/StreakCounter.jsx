import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';

const StreakCounter = ({ 
  currentStreak = 0, 
  bestStreak = 0, 
  type = 'win', // 'win' or 'loss'
  size = 'md',
  showBest = true,
  animated = true,
  className = '' 
}) => {
  const isWinStreak = type === 'win';
  const isLossStreak = type === 'loss';
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const getStreakColor = () => {
    if (isWinStreak) {
      if (currentStreak >= 10) return 'text-orange-600';
      if (currentStreak >= 5) return 'text-orange-500';
      return 'text-yellow-500';
    }
    if (isLossStreak) {
      if (currentStreak >= 5) return 'text-red-600';
      if (currentStreak >= 3) return 'text-red-500';
      return 'text-gray-500';
    }
    return 'text-gray-500';
  };

  const getStreakBgColor = () => {
    if (isWinStreak) {
      if (currentStreak >= 10) return 'bg-orange-100';
      if (currentStreak >= 5) return 'bg-orange-50';
      return 'bg-yellow-50';
    }
    if (isLossStreak) {
      if (currentStreak >= 5) return 'bg-red-100';
      if (currentStreak >= 3) return 'bg-red-50';
      return 'bg-gray-50';
    }
    return 'bg-gray-50';
  };

  const getStreakIcon = () => {
    if (isWinStreak) {
      return <Flame className={`${iconSizes[size]} text-orange-500`} />;
    }
    if (isLossStreak) {
      return <TrendingDown className={`${iconSizes[size]} text-red-500`} />;
    }
    return <TrendingUp className={`${iconSizes[size]} text-gray-500`} />;
  };

  const getStreakText = () => {
    if (isWinStreak) {
      if (currentStreak === 0) return 'No streak';
      if (currentStreak === 1) return '1 win';
      return `${currentStreak} wins`;
    }
    if (isLossStreak) {
      if (currentStreak === 0) return 'No losses';
      if (currentStreak === 1) return '1 loss';
      return `${currentStreak} losses`;
    }
    return `${currentStreak}`;
  };

  const StreakContent = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${getStreakBgColor()}`}>
        {getStreakIcon()}
        <div>
          <div className={`font-bold ${getStreakColor()} ${sizeClasses[size]}`}>
            {getStreakText()}
          </div>
          {showBest && bestStreak > currentStreak && (
            <div className="text-xs text-gray-500">
              Best: {bestStreak}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (animated && currentStreak > 0) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <StreakContent />
      </motion.div>
    );
  }

  return <StreakContent />;
};

export default StreakCounter;
