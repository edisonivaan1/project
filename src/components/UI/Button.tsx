import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';
  
  const variantClasses = {
    primary: 'bg-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.8] text-white border-2 border-black focus:ring-blue-500',
    secondary: 'bg-[rgb(var(--color-secondary-button))] hover:bg-[rgb(var(--color-secondary-button))/0.8] text-[rgb(var(--color-text-white))] border-2 border-black focus:ring-gray-500',
    accent: 'bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent))/0.8] text-[rgb(var(--color-text))] border-2 border-black focus:ring-yellow-500',
    outline: 'border-2 border-[rgb(var(--color-button))] text-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.1] focus:ring-blue-500',
    ghost: 'text-[rgb(var(--color-button))] hover:bg-[rgb(var(--color-button))/0.1] focus:ring-blue-500',
    custom: '', // Variante vacía para permitir estilos personalizados
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      aria-label={props['aria-label']}
      tabIndex={props.disabled ? -1 : 0}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2" aria-hidden="true">{icon}</span>}
    </button>
  );
};

export default Button;