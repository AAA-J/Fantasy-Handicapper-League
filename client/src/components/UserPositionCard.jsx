import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';

function UserPositionCard({ position }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const getPositionColor = (position) => {
    return position === 'yes' 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  };

  const getPositionIcon = (position) => {
    return position === 'yes' 
      ? <TrendingUp className="w-4 h-4" />
      : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className={`border rounded-lg p-4 ${getPositionColor(position.position)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getPositionIcon(position.position)}
          <span className="font-semibold text-sm uppercase">
            {position.position}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(position.bet_date)} {formatTime(position.bet_date)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600 mb-1">Amount Invested</div>
          <div className="font-semibold">{position.amount} coins</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Shares Owned</div>
          <div className="font-semibold">{position.shares.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Purchase Price</div>
          <div className="font-semibold">{position.purchase_price.toFixed(3)}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Potential Payout</div>
          <div className="font-semibold text-green-600">
            {position.potential_payout.toFixed(0)} coins
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-current border-opacity-20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Potential Profit:</span>
          <span className="font-semibold">
            +{(position.potential_payout - position.amount).toFixed(0)} coins
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserPositionCard;
