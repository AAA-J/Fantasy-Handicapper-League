import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MarketContracts from './pages/MarketContracts';
import FantasyLeague from './pages/FantasyLeague';
import UserProfile from './pages/UserProfile';
import Leaderboard from './pages/Leaderboard';
import Social from './pages/Social';
import Competitions from './pages/Competitions';
import ErrorBoundary from './components/ErrorBoundary';
import SideNavigation from './components/SideNavigation';
import { UserProvider } from './contexts/UserContext';
import { CategoryIcon } from './components/icons/SportIcons';
import { AnimatedCount } from './components/shared/AnimatedNumber';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Load users on app start
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]);
        }
      })
      .catch(error => {
        console.error('Error loading users:', error);
      });
  }, []);

  return (
    <UserProvider value={{ users, selectedUser, setSelectedUser }}>
      <Router>
        <div className="min-h-screen bg-gray-100 flex">
          {/* Side Navigation */}
          <SideNavigation selectedUser={selectedUser} />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:ml-0">
            {/* Top Navigation Bar */}
            <nav className="bg-blue-600 text-white shadow-lg">
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold">Fantasy Handicapper League</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    {selectedUser && (
                      <div className="text-sm">
                        <span className="text-blue-200">Playing as: </span>
                        <span className="font-semibold">{selectedUser.username}</span>
                      </div>
                    )}
                    {/* Future top navigation items can be added here */}
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 py-6 px-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/market-contracts" element={<MarketContracts />} />
                <Route path="/fantasy-league" element={<FantasyLeague />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/social" element={<Social />} />
                <Route path="/competitions" element={
                  <ErrorBoundary>
                    <Competitions />
                  </ErrorBoundary>
                } />
                <Route path="/profile/:userId" element={<UserProfile />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

function Home() {
  const [stats, setStats] = useState({
    totalContracts: 0,
    totalVolume: 0,
    activeUsers: 0,
    totalBets: 0
  });

  useEffect(() => {
    // Mock stats - in real app, fetch from API
    setStats({
      totalContracts: 24,
      totalVolume: 125000,
      activeUsers: 156,
      totalBets: 342
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Fantasy Handicapper League
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Two separate betting systems with different currencies. Trade prediction markets or bet on fantasy sports with real-time odds and professional-grade UI.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-blue-600 mb-1">
              <AnimatedCount value={stats.totalContracts} />
            </div>
            <div className="text-sm text-gray-600">Active Contracts</div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-green-600 mb-1">
              <AnimatedCount value={stats.totalVolume} />
            </div>
            <div className="text-sm text-gray-600">Total Volume</div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-purple-600 mb-1">
              <AnimatedCount value={stats.activeUsers} />
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-2xl font-bold text-orange-600 mb-1">
              <AnimatedCount value={stats.totalBets} />
            </div>
            <div className="text-sm text-gray-600">Total Bets</div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -4 }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <CategoryIcon category="general" size={32} showBackground={true} />
              <h2 className="text-3xl font-bold text-gray-900">
                Market Prediction Contracts
              </h2>
            </div>
            <p className="text-gray-700 mb-6 text-lg">
              Binary yes/no predictions using Prediction Coins. Advanced market making with real-time probability updates.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                Real-time Pricing
              </span>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                AMM Algorithm
              </span>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                Category Filtering
              </span>
            </div>
            <Link 
              to="/market-contracts"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Trading
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ y: -4 }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <CategoryIcon category="sports" size={32} showBackground={true} />
              <h2 className="text-3xl font-bold text-gray-900">
                Fantasy Handicapper League
              </h2>
            </div>
            <p className="text-gray-700 mb-6 text-lg">
              Prop betting with custom odds using Fantasy Coins. Create and bet on sports predictions with friends.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                Custom Odds
              </span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                Sports Focused
              </span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                Social Betting
              </span>
            </div>
            <Link 
              to="/fantasy-league"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Betting
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
