import React from 'react';
import { 
  FaFootballBall, 
  FaBasketballBall, 
  FaBaseballBall, 
  FaFutbol, 
  FaTrophy, 
  FaChartLine, 
  FaDollarSign, 
  FaCloud, 
  FaLaptop, 
  FaUsers,
  FaGlobe,
  FaBolt
} from 'react-icons/fa';

const SportIcons = {
  // Sports
  football: FaFootballBall,
  basketball: FaBasketballBall,
  baseball: FaBaseballBall,
  soccer: FaFutbol,
  sports: FaTrophy,
  
  // Categories
  general: FaGlobe,
  politics: FaUsers,
  entertainment: FaBolt,
  finance: FaDollarSign,
  weather: FaCloud,
  technology: FaLaptop,
  
  // Special
  all: FaChartLine,
  trending: FaChartLine
};

const CategoryIcons = {
  // Market Contract Categories
  general: { icon: FaGlobe, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  sports: { icon: FaTrophy, color: 'text-green-600', bgColor: 'bg-green-100' },
  politics: { icon: FaUsers, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  entertainment: { icon: FaBolt, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  finance: { icon: FaDollarSign, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  weather: { icon: FaCloud, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  technology: { icon: FaLaptop, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  
  // Fantasy League Categories
  'player-stats': { icon: FaTrophy, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'team-performance': { icon: FaUsers, color: 'text-red-600', bgColor: 'bg-red-100' },
  'game-outcomes': { icon: FaFootballBall, color: 'text-green-600', bgColor: 'bg-green-100' },
  'season-long': { icon: FaChartLine, color: 'text-blue-600', bgColor: 'bg-blue-100' }
};

export const getSportIcon = (category) => {
  return SportIcons[category] || SportIcons.general;
};

export const getCategoryConfig = (category) => {
  return CategoryIcons[category] || CategoryIcons.general;
};

export const IconComponent = ({ category, size = 20, className = '' }) => {
  const Icon = getSportIcon(category);
  return <Icon size={size} className={className} />;
};

export const CategoryIcon = ({ category, size = 20, showBackground = false, className = '' }) => {
  const config = getCategoryConfig(category);
  const Icon = config.icon;
  
  const baseClasses = `inline-flex items-center justify-center ${className}`;
  const iconClasses = `${config.color} ${showBackground ? `p-2 rounded-full ${config.bgColor}` : ''}`;
  
  return (
    <div className={baseClasses}>
      <Icon size={size} className={iconClasses} />
    </div>
  );
};

export default SportIcons;
