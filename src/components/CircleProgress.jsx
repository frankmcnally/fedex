
import React from 'react';
import { motion } from 'framer-motion';

const CircleProgress = ({ 
  percentage = 0, 
  size = 120, 
  primaryColor = '#4d148c',
  icon: Icon,
  label
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        
        {/* Percentage Text in Center */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <motion.span 
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            key={percentage} // Animate when percentage changes
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      </div>
      {/* Label below */}
      {label && (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">{label}</div>
        </div>
      )}
    </div>
  );
};

export default CircleProgress;
