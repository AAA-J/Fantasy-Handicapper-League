import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Clock, 
  DollarSign, 
  Star,
  Calendar,
  Target,
  Award,
  Crown,
  Zap
} from 'lucide-react';
// import { formatDistanceToNow, format } from 'date-fns';

const TournamentCard = ({ 
  tournament, 
  currentUserId = null,
  onJoin = null,
  onLeave = null,
  isParticipating = false,
  userRank = null,
  userProfit = null,
  className = ''
}) => {
  const isActive = tournament.status === 'active';
  const isUpcoming = tournament.status === 'upcoming';
  const isCompleted = tournament.status === 'completed';
  const canJoin = isActive && !isParticipating && tournament.entry_fee <= (tournament.user_balance || 0);
  const canLeave = isActive && isParticipating;

  const getTournamentIcon = (type) => {
    const icons = {
      weekly: Calendar,
      monthly: Award,
      championship: Crown,
      knockout: Target,
      round_robin: Users,
      elimination: Zap
    };
    const IconComponent = icons[type] || Trophy;
    return <IconComponent className="w-6 h-6" />;
  };

  const getTournamentColor = (type) => {
    const colors = {
      weekly: 'from-blue-500 to-cyan-600',
      monthly: 'from-purple-500 to-pink-600',
      championship: 'from-yellow-500 to-orange-600',
      knockout: 'from-red-500 to-pink-600',
      round_robin: 'from-green-500 to-emerald-600',
      elimination: 'from-orange-500 to-red-600'
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
      onJoin?.(tournament.id);
    } else if (canLeave) {
      onLeave?.(tournament.id);
    }
  };

  const getTimeRemaining = () => {
    if (isCompleted) return 'Completed';
    if (isUpcoming) return `Starts soon`;
    return `Ends soon`;
  };

  const getPrizeDistribution = () => {
    if (!tournament.prize_distribution) return null;
    
    const total = tournament.prize_pool || 0;
    let prizeDistribution;
    
    try {
      // Parse the JSON string if it's a string, otherwise use as is
      prizeDistribution = typeof tournament.prize_distribution === 'string' 
        ? JSON.parse(tournament.prize_distribution)
        : tournament.prize_distribution;
    } catch (error) {
      console.error('Error parsing prize distribution:', error);
      return null;
    }
    
    if (!Array.isArray(prizeDistribution)) return null;
    
    return prizeDistribution.map((percentage, index) => ({
      position: index + 1,
      percentage,
      amount: Math.round(total * (percentage / 100))
    }));
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
      <div className={`bg-gradient-to-r ${getTournamentColor(tournament.type)} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTournamentIcon(tournament.type)}
            <div>
              <h3 className="font-bold text-lg">{tournament.name}</h3>
              <p className="text-sm opacity-90">{tournament.description}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
            {tournament.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tournament Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{tournament.participant_count || 0} participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>{tournament.prize_pool || 0} coins prize pool</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{getTimeRemaining()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{tournament.category || 'All Categories'}</span>
          </div>
        </div>

        {/* Prize Distribution */}
        {getPrizeDistribution() && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Prize Distribution</h4>
            <div className="space-y-1">
              {getPrizeDistribution().slice(0, 5).map((prize) => (
                <div key={prize.position} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-4 h-4 ${
                      prize.position === 1 ? 'text-yellow-500' : 
                      prize.position === 2 ? 'text-gray-400' : 
                      prize.position === 3 ? 'text-amber-600' :
                      'text-gray-400'
                    }`} />
                    <span className="text-gray-600">
                      {prize.position === 1 ? '1st Place' : 
                       prize.position === 2 ? '2nd Place' : 
                       prize.position === 3 ? '3rd Place' :
                       `${prize.position}th Place`}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{prize.amount} coins</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Performance */}
        {isParticipating && userRank && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Your Rank</span>
              <span className="text-lg font-bold text-blue-600">#{userRank}</span>
            </div>
            <div className="text-xs text-blue-700 mt-1">
              {userProfit >= 0 ? '+' : ''}{userProfit || 0} coins
            </div>
          </div>
        )}

        {/* Rules */}
        {tournament.rules && (() => {
          let rules;
          try {
            rules = typeof tournament.rules === 'string' 
              ? JSON.parse(tournament.rules)
              : tournament.rules;
          } catch (error) {
            console.error('Error parsing rules:', error);
            return null;
          }
          
          if (!Array.isArray(rules)) return null;
          
          return (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rules</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {tournament.entry_fee > 0 ? (
              <span>Entry: {tournament.entry_fee} coins</span>
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
                  Join Tournament
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Leave Tournament
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TournamentCard;
