import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, Check, Loader } from 'lucide-react';

const FollowButton = ({ 
  userId,
  isFollowing = false,
  onFollow = null,
  onUnfollow = null,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow?.(userId);
      } else {
        await onFollow?.(userId);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getVariantClasses = () => {
    const baseClasses = 'rounded-lg font-medium transition-all duration-200 flex items-center gap-2';
    
    switch (variant) {
      case 'outline':
        return `${baseClasses} ${
          isFollowing 
            ? 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50' 
            : 'border-blue-500 text-blue-500 hover:bg-blue-50'
        }`;
      case 'ghost':
        return `${baseClasses} ${
          isFollowing 
            ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
        }`;
      case 'minimal':
        return `${baseClasses} ${
          isFollowing 
            ? 'text-gray-500 hover:text-gray-700' 
            : 'text-blue-500 hover:text-blue-700'
        }`;
      default:
        return `${baseClasses} ${
          isFollowing 
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`;
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        ${getVariantClasses()}
        ${sizeClasses[size]}
        ${className}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={!isLoading ? { scale: 1.05 } : {}}
      whileTap={!isLoading ? { scale: 0.95 } : {}}
    >
      {isLoading ? (
        <Loader className={`${iconSizes[size]} animate-spin`} />
      ) : isFollowing ? (
        <>
          <UserMinus className={iconSizes[size]} />
          <span>Unfollow</span>
        </>
      ) : (
        <>
          <UserPlus className={iconSizes[size]} />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
};

export default FollowButton;
