import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  role?: string;
  'aria-label'?: string;
  'aria-disabled'?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
  tabIndex,
  onKeyDown,
  role,
  ...props
}) => {
  const hoverClasses = hoverEffect 
    ? 'transition-transform duration-300 hover:translate-y-[-4px]' 
    : '';
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden ${hoverClasses} ${className}`}
      onClick={onClick}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      role={role}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div 
      className={`p-6 border-b border-gray-100 ${className} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
      tabIndex={0}
      role="region"
      aria-label="Card header section"
    >
      {children}
    </div>
  );
};

export const CardBody: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div 
      className={`p-6 ${className} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
      tabIndex={0}
      role="region"
      aria-label="Card body section"
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div 
      className={`p-6 border-t border-gray-100 ${className} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
      tabIndex={0}
      role="region"
      aria-label="Card footer section"
    >
      {children}
    </div>
  );
};

export default Card;