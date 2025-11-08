import React from 'react';
import { motion } from 'framer-motion';

const TIER_CONFIG = {
  'Rookie': { 
    color: 'from-amber-600 to-amber-800', 
    textColor: 'text-amber-100',
    icon: '🥉',
    name: 'Rookie',
    description: 'Just getting started'
  },
  'Amateur': { 
    color: 'from-gray-400 to-gray-600', 
    textColor: 'text-gray-100',
    icon: '🥈',
    name: 'Amateur',
    description: 'Learning the ropes'
  },
  'Semi-Pro': { 
    color: 'from-yellow-500 to-yellow-700', 
    textColor: 'text-yellow-100',
    icon: '🥇',
    name: 'Semi-Pro',
    description: 'Getting serious'
  },
  'Professional': { 
    color: 'from-teal-500 to-teal-700', 
    textColor: 'text-teal-100',
    icon: '💎',
    name: 'Professional',
    description: 'Making moves'
  },
  'Expert': { 
    color: 'from-cyan-400 to-cyan-600', 
    textColor: 'text-cyan-100',
    icon: '💠',
    name: 'Expert',
    description: 'Elite level'
  },
  'Master': { 
    color: 'from-purple-600 to-purple-800', 
    textColor: 'text-purple-100',
    icon: '👑',
    name: 'Master',
    description: 'Top tier'
  },
  'Legend': { 
    color: 'from-orange-500 to-red-600', 
    textColor: 'text-orange-100',
    icon: '🔥',
    name: 'Legend',
    description: 'Hall of fame'
  }
};

const TierBadge = ({ 
  tier = 'Rookie', 
  size = 'md', 
  showDescription = false, 
  animated = true,
  className = '' 
}) => {
  const config = TIER_CONFIG[tier] || TIER_CONFIG['Rookie'];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const BadgeContent = () => (
    <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${config.color} ${config.textColor} ${sizeClasses[size]} font-semibold shadow-lg ${className}`}>
      <span className={iconSizes[size]}>{config.icon}</span>
      <span>{config.name}</span>
      {showDescription && (
        <span className="text-xs opacity-90 hidden sm:inline">
          {config.description}
        </span>
      )}
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
        <BadgeContent />
      </motion.div>
    );
  }

  return <BadgeContent />;
};

export default TierBadge;
