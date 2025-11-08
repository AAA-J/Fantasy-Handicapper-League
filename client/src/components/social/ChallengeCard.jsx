import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Clock, 
  Target, 
  Award, 
  Star,
  Calendar,
  DollarSign,
  Zap
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const ChallengeCard = ({ 
  challenge, 
  currentUserId = null,
  onJoin = null,
  onLeave = null,
  isParticipating = false,
  userRank = null,
  className = ''
}) => {
  const isActive = challenge.status === 'active';
  const isUpcoming = challenge.status === 'upcoming';
  const isCompleted = challenge.status === 'completed';
  const canJoin = isActive && !isParticipating && challenge.entry_fee <= (challenge.user_balance || 0);
  const canLeave = isActive && isParticipating;

  const getChallengeIcon = (type) => {
    const icons = {
      tournament: Trophy,
      weekly: Calendar,
      monthly: Award,
      head_to_head: Users,
      category: Target,
      streak: Zap
    };
    const IconComponent = icons[type] || Trophy;
    return <IconComponent className="w-6 h-6" />;
  };

  const getChallengeColor = (type) => {
    const colors = {
      tournament: 'from-yellow-500 to-orange-600',
      weekly: 'from-blue-500 to-cyan-600',
      monthly: 'from-purple-500 to-pink-600',
      head_to_head: 'from-green-500 to-emerald-600',
      category: 'from-red-500 to-pink-600',
      streak: 'from-orange-500 to-red-600'
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

  const getTimeRemaining = () => {
    if (isCompleted) return 'Completed';
    if (isUpcoming) return `Starts ${formatDistanceToNow(new Date(challenge.start_date), { addSuffix: true })}`;
    return `Ends ${formatDistanceToNow(new Date(challenge.end_date), { addSuffix: true })}`;
  };

  return (
    <motion.div
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md
        transition-all duration-300 overflow-hidden ${className}
        ${isActive ? 'ring-2 ring-blue-100' : ''}
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
            <DollarSign className="w-4 h-4" />
            <span>{challenge.prize_pool || 0} coins prize pool</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{getTimeRemaining()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{challenge.category || 'All Categories'}</span>
          </div>
        </div>

        {/* Prize Distribution */}
        {challenge.prize_distribution && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Prize Distribution</h4>
            <div className="space-y-1">
              {challenge.prize_distribution.slice(0, 3).map((prize, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-4 h-4 ${
                      index === 0 ? 'text-yellow-500' : 
                      index === 1 ? 'text-gray-400' : 
                      'text-amber-600'
                    }`} />
                    <span className="text-gray-600">
                      {index === 0 ? '1st Place' : index === 1 ? '2nd Place' : '3rd Place'}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{prize} coins</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Rank */}
        {isParticipating && userRank && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Your Rank</span>
              <span className="text-lg font-bold text-blue-600">#{userRank}</span>
            </div>
            <div className="text-xs text-blue-700 mt-1">
              {challenge.user_profit >= 0 ? '+' : ''}{challenge.user_profit || 0} coins
            </div>
          </div>
        )}

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
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
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

export default ChallengeCard;
