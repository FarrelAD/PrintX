import React from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  brutalist?: boolean;
}

export function Card({
  className,
  brutalist = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-primary p-6 transition-all',
        brutalist && 'brutalist-shadow',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
