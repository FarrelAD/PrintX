import { useContext } from 'react';
import { PWAContext } from '@/context/pwaContextInstance';

export const usePWAInstall = () => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWAInstall must be used within a PWAProvider');
  }
  return context;
};
