const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase, seedDatabase } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/market-contracts', require('./routes/marketContracts'));
app.use('/api/prop-bets', require('./routes/propBets'));
app.use('/api/users', require('./routes/users'));
app.use('/api', require('./routes/gamification'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    await seedDatabase();
    console.log('Database initialized and seeded');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
