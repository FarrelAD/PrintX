import React from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, icon, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-[10px] font-bold uppercase tracking-widest text-secondary block"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 text-secondary text-lg pointer-events-none">
              {icon}
            </span>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              'w-full bg-white border border-primary p-3 text-sm font-body text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20',
              icon && 'pl-10',
              error && 'border-error focus:ring-error/20',
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-[11px] text-error font-semibold">{error}</span>
        )}
        {!error && helperText && (
          <span className="text-[11px] text-secondary">{helperText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
