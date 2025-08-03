import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  showPercentage = false,
  size = 'md',
  color = 'primary',
  label,
  className = '',
}) => {
  const percentage = Math.round((value / max) * 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };
  
  const colorClasses = {
    primary: 'bg-[rgb(var(--color-primary))]',
    secondary: 'bg-[rgb(var(--color-secondary))]',
    success: 'bg-[rgb(var(--color-success))]',
    warning: 'bg-[rgb(var(--color-warning))]',
    error: 'bg-[rgb(var(--color-error))]',
  };
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-500">{percentage}%</span>
          )}
        </div>
      )}
      <div 
        className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${percentage} percent complete`}
      >
        <div
          className={`${colorClasses[color]} rounded-full transition-all duration-500 ease-out ${sizeClasses[size]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!label && showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-sm font-medium text-gray-500">{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;