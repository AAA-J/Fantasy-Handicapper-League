import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

// Number formatting
export const formatNumber = (num, decimals = 0) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(decimals);
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value, decimals = 1) => {
  return (value * 100).toFixed(decimals) + '%';
};

export const formatProbability = (probability, decimals = 1) => {
  return (probability * 100).toFixed(decimals) + '%';
};

// Date formatting
export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, formatString);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return formatDistanceToNow(date, { addSuffix: true });
};

// Text formatting
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Color formatting
export const getProfitColor = (profit) => {
  if (profit > 0) return 'text-green-600';
  if (profit < 0) return 'text-red-600';
  return 'text-gray-600';
};

export const getProfitBgColor = (profit) => {
  if (profit > 0) return 'bg-green-100';
  if (profit < 0) return 'bg-red-100';
  return 'bg-gray-100';
};

export const getStatusColor = (status) => {
  const colors = {
    open: 'text-green-600 bg-green-100',
    closed: 'text-red-600 bg-red-100',
    pending: 'text-yellow-600 bg-yellow-100',
    active: 'text-blue-600 bg-blue-100',
    inactive: 'text-gray-600 bg-gray-100'
  };
  return colors[status] || colors.inactive;
};

// Category formatting
export const formatCategory = (category) => {
  if (!category) return 'General';
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
};

// Price formatting
export const formatPrice = (price, decimals = 3) => {
  if (price === null || price === undefined) return '0.000';
  return parseFloat(price).toFixed(decimals);
};

export const formatOdds = (odds) => {
  if (!odds) return '1.00x';
  return parseFloat(odds).toFixed(2) + 'x';
};

// Volume formatting
export const formatVolume = (volume) => {
  if (!volume) return '0';
  if (volume >= 1000000) {
    return (volume / 1000000).toFixed(1) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'K';
  }
  return volume.toString();
};

// Betting specific formatting
export const formatBetAmount = (amount) => {
  return `${formatNumber(amount)} coins`;
};

export const formatPayout = (payout) => {
  if (payout === null || payout === undefined) return '0 coins';
  return `${formatNumber(payout)} coins`;
};

export const formatProfitLoss = (profitLoss) => {
  if (profitLoss === null || profitLoss === undefined) return '+0';
  const sign = profitLoss >= 0 ? '+' : '';
  return `${sign}${formatNumber(profitLoss)}`;
};

// Time formatting
export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

export const formatTimeRemaining = (endDate) => {
  if (!endDate) return '';
  const now = new Date();
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const diffMs = end.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Ended';
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
  if (diffHours > 0) return `${diffHours}h ${diffMinutes % 60}m`;
  if (diffMinutes > 0) return `${diffMinutes}m ${diffSeconds % 60}s`;
  return `${diffSeconds}s`;
};

// Validation formatting
export const formatValidationError = (error) => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'An error occurred';
};

// URL formatting
export const formatSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

// Address formatting
export const formatAddress = (address) => {
  if (!address) return '';
  return address
    .split(',')
    .map(part => part.trim())
    .join(', ');
};

// Social media formatting
export const formatUsername = (username) => {
  if (!username) return '';
  return username.startsWith('@') ? username : `@${username}`;
};

// Hash formatting
export const formatHash = (hash, length = 8) => {
  if (!hash) return '';
  if (hash.length <= length) return hash;
  return `${hash.substring(0, length)}...`;
};

// ID formatting
export const formatId = (id) => {
  if (!id) return '';
  return `#${id.toString().padStart(6, '0')}`;
};
