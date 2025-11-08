import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import ProbabilityChart from './ProbabilityChart';
import { CategoryIcon, getCategoryConfig } from './icons/SportIcons';

function ContractCard({ contract, onPlaceBet, onResolve, userBalance, showUserPosition = false, userPosition = null }) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const config = getCategoryConfig(category);
    return `${config.bgColor} ${config.color}`;
  };

  const getStatusColor = (status) => {
    return status === 'open' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const probability = contract.current_yes_probability || 0.5;
  const yesPercentage = Math.round(probability * 100);
  const noPercentage = 100 - yesPercentage;
  
  // Calculate trending direction (mock data for now)
  const isTrendingUp = Math.random() > 0.5;
  const priceChange = (Math.random() - 0.5) * 10;

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CategoryIcon category={contract.category} size={20} showBackground={true} />
              <h3 className="text-lg font-bold text-gray-900 flex-1">{contract.title}</h3>
              <div className="flex items-center gap-2">
                {isTrendingUp ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium text-gray-600">
                  {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
                </span>
              </div>
            </div>
            {contract.description && (
              <p className="text-gray-600 text-sm mb-3">{contract.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(contract.created_at)}</span>
              </div>
              {contract.creator_name && (
                <span>by {contract.creator_name}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
              {contract.status}
            </span>
            {contract.resolution && (
              <div className="mt-2 text-sm text-gray-600">
                Resolution: <span className="font-semibold">{contract.resolution}</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Probability Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              <ProbabilityChart probability={probability} size="lg" />
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{yesPercentage}%</div>
                  <div className="text-sm font-medium text-gray-600">YES</div>
                  <div className="text-xs text-gray-500">{(contract.yesPrice || 0.5).toFixed(3)}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{noPercentage}%</div>
                  <div className="text-sm font-medium text-gray-600">NO</div>
                  <div className="text-xs text-gray-500">{(contract.noPrice || 0.5).toFixed(3)}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Bet Buttons */}
          {contract.status === 'open' && (
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPlaceBet(contract)}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>YES</span>
                <span className="text-xs opacity-90">{yesPercentage}%</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPlaceBet(contract)}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>NO</span>
                <span className="text-xs opacity-90">{noPercentage}%</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-gray-600">YES Pool</span>
            </div>
            <div className="text-lg font-bold text-green-600">{Math.round(contract.yes_pool || 0)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-sm text-gray-600">NO Pool</span>
            </div>
            <div className="text-lg font-bold text-red-600">{Math.round(contract.no_pool || 0)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-sm text-gray-600">Total Volume</span>
            </div>
            <div className="text-lg font-bold text-blue-600">{Math.round(contract.totalPool || 0)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-purple-600 mr-1" />
              <span className="text-sm text-gray-600">Bets</span>
            </div>
            <div className="text-lg font-bold text-purple-600">{contract.bet_count || 0}</div>
          </div>
        </div>

        {/* User Position (if available) */}
        {showUserPosition && userPosition && userPosition.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Your Position</h4>
            <div className="space-y-2">
              {userPosition.map((position, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-blue-700">
                    {position.position.toUpperCase()} - {position.amount} coins
                  </span>
                  <span className="font-medium text-blue-900">
                    {position.shares.toFixed(2)} shares
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contract Details */}
        <div className="text-sm text-gray-600 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Created: {formatDate(contract.created_at)}</span>
            </div>
            {contract.creator_name && (
              <span>by {contract.creator_name}</span>
            )}
          </div>
        </div>

        {/* Admin Action Buttons */}
        {contract.status === 'open' && (
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onResolve(contract)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Resolve
            </motion.button>
          </div>
        )}

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Volume:</span>
                  <span className="font-medium">{Math.round(contract.totalPool || 0)} coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Liquidity Pool:</span>
                  <span className="font-medium">{Math.round(contract.liquidity_pool || 0)} coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">YES Probability:</span>
                  <span className="font-medium text-green-600">{Math.round((contract.probability || 0.5) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NO Probability:</span>
                  <span className="font-medium text-red-600">{Math.round((1 - (contract.probability || 0.5)) * 100)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">YES Share Price:</span>
                  <span className="font-medium">{(contract.yesPrice || 0.5).toFixed(3)} coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NO Share Price:</span>
                  <span className="font-medium">{(contract.noPrice || 0.5).toFixed(3)} coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Status:</span>
                  <span className={`font-medium ${contract.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                    {contract.status?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{contract.category || 'General'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ContractCard;
