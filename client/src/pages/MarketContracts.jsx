import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { marketContractsAPI } from '../services/api';
import { Toaster } from 'react-hot-toast';
import { 
  Filter, 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  Grid3X3,
  List,
  ArrowUpDown
} from 'lucide-react';
import BetModal from '../components/BetModal';
import ContractCard from '../components/ContractCard';
import PriceHistoryChart from '../components/PriceHistoryChart';
import LeaderboardTable from '../components/LeaderboardTable';
import CategoryFilter from '../components/filters/CategoryFilter';
import { ContractCardSkeleton } from '../components/shared/LoadingSkeleton';
import { NoContractsEmptyState, NoSearchResultsEmptyState } from '../components/shared/EmptyState';

function MarketContracts() {
  const { selectedUser } = useUser();
  const [contracts, setContracts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [newContract, setNewContract] = useState({ 
    title: '', 
    description: '', 
    category: 'general',
    closingDate: ''
  });
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });
  const [userPositions, setUserPositions] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeView, setActiveView] = useState('contracts'); // contracts, leaderboard
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('recent'); // recent, volume, probability, ending
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, [selectedUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadContracts(),
        loadBalance(),
        loadLeaderboard()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContracts = async () => {
    try {
      const response = await marketContractsAPI.getAll();
      setContracts(response.data);
      
      // Calculate category counts
      const categoryCounts = response.data.reduce((acc, contract) => {
        const category = contract.category || 'general';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
      
      const categoryList = Object.entries(categoryCounts).map(([category, count]) => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        count
      }));
      
      setCategories(categoryList);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  const loadBalance = async () => {
    if (!selectedUser) return;
    try {
      const response = await marketContractsAPI.getBalance(selectedUser.id);
      setBalance(response.data.prediction_coins);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await marketContractsAPI.getLeaderboard(10);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadUserPositions = async (contractId) => {
    if (!selectedUser) return;
    try {
      const response = await marketContractsAPI.getUserPosition(contractId, selectedUser.id);
      setUserPositions(prev => ({
        ...prev,
        [contractId]: response.data
      }));
    } catch (error) {
      console.error('Error loading user positions:', error);
    }
  };

  const loadPriceHistory = async (contractId) => {
    try {
      const response = await marketContractsAPI.getPriceHistory(contractId);
      setPriceHistory(prev => ({
        ...prev,
        [contractId]: response.data
      }));
    } catch (error) {
      console.error('Error loading price history:', error);
    }
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    try {
      await marketContractsAPI.create({
        ...newContract,
        creatorId: selectedUser?.id
      });
      setNewContract({ title: '', description: '', category: 'general', closingDate: '' });
      setShowCreateForm(false);
      loadContracts();
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  const handlePlaceBet = async (contractId, position, amount) => {
    if (!selectedUser) {
      return;
    }

    try {
      await marketContractsAPI.placeBet(contractId, {
        userId: selectedUser.id,
        position,
        amount: parseInt(amount)
      });
      loadContracts();
      loadBalance();
      loadUserPositions(contractId);
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  const handleResolveContract = async (contractId, resolution) => {
    try {
      await marketContractsAPI.resolve(contractId, { resolution });
      loadContracts();
      loadBalance();
    } catch (error) {
      console.error('Error resolving contract:', error);
    }
  };

  const openBetModal = (contract) => {
    setSelectedContract(contract);
    setShowBetModal(true);
  };

  const closeBetModal = () => {
    setShowBetModal(false);
    setSelectedContract(null);
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesStatus = filters.status === 'all' || contract.status === filters.status;
    const matchesCategory = filters.category === 'all' || contract.category === filters.category;
    const matchesSearch = filters.search === '' || 
      contract.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      contract.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return (b.totalPool || 0) - (a.totalPool || 0);
      case 'probability':
        return Math.abs(0.5 - (a.current_yes_probability || 0.5)) - Math.abs(0.5 - (b.current_yes_probability || 0.5));
      case 'ending':
        return new Date(a.closing_date || 0) - new Date(b.closing_date || 0);
      case 'recent':
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Market Prediction Contracts</h1>
          <div className="flex items-center space-x-4">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex space-x-2 overflow-x-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-20 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
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
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Prediction Contracts</h1>
          <p className="text-gray-600 mt-2">Advanced prediction markets with dynamic pricing</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="text-lg font-semibold text-blue-600">
            Balance: {balance} coins
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Contract
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveView('contracts')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeView === 'contracts'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 mr-2 inline" />
          Contracts
        </button>
        <button
          onClick={() => setActiveView('leaderboard')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeView === 'leaderboard'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 mr-2 inline" />
          Leaderboard
        </button>
      </div>

      {/* Create Contract Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Contract</h2>
          <form onSubmit={handleCreateContract}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newContract.title}
                  onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Will it rain tomorrow?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newContract.category}
                  onChange={(e) => setNewContract({ ...newContract, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="sports">Sports</option>
                  <option value="politics">Politics</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="finance">Finance</option>
                  <option value="weather">Weather</option>
                  <option value="technology">Technology</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newContract.description}
                onChange={(e) => setNewContract({ ...newContract, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Optional description of the prediction..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={newContract.closingDate}
                onChange={(e) => setNewContract({ ...newContract, closingDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Contract
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

      {/* Enhanced Filters */}
      {activeView === 'contracts' && (
        <div className="space-y-4 mb-6">
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={filters.category}
            onCategoryChange={(category) => setFilters({ ...filters, category })}
            className="bg-white rounded-xl shadow-sm p-4"
          />
          
          {/* Search and Controls */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search contracts..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recent">Recent</option>
                    <option value="volume">Volume</option>
                    <option value="probability">Closest to 50%</option>
                    <option value="ending">Ending Soon</option>
                  </select>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeView === 'contracts' ? (
        <div>
          {filteredContracts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredContracts.map((contract, index) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ContractCard
                    contract={contract}
                    onPlaceBet={openBetModal}
                    onResolve={(contract) => {
                      const resolution = prompt('Enter resolution (yes/no):');
                      if (resolution === 'yes' || resolution === 'no') {
                        handleResolveContract(contract.id, resolution);
                      }
                    }}
                    userBalance={balance}
                    showUserPosition={!!selectedUser}
                    userPosition={userPositions[contract.id] || []}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            filters.search || filters.category !== 'all' || filters.status !== 'all' ? (
              <NoSearchResultsEmptyState 
                onClearFilters={() => setFilters({ status: 'all', category: 'all', search: '' })}
              />
            ) : (
              <NoContractsEmptyState 
                onCreateContract={() => setShowCreateForm(true)}
              />
            )
          )}
        </div>
      ) : (
        <LeaderboardTable 
          data={leaderboard} 
          currentUserId={selectedUser?.id} 
        />
      )}

      {/* Bet Modal */}
      {showBetModal && selectedContract && (
        <BetModal
          isOpen={showBetModal}
          onClose={closeBetModal}
          contract={selectedContract}
          onPlaceBet={handlePlaceBet}
          userBalance={balance}
        />
      )}
    </div>
  );
}

export default MarketContracts;
