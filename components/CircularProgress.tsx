import React from 'react';

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Center point
  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* SVG for the circular progress */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" /> {/* Purple */}
            <stop offset="100%" stopColor="#06B6D4" /> {/* Cyan */}
          </linearGradient>
        </defs>

        {/* Background circle (track) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-700/50"
        />

        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 0.3s ease-out',
          }}
        />
      </svg>

      {/* Percentage text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
