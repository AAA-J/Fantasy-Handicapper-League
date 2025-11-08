import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Target, 
  TrendingUp,
  Filter,
  Search,
  Star,
  Award,
  Crown,
  Zap
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { gamificationAPI } from '../services/api';
import TournamentCard from '../components/competitions/TournamentCard';
import WeeklyChallenge from '../components/competitions/WeeklyChallenge';
import LeaderboardTable from '../components/competitions/LeaderboardTable';

function Competitions() {
  const { selectedUser } = useUser();
  const [activeTab, setActiveTab] = useState('tournaments');
  const [loading, setLoading] = useState(true);
  
  // Tournaments
  const [tournaments, setTournaments] = useState([]);
  const [userTournaments, setUserTournaments] = useState([]);
  
  // Weekly Challenges
  const [weeklyChallenges, setWeeklyChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  
  // Leaderboards
  const [leaderboards, setLeaderboards] = useState({
    'all-time': [],
    'monthly': [],
    'weekly': [],
    'daily': []
  });
  const [currentLeaderboard, setCurrentLeaderboard] = useState('all-time');
  const [currentCategory, setCurrentCategory] = useState('all');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadCompetitionData();
  }, []);

  const loadCompetitionData = async () => {
    try {
      setLoading(true);
      
      // Load tournaments, challenges, and leaderboards
      const [tournamentsResponse, challengesResponse, leaderboardResponse] = await Promise.allSettled([
        gamificationAPI.getTournaments(),
        gamificationAPI.getWeeklyChallenges(),
        gamificationAPI.getLeaderboard('all-time', 'all', 50)
      ]);
      
      if (tournamentsResponse.status === 'fulfilled') {
        setTournaments(tournamentsResponse.value.data);
      } else {
        console.error('Failed to load tournaments:', tournamentsResponse.reason);
        setTournaments([]);
      }
      
      if (challengesResponse.status === 'fulfilled') {
        setWeeklyChallenges(challengesResponse.value.data);
      } else {
        console.error('Failed to load challenges:', challengesResponse.reason);
        setWeeklyChallenges([]);
      }
      
      if (leaderboardResponse.status === 'fulfilled') {
        setLeaderboards(prev => ({
          ...prev,
          'all-time': leaderboardResponse.value.data
        }));
      } else {
        console.error('Failed to load leaderboard:', leaderboardResponse.reason);
        setLeaderboards(prev => ({
          ...prev,
          'all-time': []
        }));
      }
      
      // Load user's tournament and challenge participation
      if (selectedUser) {
        try {
          const [userTournamentsResponse, userChallengesResponse] = await Promise.allSettled([
            gamificationAPI.getUserTournaments(selectedUser.id),
            gamificationAPI.getUserChallenges(selectedUser.id)
          ]);
          
          if (userTournamentsResponse.status === 'fulfilled') {
            setUserTournaments(userTournamentsResponse.value.data);
          } else {
            console.error('Failed to load user tournaments:', userTournamentsResponse.reason);
            setUserTournaments([]);
          }
          
          if (userChallengesResponse.status === 'fulfilled') {
            setUserChallenges(userChallengesResponse.value.data);
          } else {
            console.error('Failed to load user challenges:', userChallengesResponse.reason);
            setUserChallenges([]);
          }
        } catch (error) {
          console.error('Error loading user participation data:', error);
          setUserTournaments([]);
          setUserChallenges([]);
        }
      }
    } catch (error) {
      console.error('Error loading competition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTournament = async (tournamentId) => {
    try {
      await gamificationAPI.joinTournament(tournamentId, selectedUser.id);
      loadCompetitionData(); // Refresh data
    } catch (error) {
      console.error('Error joining tournament:', error);
    }
  };

  const handleLeaveTournament = async (tournamentId) => {
    try {
      await gamificationAPI.leaveTournament(tournamentId, selectedUser.id);
      loadCompetitionData(); // Refresh data
    } catch (error) {
      console.error('Error leaving tournament:', error);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await gamificationAPI.joinChallenge(challengeId, selectedUser.id);
      loadCompetitionData(); // Refresh data
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    try {
      await gamificationAPI.leaveChallenge(challengeId, selectedUser.id);
      loadCompetitionData(); // Refresh data
    } catch (error) {
      console.error('Error leaving challenge:', error);
    }
  };

  const loadLeaderboard = async (timeframe, category) => {
    try {
      const response = await gamificationAPI.getLeaderboard(timeframe, category, 50);
      setLeaderboards(prev => ({
        ...prev,
        [timeframe]: response.data
      }));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredChallenges = weeklyChallenges.filter(challenge => {
    const matchesSearch = challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading competitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitions</h1>
        <p className="text-gray-600">Compete in tournaments, complete weekly challenges, and climb the leaderboards</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'tournaments', name: 'Tournaments', icon: Trophy },
            { id: 'challenges', name: 'Weekly Challenges', icon: Target },
            { id: 'leaderboards', name: 'Leaderboards', icon: TrendingUp }
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
        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <div>
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tournaments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament, index) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TournamentCard
                    tournament={tournament}
                    currentUserId={selectedUser?.id}
                    onJoin={handleJoinTournament}
                    onLeave={handleLeaveTournament}
                    isParticipating={userTournaments.some(ut => ut.tournament_id === tournament.id)}
                    userRank={userTournaments.find(ut => ut.tournament_id === tournament.id)?.rank}
                    userProfit={userTournaments.find(ut => ut.tournament_id === tournament.id)?.profit}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Challenges Tab */}
        {activeTab === 'challenges' && (
          <div>
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search challenges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <WeeklyChallenge
                    challenge={challenge}
                    currentUserId={selectedUser?.id}
                    onJoin={handleJoinChallenge}
                    onLeave={handleLeaveChallenge}
                    isParticipating={userChallenges.some(uc => uc.challenge_id === challenge.id)}
                    userStats={userChallenges.find(uc => uc.challenge_id === challenge.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboards Tab */}
        {activeTab === 'leaderboards' && (
          <div>
            {/* Leaderboard Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <select
                    value={currentLeaderboard}
                    onChange={(e) => {
                      setCurrentLeaderboard(e.target.value);
                      loadLeaderboard(e.target.value, currentCategory);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all-time">All Time</option>
                    <option value="monthly">This Month</option>
                    <option value="weekly">This Week</option>
                    <option value="daily">Today</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <select
                    value={currentCategory}
                    onChange={(e) => {
                      setCurrentCategory(e.target.value);
                      loadLeaderboard(currentLeaderboard, e.target.value);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="sports">Sports</option>
                    <option value="finance">Finance</option>
                    <option value="politics">Politics</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="crypto">Crypto</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leaderboard Table */}
            <LeaderboardTable
              leaderboard={leaderboards[currentLeaderboard] || []}
              currentUserId={selectedUser?.id}
              timeframe={currentLeaderboard}
              category={currentCategory}
              showTier={true}
              showStreak={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Competitions;
