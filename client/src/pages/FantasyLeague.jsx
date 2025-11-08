import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { propBetsAPI } from '../services/api';
import { CategoryIcon } from '../components/icons/SportIcons';
import { AnimatedCount } from '../components/shared/AnimatedNumber';
import { ContractCardSkeleton } from '../components/shared/LoadingSkeleton';
import { NoBetsEmptyState } from '../components/shared/EmptyState';

function FantasyLeague() {
  const { selectedUser } = useUser();
  const [propBets, setPropBets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPropBet, setNewPropBet] = useState({ title: '', description: '', odds: 1.0 });

  useEffect(() => {
    loadPropBets();
    if (selectedUser) {
      loadBalance();
    }
  }, [selectedUser]);

  const loadPropBets = async () => {
    try {
      const response = await propBetsAPI.getAll();
      setPropBets(response.data);
    } catch (error) {
      console.error('Error loading prop bets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      const response = await propBetsAPI.getBalance(selectedUser.id);
      setBalance(response.data.fantasy_coins);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleCreatePropBet = async (e) => {
    e.preventDefault();
    try {
      await propBetsAPI.create(newPropBet);
      setNewPropBet({ title: '', description: '', odds: 1.0 });
      setShowCreateForm(false);
      loadPropBets();
    } catch (error) {
      console.error('Error creating prop bet:', error);
      alert('Error creating prop bet');
    }
  };

  const handlePlaceBet = async (propBetId, amount) => {
    if (!selectedUser) {
      alert('Please select a user first');
      return;
    }

    try {
      await propBetsAPI.placeBet(propBetId, {
        userId: selectedUser.id,
        amount: parseInt(amount)
      });
      loadPropBets();
      loadBalance();
      alert('Fantasy bet placed successfully!');
    } catch (error) {
      console.error('Error placing bet:', error);
      alert(error.response?.data?.error || 'Error placing bet');
    }
  };

  const handleResolvePropBet = async (propBetId, result) => {
    try {
      await propBetsAPI.resolve(propBetId, { result });
      loadPropBets();
      loadBalance();
      alert('Prop bet resolved successfully!');
    } catch (error) {
      console.error('Error resolving prop bet:', error);
      alert(error.response?.data?.error || 'Error resolving prop bet');
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fantasy Handicapper League</h1>
          <div className="flex items-center space-x-4">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ContractCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fantasy Handicapper League</h1>
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold text-green-600 flex items-center gap-2">
            <CategoryIcon category="sports" size={20} />
            <span>Fantasy Coins:</span>
            <AnimatedCount value={balance} className="text-green-600" />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <CategoryIcon category="sports" size={16} />
            Create Prop Bet
          </motion.button>
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Prop Bet</h2>
          <form onSubmit={handleCreatePropBet}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newPropBet.title}
                onChange={(e) => setNewPropBet({ ...newPropBet, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newPropBet.description}
                onChange={(e) => setNewPropBet({ ...newPropBet, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Odds (multiplier for winning bets)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                value={newPropBet.odds}
                onChange={(e) => setNewPropBet({ ...newPropBet, odds: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Create Prop Bet
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {propBets.length > 0 ? (
          propBets.map((propBet, index) => (
            <motion.div
              key={propBet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CategoryIcon category="sports" size={20} showBackground={true} />
                      <h3 className="text-xl font-bold text-gray-900 flex-1">{propBet.title}</h3>
                    </div>
                    {propBet.description && (
                      <p className="text-gray-600 text-sm mb-3">{propBet.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      propBet.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {propBet.status}
                    </span>
                    {propBet.result && (
                      <div className="mt-2 text-sm text-gray-600">
                        Result: <span className="font-semibold">{propBet.result}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{propBet.odds}x</div>
                      <div className="text-sm text-gray-600">Odds</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        <AnimatedCount value={propBet.total_amount || 0} />
                      </div>
                      <div className="text-sm text-gray-600">Total Bet</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-600">
                        <AnimatedCount value={propBet.bet_count || 0} />
                      </div>
                      <div className="text-sm text-gray-600">Bets</div>
                    </div>
                  </div>
                </div>

                {propBet.status === 'open' && (
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const amount = prompt('Enter bet amount:');
                        if (amount && !isNaN(amount) && parseInt(amount) > 0) {
                          handlePlaceBet(propBet.id, amount);
                        }
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Place Bet
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const result = prompt('Enter result (win/loss):');
                        if (result === 'win' || result === 'loss') {
                          handleResolvePropBet(propBet.id, result);
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Resolve
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full">
            <NoBetsEmptyState onPlaceBet={() => setShowCreateForm(true)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default FantasyLeague;
