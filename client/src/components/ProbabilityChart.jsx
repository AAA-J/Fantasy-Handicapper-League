import React from 'react';

function ProbabilityChart({ probability, size = 'md' }) {
  const percentage = Math.round(probability * 100);
  const isYes = percentage >= 50;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      {/* Circular Progress Background */}
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 40}`}
          strokeDashoffset={`${2 * Math.PI * 40 * (1 - probability)}`}
          className={`transition-all duration-500 ${
            isYes ? 'text-green-500' : 'text-red-500'
          }`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`font-bold ${textSizeClasses[size]} ${
          isYes ? 'text-green-600' : 'text-red-600'
        }`}>
          {percentage}%
        </div>
        <div className={`text-xs ${
          isYes ? 'text-green-500' : 'text-red-500'
        }`}>
          {isYes ? 'YES' : 'NO'}
        </div>
      </div>
    </div>
  );
}

export default ProbabilityChart;
