import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[14px]',
    md: 'w-8 h-8 text-[18px]',
    lg: 'w-10 h-10 text-[24px]',
  };

  return (
    <div 
      className={`bg-primary text-on-primary flex items-center justify-center font-heading font-bold shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <span className="leading-none mt-[0.1em]">X</span>
    </div>
  );
};

export default Logo;
