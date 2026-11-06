import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'draft' | 'ready' | 'printed' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-primary text-white border-primary',
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-800',
    ready: 'bg-green-100 text-green-800 border-green-800',
    printed: 'bg-blue-100 text-blue-800 border-blue-800',
    outline: 'bg-white text-primary border-primary',
  };

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5 tracking-wider',
    md: 'text-[11px] px-3 py-1 tracking-widest',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold uppercase border',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
