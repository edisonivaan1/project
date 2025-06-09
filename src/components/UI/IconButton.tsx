import React, { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'primary',
  size = 'md',
  tooltip,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-2 focus:ring-secondary/50',
    accent: 'bg-accent text-text hover:bg-accent/90 focus:ring-2 focus:ring-accent/50',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary/50',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary/50',
  };
  
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };
  
  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title={tooltip}
      {...props}
    >
      <span className={iconSizeClasses[size]}>{icon}</span>
    </button>
  );
};

export default IconButton;