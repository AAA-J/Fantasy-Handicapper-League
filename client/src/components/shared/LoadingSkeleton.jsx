import React from 'react';
import { motion } from 'framer-motion';

const SkeletonBox = ({ className = '', animate = true }) => {
  const baseClasses = 'bg-gray-200 rounded';
  
  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }
  
  return <div className={`${baseClasses} ${className}`} />;
};

// Contract Card Skeleton
export const ContractCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
    {/* Header */}
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <SkeletonBox className="w-8 h-8 rounded-full" />
          <SkeletonBox className="h-6 w-3/4" />
          <SkeletonBox className="h-4 w-16" />
        </div>
        <SkeletonBox className="h-4 w-full mb-2" />
        <SkeletonBox className="h-3 w-2/3" />
      </div>
      <SkeletonBox className="h-6 w-16 rounded-full" />
    </div>

    {/* Probability Display */}
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-6">
          <SkeletonBox className="w-16 h-16 rounded-full" />
          <div className="flex space-x-8">
            <div className="text-center">
              <SkeletonBox className="h-8 w-16 mb-1" />
              <SkeletonBox className="h-4 w-8 mb-1" />
              <SkeletonBox className="h-3 w-12" />
            </div>
            <div className="text-center">
              <SkeletonBox className="h-8 w-16 mb-1" />
              <SkeletonBox className="h-4 w-8 mb-1" />
              <SkeletonBox className="h-3 w-12" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Bet Buttons */}
      <div className="flex space-x-3">
        <SkeletonBox className="flex-1 h-12 rounded-lg" />
        <SkeletonBox className="flex-1 h-12 rounded-lg" />
      </div>
    </div>

    {/* Market Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="text-center">
          <SkeletonBox className="h-4 w-16 mx-auto mb-1" />
          <SkeletonBox className="h-6 w-12 mx-auto" />
        </div>
      ))}
    </div>

    {/* Action Button */}
    <div className="flex justify-end">
      <SkeletonBox className="h-10 w-20 rounded-lg" />
    </div>
  </div>
);

// List Item Skeleton
export const ListItemSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <SkeletonBox className="w-8 h-8 rounded-full" />
        <div>
          <SkeletonBox className="h-4 w-32 mb-1" />
          <SkeletonBox className="h-3 w-24" />
        </div>
      </div>
      <div className="text-right">
        <SkeletonBox className="h-4 w-16 mb-1" />
        <SkeletonBox className="h-3 w-12" />
      </div>
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="bg-white">
    {[...Array(columns)].map((_, i) => (
      <td key={i} className="px-6 py-4 whitespace-nowrap">
        <SkeletonBox className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Chart Skeleton
export const ChartSkeleton = ({ height = 200 }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <SkeletonBox className="h-6 w-32" />
      <SkeletonBox className="h-4 w-20" />
    </div>
    <SkeletonBox className={`w-full rounded-lg`} style={{ height: `${height}px` }} />
  </div>
);

// Profile Stats Skeleton
export const ProfileStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <SkeletonBox className="h-8 w-8 rounded-full" />
          </div>
          <div className="ml-4">
            <SkeletonBox className="h-4 w-20 mb-2" />
            <SkeletonBox className="h-6 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Leaderboard Skeleton
export const LeaderboardSkeleton = ({ rows = 10 }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="px-6 py-3 bg-gray-50 border-b">
      <SkeletonBox className="h-4 w-32" />
    </div>
    <div className="divide-y divide-gray-200">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SkeletonBox className="h-6 w-6 rounded-full" />
            <SkeletonBox className="h-4 w-24" />
          </div>
          <div className="text-right">
            <SkeletonBox className="h-4 w-16 mb-1" />
            <SkeletonBox className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Modal Skeleton
export const ModalSkeleton = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
      <div className="flex items-center justify-between p-6 border-b">
        <SkeletonBox className="h-6 w-32" />
        <SkeletonBox className="w-6 h-6 rounded" />
      </div>
      <div className="p-6">
        <SkeletonBox className="h-6 w-full mb-4" />
        <SkeletonBox className="h-4 w-3/4 mb-6" />
        <div className="space-y-4">
          <SkeletonBox className="h-12 w-full rounded-lg" />
          <SkeletonBox className="h-12 w-full rounded-lg" />
          <SkeletonBox className="h-12 w-full rounded-lg" />
        </div>
        <div className="flex space-x-3 mt-6">
          <SkeletonBox className="flex-1 h-10 rounded-lg" />
          <SkeletonBox className="flex-1 h-10 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

// Generic Skeleton
export const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  rounded = true 
}) => (
  <SkeletonBox 
    className={`${rounded ? 'rounded' : ''} ${className}`}
    style={{ width, height }}
  />
);

export default Skeleton;
