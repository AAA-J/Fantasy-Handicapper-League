import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, Users, TrendingUp, Award, Crown, X } from 'lucide-react';

const ACHIEVEMENT_ICONS = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  users: Users,
  trending: TrendingUp,
  award: Award,
  crown: Crown
};

const TIER_COLORS = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-500 to-yellow-700',
  platinum: 'from-teal-500 to-teal-700',
  diamond: 'from-cyan-400 to-cyan-600'
};

const AchievementNotification = ({ 
  achievement, 
  isVisible = false, 
  onClose = null,
  autoClose = true,
  duration = 5000 
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  const IconComponent = ACHIEVEMENT_ICONS[achievement.icon] || Trophy;
  const tierColor = TIER_COLORS[achievement.tier] || TIER_COLORS.bronze;

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-sm"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className={`
              relative bg-gradient-to-r ${tierColor} text-white rounded-xl p-4 shadow-2xl
              border-2 border-white/20 backdrop-blur-sm
            `}
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Achievement Content */}
            <div className="flex items-center gap-3">
              {/* Icon with Animation */}
              <motion.div
                className="p-2 bg-white/20 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut"
                }}
              >
                <IconComponent className="w-6 h-6" />
              </motion.div>

              {/* Text Content */}
              <div className="flex-1">
                <motion.div
                  className="text-xs font-semibold text-white/80 uppercase tracking-wide"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  Achievement Unlocked!
                </motion.div>
                
                <motion.h3
                  className="font-bold text-lg text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {achievement.name}
                </motion.h3>
                
                <motion.p
                  className="text-sm text-white/90 mt-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  {achievement.description}
                </motion.p>

                <motion.div
                  className="flex items-center gap-2 mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                    +{achievement.points} points
                  </span>
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                    {achievement.tier.toUpperCase()}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Progress Bar */}
            <motion.div
              className="mt-3 w-full bg-white/20 rounded-full h-1"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.div
                className="bg-white h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              />
            </motion.div>

            {/* Sparkle Effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: '20%'
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
