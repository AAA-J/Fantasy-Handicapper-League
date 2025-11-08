import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Trophy, 
  Users, 
  Clock, 
  Target,
  Star,
  Zap,
  Award,
  TrendingUp,
  DollarSign
} from 'lucide-react';
// import { formatDistanceToNow, format, differenceInDays, differenceInHours } from 'date-fns';

const WeeklyChallenge = ({ 
  challenge, 
  currentUserId = null,
  onJoin = null,
  onLeave = null,
  isParticipating = false,
  userStats = null,
  className = ''
}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining('Ending soon');
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [challenge.end_date]);

  useEffect(() => {
    if (userStats && challenge.requirement) {
      const currentProgress = Math.min(userStats.progress || 0, challenge.requirement);
      setProgress((currentProgress / challenge.requirement) * 100);
    }
  }, [userStats, challenge.requirement]);

  const isActive = challenge.status === 'active';
  const isUpcoming = challenge.status === 'upcoming';
  const isCompleted = challenge.status === 'completed';
  const canJoin = isActive && !isParticipating;
  const canLeave = isActive && isParticipating;

  const getChallengeIcon = (type) => {
    const icons = {
      volume: Target,
      profit: DollarSign,
      streak: Zap,
      accuracy: TrendingUp,
      category: Award,
      social: Users
    };
    const IconComponent = icons[type] || Trophy;
    return <IconComponent className="w-6 h-6" />;
  };

  const getChallengeColor = (type) => {
    const colors = {
      volume: 'from-blue-500 to-cyan-600',
      profit: 'from-green-500 to-emerald-600',
      streak: 'from-orange-500 to-red-600',
      accuracy: 'from-purple-500 to-pink-600',
      category: 'from-indigo-500 to-blue-600',
      social: 'from-pink-500 to-rose-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleAction = () => {
    if (canJoin) {
      onJoin?.(challenge.id);
    } else if (canLeave) {
      onLeave?.(challenge.id);
    }
  };

  const getProgressText = () => {
    if (!userStats || !challenge.requirement) return '';
    
    const current = userStats.progress || 0;
    const required = challenge.requirement;
    const percentage = Math.min((current / required) * 100, 100);
    
    return `${current} / ${required} (${percentage.toFixed(1)}%)`;
  };

  return (
    <motion.div
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md
        transition-all duration-300 overflow-hidden ${className}
        ${isActive ? 'ring-2 ring-green-100' : ''}
      `}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${getChallengeColor(challenge.type)} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getChallengeIcon(challenge.type)}
            <div>
              <h3 className="font-bold text-lg">{challenge.name}</h3>
              <p className="text-sm opacity-90">{challenge.description}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
            {challenge.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Challenge Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{challenge.participant_count || 0} participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Trophy className="w-4 h-4" />
            <span>{challenge.reward || 0} coins reward</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{timeRemaining}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{challenge.category || 'All Categories'}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {isParticipating && userStats && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Your Progress</span>
              <span className="text-sm text-gray-600">{getProgressText()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            {progress >= 100 && (
              <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                <Star className="w-4 h-4" />
                Challenge Completed!
              </div>
            )}
          </div>
        )}

        {/* Requirements */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
          <div className="text-sm text-gray-600">
            <p className="mb-1">{challenge.requirement_text}</p>
            {challenge.bonus_conditions && (
              <p className="text-xs text-gray-500 mt-1">
                Bonus: {challenge.bonus_conditions}
              </p>
            )}
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Rewards</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Completion Reward</span>
              <span className="font-medium text-gray-900">{challenge.reward || 0} coins</span>
            </div>
            {challenge.bonus_reward && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Bonus Reward</span>
                <span className="font-medium text-gray-900">{challenge.bonus_reward} coins</span>
              </div>
            )}
            {challenge.achievement_reward && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Achievement</span>
                <span className="font-medium text-gray-900">{challenge.achievement_reward}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {challenge.entry_fee > 0 ? (
              <span>Entry: {challenge.entry_fee} coins</span>
            ) : (
              <span>Free to join</span>
            )}
          </div>
          
          {(canJoin || canLeave) && (
            <motion.button
              onClick={handleAction}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                flex items-center gap-2
                ${canJoin 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {canJoin ? (
                <>
                  <Star className="w-4 h-4" />
                  Join Challenge
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Leave Challenge
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyChallenge;
