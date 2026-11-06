import React from 'react';
import { cn } from '@/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: string;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold uppercase tracking-widest transition-all cursor-pointer select-none active:scale-95 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary:
        'bg-primary text-on-primary border border-primary hover:bg-on-primary hover:text-primary',
      outline:
        'bg-white text-primary border border-primary hover:bg-surface-container',
      danger: 'bg-error text-white border border-error hover:opacity-90',
      ghost:
        'text-primary hover:bg-surface-container border border-transparent',
      link: 'text-primary border-b border-primary hover:text-secondary p-0 tracking-widest',
    };

    const sizes = {
      sm: 'text-[10px] py-1.5 px-3 gap-1.5',
      md: 'text-xs md:text-sm py-2.5 px-5 gap-2',
      lg: 'text-sm md:text-base py-4 px-8 gap-3',
      icon: 'w-8 h-8 p-0 text-sm shrink-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="material-symbols-outlined animate-spin text-sm">
            autorenew
          </span>
        )}
        {!isLoading && icon && (
          <span className="material-symbols-outlined text-sm">{icon}</span>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
