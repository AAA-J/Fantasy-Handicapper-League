/**
 * Automated Market Maker (AMM) for prediction markets
 * Implements Constant Product Market Maker (CPMM) formula: x * y = k
 */

/**
 * Calculate the current probability of YES based on pool sizes
 * @param {number} yesPool - Current YES pool size
 * @param {number} noPool - Current NO pool size
 * @returns {number} Probability of YES (0-1)
 */
function calculateProbability(yesPool, noPool) {
  if (yesPool + noPool === 0) return 0.5;
  return yesPool / (yesPool + noPool);
}

/**
 * Calculate shares received for a given investment amount
 * @param {number} amount - Amount to invest
 * @param {number} currentPool - Current pool size for the position
 * @param {number} totalPool - Total pool size (yes + no)
 * @returns {number} Shares received
 */
function calculateShares(amount, currentPool, totalPool) {
  if (totalPool === 0) return amount;
  return (amount * currentPool) / totalPool;
}

/**
 * Calculate the price for buying shares in a position
 * @param {number} amount - Amount to invest
 * @param {number} yesPool - Current YES pool size
 * @param {number} noPool - Current NO pool size
 * @param {string} position - 'yes' or 'no'
 * @returns {Object} Price calculation result
 */
function calculatePrice(amount, yesPool, noPool, position) {
  const totalPool = yesPool + noPool;
  const probability = calculateProbability(yesPool, noPool);
  
  if (position === 'yes') {
    // When buying YES, you get shares based on the current probability
    const shares = amount / probability; // More shares if probability is lower
    const newYesPool = yesPool + amount;
    const newNoPool = noPool; // NO pool stays the same
    
    return {
      shares: shares,
      price: probability,
      newYesPool,
      newNoPool,
      newProbability: calculateProbability(newYesPool, newNoPool)
    };
  } else {
    // When buying NO, you get shares based on the current NO probability
    const noProbability = 1 - probability;
    const shares = amount / noProbability; // More shares if NO probability is lower
    const newNoPool = noPool + amount;
    const newYesPool = yesPool; // YES pool stays the same
    
    return {
      shares: shares,
      price: noProbability,
      newYesPool,
      newNoPool,
      newProbability: calculateProbability(newYesPool, newNoPool)
    };
  }
}

/**
 * Calculate potential payout for shares if contract resolves in favor
 * @param {number} shares - Number of shares owned
 * @param {number} yesPool - Current YES pool size
 * @param {number} noPool - Current NO pool size
 * @param {string} position - 'yes' or 'no'
 * @returns {number} Potential payout amount
 */
function calculatePotentialPayout(shares, yesPool, noPool, position) {
  const totalPool = yesPool + noPool;
  if (totalPool === 0) return 0;
  
  if (position === 'yes') {
    return (shares * totalPool) / (yesPool + shares);
  } else {
    return (shares * totalPool) / (noPool + shares);
  }
}

/**
 * Calculate actual payout when contract resolves
 * @param {number} shares - Number of shares owned
 * @param {number} totalPool - Total pool size at resolution
 * @param {string} position - 'yes' or 'no'
 * @param {string} resolution - 'yes' or 'no'
 * @returns {number} Actual payout amount
 */
function calculateActualPayout(shares, totalPool, position, resolution) {
  if (position !== resolution) return 0;
  // If you win, you get back your shares (which represent your stake in the total pool)
  // This is a simple 1:1 payout for winning shares
  return shares;
}

/**
 * Initialize a new contract with balanced pools
 * @param {number} liquidityPool - Total liquidity to add
 * @returns {Object} Initial pool configuration
 */
function initializeContract(liquidityPool = 1000) {
  const halfPool = liquidityPool / 2;
  return {
    yesPool: halfPool,
    noPool: halfPool,
    liquidityPool,
    probability: 0.5
  };
}

/**
 * Get current market state for a contract
 * @param {number} yesPool - Current YES pool size
 * @param {number} noPool - Current NO pool size
 * @returns {Object} Current market state
 */
function getMarketState(yesPool, noPool) {
  const totalPool = yesPool + noPool;
  const probability = calculateProbability(yesPool, noPool);
  
  return {
    yesPool,
    noPool,
    totalPool,
    probability,
    yesPrice: probability, // Price of YES shares = probability of YES
    noPrice: 1 - probability // Price of NO shares = probability of NO
  };
}

module.exports = {
  calculateProbability,
  calculateShares,
  calculatePrice,
  calculatePotentialPayout,
  calculateActualPayout,
  initializeContract,
  getMarketState
};
