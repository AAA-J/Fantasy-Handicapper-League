import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedNumber = ({ 
  value, 
  duration = 0.5, 
  format = (val) => val,
  className = '',
  precision = 0,
  prefix = '',
  suffix = '',
  delay = 0
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000
  });
  
  const animatedValue = useTransform(spring, (current) => {
    return format(Number(current.toFixed(precision)));
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      spring.set(value);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [value, spring, delay]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay }}
    >
      {prefix}
      <motion.span>
        {animatedValue}
      </motion.span>
      {suffix}
    </motion.span>
  );
};

// Specific animated number components
export const AnimatedCount = ({ value, className = '', ...props }) => (
  <AnimatedNumber
    value={value}
    format={(val) => Math.round(val).toLocaleString()}
    className={className}
    {...props}
  />
);

export const AnimatedPercentage = ({ value, className = '', precision = 1, ...props }) => (
  <AnimatedNumber
    value={value * 100}
    format={(val) => val.toFixed(precision)}
    suffix="%"
    className={className}
    precision={precision}
    {...props}
  />
);

export const AnimatedCurrency = ({ 
  value, 
  className = '', 
  currency = 'USD',
  precision = 0,
  ...props 
}) => (
  <AnimatedNumber
    value={value}
    format={(val) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      }).format(val);
    }}
    className={className}
    precision={precision}
    {...props}
  />
);

export const AnimatedProfitLoss = ({ 
  value, 
  className = '', 
  showSign = true,
  ...props 
}) => {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <AnimatedNumber
      value={Math.abs(value)}
      format={(val) => {
        const sign = showSign ? (isPositive ? '+' : '-') : '';
        return `${sign}${val.toFixed(0)}`;
      }}
      className={`${className} ${colorClass}`}
      {...props}
    />
  );
};

export const AnimatedCounter = ({ 
  value, 
  className = '',
  duration = 1,
  ...props 
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {count.toLocaleString()}
    </motion.span>
  );
};

export const AnimatedProgress = ({ 
  value, 
  max = 100,
  className = '',
  showPercentage = true,
  ...props 
}) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className={`relative ${className}`} {...props}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <motion.div
          className="absolute -top-6 right-0 text-sm font-medium text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {percentage.toFixed(1)}%
        </motion.div>
      )}
    </div>
  );
};

export const AnimatedStatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  className = '',
  ...props 
}) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };
  
  const changeIcons = {
    positive: '↗',
    negative: '↘',
    neutral: '→'
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <AnimatedCount 
            value={value} 
            className="text-2xl font-bold text-gray-900"
          />
        </div>
        {change !== undefined && (
          <div className={`text-sm font-medium ${changeColors[changeType]}`}>
            <span className="mr-1">{changeIcons[changeType]}</span>
            <AnimatedCount value={Math.abs(change)} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnimatedNumber;
