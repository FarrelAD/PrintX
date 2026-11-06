import React, { useEffect } from 'react';
import { cn } from '@/lib/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          'bg-white border-2 border-primary brutalist-shadow p-6 md:p-8 w-full max-w-md relative animate-in zoom-in-95 duration-150',
          className,
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors cursor-pointer"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        {title && (
          <h3 className="text-3xl md:text-4xl font-heading mb-6 uppercase tracking-tighter leading-none">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}
