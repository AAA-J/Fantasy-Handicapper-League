/**
 * Input validation middleware for market contracts
 */

/**
 * Validate bet placement request
 */
function validateBetPlacement(req, res, next) {
  const { userId, position, amount } = req.body;
  const errors = [];

  if (!userId || typeof userId !== 'number') {
    errors.push('userId must be a valid number');
  }

  if (!position || !['yes', 'no'].includes(position)) {
    errors.push('position must be "yes" or "no"');
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    errors.push('amount must be a positive number');
  }

  if (amount && amount < 1) {
    errors.push('minimum bet amount is 1 coin');
  }

  if (amount && amount > 10000) {
    errors.push('maximum bet amount is 10,000 coins');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
}

/**
 * Validate contract creation request
 */
function validateContractCreation(req, res, next) {
  const { title, description, category, closingDate } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  }

  if (title && title.length > 200) {
    errors.push('title must be 200 characters or less');
  }

  if (description && typeof description !== 'string') {
    errors.push('description must be a string');
  }

  if (description && description.length > 1000) {
    errors.push('description must be 1000 characters or less');
  }

  if (category && !['general', 'sports', 'politics', 'entertainment', 'finance', 'weather', 'technology'].includes(category)) {
    errors.push('category must be one of: general, sports, politics, entertainment, finance, weather, technology');
  }

  if (closingDate && isNaN(Date.parse(closingDate))) {
    errors.push('closingDate must be a valid date');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
}

/**
 * Validate contract resolution request
 */
function validateContractResolution(req, res, next) {
  const { resolution } = req.body;
  const errors = [];

  if (!resolution || !['yes', 'no'].includes(resolution)) {
    errors.push('resolution must be "yes" or "no"');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
}

/**
 * Validate user ID parameter
 */
function validateUserId(req, res, next) {
  const userId = parseInt(req.params.id);

  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ 
      error: 'Invalid user ID' 
    });
  }

  req.params.id = userId;
  next();
}

/**
 * Validate contract ID parameter
 */
function validateContractId(req, res, next) {
  const contractId = parseInt(req.params.id);

  if (isNaN(contractId) || contractId <= 0) {
    return res.status(400).json({ 
      error: 'Invalid contract ID' 
    });
  }

  req.params.id = contractId;
  next();
}

/**
 * Generic error handler
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Database constraint errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({ 
      error: 'Database constraint violation',
      details: err.message 
    });
  }

  // SQLite errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    return res.status(500).json({ 
      error: 'Database error',
      details: 'An internal error occurred' 
    });
  }

  // Default error
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
}

/**
 * Async error wrapper
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  validateBetPlacement,
  validateContractCreation,
  validateContractResolution,
  validateUserId,
  validateContractId,
  errorHandler,
  asyncHandler
};
