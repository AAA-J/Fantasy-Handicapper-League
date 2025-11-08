import React from 'react';
import { Trophy, TrendingUp, Target, DollarSign } from 'lucide-react';

function LeaderboardTable({ data, currentUserId }) {
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Trophy className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-gray-500 font-medium">{index + 1}</span>;
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
        <p className="text-sm text-gray-600">Top performers by profit</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Profit
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Win Rate
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Volume
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bets
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((user, index) => (
              <tr 
                key={user.id}
                className={`${
                  user.id === currentUserId 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getRankIcon(index)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                    {user.id === currentUserId && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    user.total_profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.total_profit >= 0 ? '+' : ''}{formatNumber(user.total_profit)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatPercentage(user.win_rate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatNumber(user.total_volume)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.total_bets}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}

export default LeaderboardTable;
