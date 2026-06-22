import React, { createContext, useContext, useState, useEffect } from 'react';

type PWAContextType = {
  isInstallable: boolean;
  handleInstall: () => Promise<void>;
};

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
      console.log('PWA: beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

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

export const usePWAInstall = () => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWAInstall must be used within a PWAProvider');
  }
  return context;
};
