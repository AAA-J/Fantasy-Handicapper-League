import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { marketContractsAPI, gamificationAPI } from '../services/api';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Activity, 
  Clock,
  BarChart3,
  PieChart,
  Award,
  Star
} from 'lucide-react';
import UserPositionCard from '../components/UserPositionCard';
import LeaderboardTable from '../components/LeaderboardTable';
import AchievementProgress from '../components/gamification/AchievementProgress';
import AchievementCollection from '../components/gamification/AchievementCollection';
import AchievementNotification from '../components/gamification/AchievementNotification';
import TierBadge from '../components/gamification/TierBadge';
import StreakCounter from '../components/gamification/StreakCounter';

function UserProfile() {
  const { userId } = useParams();
  const { selectedUser } = useUser();
  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [history, setHistory] = useState([]);
  const [activePositions, setActivePositions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Gamification state
  const [userRanking, setUserRanking] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user info
      const userResponse = await marketContractsAPI.getBalance(userId);
      setUser({ id: userId, prediction_coins: userResponse.data.prediction_coins });

      // Load statistics
      const statsResponse = await marketContractsAPI.getUserStatistics(userId);
      setStatistics(statsResponse.data);

      // Load history
      const historyResponse = await marketContractsAPI.getUserHistory(userId);
      setHistory(historyResponse.data);

      // Load active positions
      const positionsResponse = await marketContractsAPI.getActivePositions(userId);
      setActivePositions(positionsResponse.data);

      // Load leaderboard
      const leaderboardResponse = await marketContractsAPI.getLeaderboard(10);
      setLeaderboard(leaderboardResponse.data);

      // Load gamification data
      try {
        const [rankingResponse, achievementsResponse, userAchievementsResponse] = await Promise.all([
          gamificationAPI.getUserRanking(userId),
          gamificationAPI.getAllAchievements(),
          gamificationAPI.getUserAchievements(userId)
        ]);
        
        setUserRanking(rankingResponse.data);
        setAchievements(achievementsResponse.data);
        setUserAchievements(userAchievementsResponse.data);
      } catch (error) {
        console.error('Error loading gamification data:', error);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  const formatPercentage = (num) => {
    return (num * 100).toFixed(1) + '%';
  };

  const getProfitColor = (profit) => {
    return profit >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isCurrentUser = selectedUser && selectedUser.id === parseInt(userId);

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isCurrentUser ? 'Your Profile' : 'User Profile'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isCurrentUser ? 'Track your performance and betting history' : 'View user statistics and activity'}
            </p>
          </div>
          
          {/* User Tier and Streak */}
          {userRanking && (
            <div className="flex items-center gap-4">
              <TierBadge tier={userRanking.tier} size="lg" />
              <StreakCounter 
                winStreak={userRanking.win_streak} 
                bestStreak={userRanking.best_streak}
                size="lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Profit</p>
                <p className={`text-2xl font-semibold ${getProfitColor(statistics.total_profit)}`}>
                  {statistics.total_profit >= 0 ? '+' : ''}{formatNumber(statistics.total_profit)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Win Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatPercentage(statistics.win_rate)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bets</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistics.total_bets}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Volume</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(statistics.total_volume)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'achievements', name: 'Achievements', icon: Award },
            { id: 'positions', name: 'Active Positions', icon: Clock },
            { id: 'history', name: 'Bet History', icon: Activity },
            { id: 'leaderboard', name: 'Leaderboard', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {history.slice(0, 5).map((bet, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        bet.outcome === 'win' ? 'bg-green-500' : 
                        bet.outcome === 'loss' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {bet.contract_title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {bet.position.toUpperCase()} - {bet.amount} coins
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        bet.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {bet.profit_loss >= 0 ? '+' : ''}{bet.profit_loss.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(bet.bet_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Progress */}
            <AchievementProgress 
              achievements={achievements}
              userAchievements={userAchievements}
            />
          </div>
        )}

        {activeTab === 'achievements' && (
          <AchievementCollection 
            achievements={achievements}
            userAchievements={userAchievements}
          />
        )}

        {activeTab === 'positions' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Active Positions ({activePositions.length})
            </h3>
            {activePositions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePositions.map((position, index) => (
                  <UserPositionCard key={index} position={position} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No active positions</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bet History ({history.length})
            </h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outcome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      P&L
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((bet, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {bet.contract_title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bet.position === 'yes' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {bet.position.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bet.amount} coins
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bet.outcome === 'win' 
                            ? 'bg-green-100 text-green-800' 
                            : bet.outcome === 'loss'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bet.outcome}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          bet.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {bet.profit_loss >= 0 ? '+' : ''}{bet.profit_loss.toFixed(0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(bet.bet_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTable 
            data={leaderboard} 
            currentUserId={isCurrentUser ? selectedUser?.id : null} 
          />
        )}
      </div>

      {/* Achievement Notification */}
      {showAchievementNotification && newAchievement && (
        <AchievementNotification
          achievement={newAchievement}
          isVisible={showAchievementNotification}
          onClose={() => {
            setShowAchievementNotification(false);
            setNewAchievement(null);
          }}
        />
      )}
    </div>
  );
}

export default UserProfile;
