import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = '/api';

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
    
    // Show toast notification for errors
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Market Contracts API
export const marketContractsAPI = {
  // Get all market contracts
  getAll: () => axios.get(`${API_BASE_URL}/market-contracts`),
  
  // Create new market contract
  create: (data) => axios.post(`${API_BASE_URL}/market-contracts`, data),
  
  // Place a bet on a market contract
  placeBet: (contractId, data) => axios.post(`${API_BASE_URL}/market-contracts/${contractId}/bet`, data),
  
  // Resolve a market contract
  resolve: (contractId, data) => axios.post(`${API_BASE_URL}/market-contracts/${contractId}/resolve`, data),
  
  // Get user's prediction coin balance
  getBalance: (userId) => axios.get(`${API_BASE_URL}/market-contracts/users/${userId}/balance`),
  
  // Get user's bet history
  getUserHistory: (userId) => axios.get(`${API_BASE_URL}/market-contracts/users/${userId}/history`),
  
  // Get user's statistics
  getUserStatistics: (userId) => axios.get(`${API_BASE_URL}/market-contracts/users/${userId}/statistics`),
  
  // Get user's active positions
  getActivePositions: (userId) => axios.get(`${API_BASE_URL}/market-contracts/users/${userId}/active-positions`),
  
  // Get leaderboard
  getLeaderboard: (limit = 10) => axios.get(`${API_BASE_URL}/market-contracts/leaderboard?limit=${limit}`),
  
  // Get contract price history
  getPriceHistory: (contractId) => axios.get(`${API_BASE_URL}/market-contracts/${contractId}/price-history`),
  
  // Get user's position in a specific contract
  getUserPosition: (contractId, userId) => axios.get(`${API_BASE_URL}/market-contracts/${contractId}/user-position?userId=${userId}`),
};

// Prop Bets API
export const propBetsAPI = {
  // Get all prop bets
  getAll: () => axios.get(`${API_BASE_URL}/prop-bets`),
  
  // Create new prop bet
  create: (data) => axios.post(`${API_BASE_URL}/prop-bets`, data),
  
  // Place a bet on a prop bet
  placeBet: (propBetId, data) => axios.post(`${API_BASE_URL}/prop-bets/${propBetId}/bet`, data),
  
  // Resolve a prop bet
  resolve: (propBetId, data) => axios.post(`${API_BASE_URL}/prop-bets/${propBetId}/resolve`, data),
  
  // Get user's fantasy coin balance
  getBalance: (userId) => axios.get(`${API_BASE_URL}/prop-bets/users/${userId}/balance`),
};

// Users API
export const usersAPI = {
  // Get all users
  getAll: () => axios.get(`${API_BASE_URL}/users`),
  
  // Create new user
  create: (data) => axios.post(`${API_BASE_URL}/users`, data),
  
  // Get user by ID
  getById: (userId) => axios.get(`${API_BASE_URL}/users/${userId}`),
};

// Gamification API
export const gamificationAPI = {
  // Leaderboard
  getLeaderboard: (timeframe = 'all-time', category = 'all', limit = 50) => 
    axios.get(`${API_BASE_URL}/leaderboard/${timeframe}/${category}?limit=${limit}`),
  
  // User ranking
  getUserRanking: (userId) => axios.get(`${API_BASE_URL}/users/${userId}/ranking`),
  
  // User achievements
  getUserAchievements: (userId) => axios.get(`${API_BASE_URL}/users/${userId}/achievements`),
  
  // All achievements
  getAllAchievements: () => axios.get(`${API_BASE_URL}/achievements`),
  
  // User stats
  getUserStats: (userId) => axios.get(`${API_BASE_URL}/users/${userId}/stats`),
  
  // Follow user
  followUser: (userId, followerId) => 
    axios.post(`${API_BASE_URL}/users/${userId}/follow`, { followerId }),
  
  // Unfollow user
  unfollowUser: (userId, followerId) => 
    axios.delete(`${API_BASE_URL}/users/${userId}/follow`, { data: { followerId } }),
  
  // Get followers
  getFollowers: (userId) => axios.get(`${API_BASE_URL}/users/${userId}/followers`),
  
  // Get following
  getFollowing: (userId) => axios.get(`${API_BASE_URL}/users/${userId}/following`),
  
  // Challenges
  getChallenges: () => axios.get(`${API_BASE_URL}/challenges`),
  
  // Join challenge
  joinChallenge: (challengeId, userId) => 
    axios.post(`${API_BASE_URL}/challenges/${challengeId}/join`, { userId }),
  
  // Current season
  getCurrentSeason: () => axios.get(`${API_BASE_URL}/seasons/current`),
  
  // Activity feed
  getActivityFeed: (userId, limit = 20) => 
    axios.get(`${API_BASE_URL}/feed?userId=${userId}&limit=${limit}`),
  
  // User challenges
  getUserChallenges: (userId) => 
    axios.get(`${API_BASE_URL}/users/${userId}/challenges`),
  
  // Leave challenge
  leaveChallenge: (challengeId, userId) => 
    axios.delete(`${API_BASE_URL}/challenges/${challengeId}/leave`, { data: { userId } }),
  
  // Tournaments
  getTournaments: () => axios.get(`${API_BASE_URL}/tournaments`),
  
  // Join tournament
  joinTournament: (tournamentId, userId) => 
    axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/join`, { userId }),
  
  // Leave tournament
  leaveTournament: (tournamentId, userId) => 
    axios.delete(`${API_BASE_URL}/tournaments/${tournamentId}/leave`, { data: { userId } }),
  
  // Get user tournaments
  getUserTournaments: (userId) => 
    axios.get(`${API_BASE_URL}/users/${userId}/tournaments`),
  
  // Weekly challenges
  getWeeklyChallenges: () => axios.get(`${API_BASE_URL}/weekly-challenges`),
};
