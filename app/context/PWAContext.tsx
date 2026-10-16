import React, { useState, useEffect } from 'react';
import {
  PWAContext,
  type BeforeInstallPromptEvent,
} from './pwaContextInstance';

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handler = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setInstallPrompt(promptEvent);
      setIsInstallable(true);
      console.log('PWA: beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
    }

    setInstallPrompt(null);
  };

  return (
    <PWAContext.Provider value={{ isInstallable, handleInstall }}>
      {children}
    </PWAContext.Provider>
  );
};
