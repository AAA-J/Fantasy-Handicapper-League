import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

function BetModal({ isOpen, onClose, contract, onPlaceBet, userBalance }) {
  const [amount, setAmount] = useState(10);
  const [position, setPosition] = useState('yes');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount(10);
      setPosition('yes');
    }
  }, [isOpen]);

  if (!isOpen || !contract) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0 || amount > userBalance) return;

    setIsLoading(true);
    try {
      await onPlaceBet(contract.id, position, amount);
      onClose();
    } catch (error) {
      console.error('Error placing bet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePotentialPayout = () => {
    if (!contract || amount <= 0) return 0;
    
    // Calculate based on AMM pricing
    const probability = contract.current_yes_probability || 0.5;
    const totalPool = (contract.yes_pool || 500) + (contract.no_pool || 500);
    
    if (position === 'yes') {
      // If YES wins, payout is proportional to total pool
      const yesShares = amount / probability;
      return Math.round(yesShares);
    } else {
      // If NO wins, payout is proportional to total pool
      const noShares = amount / (1 - probability);
      return Math.round(noShares);
    }
  };

  const potentialPayout = calculatePotentialPayout();
  const potentialProfit = potentialPayout - amount;
  const quickAmounts = [10, 25, 50, 100, Math.floor(userBalance * 0.25), Math.floor(userBalance * 0.5), userBalance];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Place Bet</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {contract.title}
                </h3>
                {contract.description && (
                  <p className="text-gray-600 text-sm">{contract.description}</p>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Position Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Your Position
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setPosition('yes')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
                        position === 'yes'
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                          : 'border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-lg">YES</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((contract.current_yes_probability || 0.5) * 100)}% probability
                      </div>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setPosition('no')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
                        position === 'no'
                          ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                          : 'border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <TrendingDown className="w-5 h-5" />
                        <span className="text-lg">NO</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((1 - (contract.current_yes_probability || 0.5)) * 100)}% probability
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Bet Amount
                  </label>
                  
                  {/* Amount Slider */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="text-lg font-bold text-gray-900">{amount} coins</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={userBalance}
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(amount / userBalance) * 100}%, #e5e7eb ${(amount / userBalance) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>{userBalance}</span>
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Quick amounts:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {quickAmounts.filter(amt => amt <= userBalance).map((quickAmount) => (
                        <motion.button
                          key={quickAmount}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAmount(quickAmount)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            amount === quickAmount
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {quickAmount === userBalance ? 'Max' : quickAmount}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Balance Info */}
                  <div className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <span>Available: {userBalance} coins</span>
                    <span>Remaining: {userBalance - amount} coins</span>
                  </div>
                </div>

                {/* Bet Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Bet Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className={`font-semibold ${position === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                        {position.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{amount} coins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Potential Payout:</span>
                      <span className="font-medium">{potentialPayout} coins</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-blue-200 pt-2">
                      <span className={potentialProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        Potential Profit:
                      </span>
                      <span className={potentialProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {potentialProfit >= 0 ? '+' : ''}{potentialProfit} coins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={amount <= 0 || amount > userBalance || isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      isLoading || amount <= 0 || amount > userBalance
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Placing Bet...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Place Bet
                      </div>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BetModal;
