import React from 'react';
import { motion } from 'framer-motion';
import TierBadge from './TierBadge';

const TIER_THRESHOLDS = {
  'Rookie': { min: 0, max: 100 },
  'Amateur': { min: 101, max: 500 },
  'Semi-Pro': { min: 501, max: 1500 },
  'Professional': { min: 1501, max: 5000 },
  'Expert': { min: 5001, max: 15000 },
  'Master': { min: 15001, max: 50000 },
  'Legend': { min: 50001, max: Infinity }
};

const RankProgress = ({ 
  currentTier = 'Rookie',
  currentPoints = 0,
  showNextTier = true,
  size = 'md',
  animated = true,
  className = '' 
}) => {
  const currentThreshold = TIER_THRESHOLDS[currentTier];
  const tiers = Object.keys(TIER_THRESHOLDS);
  const currentTierIndex = tiers.indexOf(currentTier);
  const nextTier = tiers[currentTierIndex + 1];
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : null;

  const progressInCurrentTier = currentThreshold.max === Infinity 
    ? 100 
    : ((currentPoints - currentThreshold.min) / (currentThreshold.max - currentThreshold.min)) * 100;

  const pointsToNextTier = nextThreshold 
    ? nextThreshold.min - currentPoints 
    : 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const barSizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const ProgressContent = () => (
    <div className={`space-y-3 ${className}`}>
      {/* Current Tier */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TierBadge tier={currentTier} size="sm" />
          <span className={`font-medium text-gray-700 ${sizeClasses[size]}`}>
            {currentPoints.toLocaleString()} points
          </span>
        </div>
        
        {nextTier && (
          <span className={`text-gray-500 ${sizeClasses[size]}`}>
            {pointsToNextTier.toLocaleString()} to next tier
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${barSizes[size]}`}>
          <motion.div
            className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressInCurrentTier, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        {/* Tier Labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{currentThreshold.min.toLocaleString()}</span>
          {currentThreshold.max !== Infinity && (
            <span>{currentThreshold.max.toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Next Tier Preview */}
      {showNextTier && nextTier && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Next:</span>
            <TierBadge tier={nextTier} size="sm" />
          </div>
          <span className="text-sm text-gray-600">
            {pointsToNextTier.toLocaleString()} points needed
          </span>
        </motion.div>
      )}

      {/* Legend Status */}
      {currentTier === 'Legend' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg border border-orange-200"
        >
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-orange-800">Legend Status!</span>
          <span className="text-2xl">🔥</span>
        </motion.div>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProgressContent />
      </motion.div>
    );
  }

  return <ProgressContent />;
};

export default RankProgress;
