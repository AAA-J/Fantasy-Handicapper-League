import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  Trophy, 
  Search, 
  Filter,
  TrendingUp,
  Star,
  UserPlus
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { gamificationAPI } from '../services/api';
import UserCard from '../components/social/UserCard';
import ActivityFeed from '../components/social/ActivityFeed';
import ChallengeCard from '../components/social/ChallengeCard';
import FollowButton from '../components/social/FollowButton';

function Social() {
  const { selectedUser } = useUser();
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  
  // Discover users
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  
  // Activity feed
  const [activities, setActivities] = useState([]);
  const [hasMoreActivities, setHasMoreActivities] = useState(false);
  
  // Challenges
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      setLoading(true);
      
      // Load users, following, followers, activities, and challenges
      const [usersResponse, followingResponse, followersResponse, activitiesResponse, challengesResponse] = await Promise.all([
        gamificationAPI.getLeaderboard('all-time', 'all', 50),
        selectedUser ? gamificationAPI.getFollowing(selectedUser.id) : Promise.resolve({ data: [] }),
        selectedUser ? gamificationAPI.getFollowers(selectedUser.id) : Promise.resolve({ data: [] }),
        selectedUser ? gamificationAPI.getActivityFeed(selectedUser.id, 20) : Promise.resolve({ data: [] }),
        gamificationAPI.getChallenges()
      ]);
      
      setUsers(usersResponse.data);
      setFollowing(followingResponse.data);
      setFollowers(followersResponse.data);
      setActivities(activitiesResponse.data);
      setChallenges(challengesResponse.data);
      
      // Load user's challenges
      if (selectedUser) {
        const userChallengesResponse = await gamificationAPI.getUserChallenges(selectedUser.id);
        setUserChallenges(userChallengesResponse.data);
      }
      
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await gamificationAPI.followUser(userId, selectedUser.id);
      setFollowing(prev => [...prev, { id: userId }]);
      loadSocialData(); // Refresh data
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await gamificationAPI.unfollowUser(userId, selectedUser.id);
      setFollowing(prev => prev.filter(user => user.id !== userId));
      loadSocialData(); // Refresh data
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await gamificationAPI.joinChallenge(challengeId, selectedUser.id);
      loadSocialData(); // Refresh data
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    try {
      await gamificationAPI.leaveChallenge(challengeId, selectedUser.id);
      loadSocialData(); // Refresh data
    } catch (error) {
      console.error('Error leaving challenge:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    return user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'rank':
        return (a.global_rank || 999) - (b.global_rank || 999);
      case 'profit':
        return (b.total_profit || 0) - (a.total_profit || 0);
      case 'followers':
        return (b.followers_count || 0) - (a.followers_count || 0);
      case 'win_rate':
        return (b.win_rate || 0) - (a.win_rate || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading social features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Hub</h1>
        <p className="text-gray-600">Connect with other handicappers, follow top performers, and join challenges</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'discover', name: 'Discover', icon: Users },
            { id: 'following', name: 'Following', icon: UserPlus },
            { id: 'activity', name: 'Activity', icon: Activity },
            { id: 'challenges', name: 'Challenges', icon: Trophy }
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
        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search handicappers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="rank">Rank</option>
                    <option value="profit">Profit</option>
                    <option value="followers">Followers</option>
                    <option value="win_rate">Win Rate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <UserCard
                    user={user}
                    currentUserId={selectedUser?.id}
                    isFollowing={following.some(f => f.id === user.id)}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                    showStats={true}
                    size="md"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Following ({following.length})</h2>
              <p className="text-gray-600">Handicappers you're following</p>
            </div>
            
            {following.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Not following anyone yet</h3>
                <p className="text-gray-500 mb-4">Discover top handicappers and follow them to see their activity</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Discover Users
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {following.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <UserCard
                      user={user}
                      currentUserId={selectedUser?.id}
                      isFollowing={true}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                      showStats={true}
                      size="md"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <ActivityFeed
            activities={activities}
            currentUserId={selectedUser?.id}
            onLoadMore={() => {
              // Load more activities
              console.log('Load more activities');
            }}
            hasMore={hasMoreActivities}
            loading={false}
          />
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Challenges & Tournaments</h2>
              <p className="text-gray-600">Compete with other handicappers for prizes and glory</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ChallengeCard
                    challenge={challenge}
                    currentUserId={selectedUser?.id}
                    onJoin={handleJoinChallenge}
                    onLeave={handleLeaveChallenge}
                    isParticipating={userChallenges.some(uc => uc.challenge_id === challenge.id)}
                    userRank={userChallenges.find(uc => uc.challenge_id === challenge.id)?.rank}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Social;
