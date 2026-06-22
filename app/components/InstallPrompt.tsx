import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '@/context/PWAContext';

export default function InstallPrompt({ variant = 'sidebar', className = '' }: {
  variant?: 'sidebar' | 'compact' | 'landing';
  className?: string;
}) {
  const { t } = useTranslation();
  const { isInstallable, handleInstall } = usePWAInstall();

  if (!isInstallable) return null;

  if (variant === 'compact') {
    const defaultClasses = "bg-white text-primary py-2.5 px-5 text-[10px] border border-primary hover:bg-primary hover:text-white";
    return (
      <button
        onClick={handleInstall}
        className={`flex items-center gap-2 font-bold uppercase tracking-[0.15em] transition-all active:scale-95 shrink-0 ${className || defaultClasses}`}
      >
        <span className="material-symbols-outlined text-[18px]">install_mobile</span>
        <span>{t('pwa.install_app')}</span>
      </button>
    );
  }

  if (variant === 'landing') {
    return (
      <div className="relative overflow-hidden bg-primary text-on-primary p-12 md:p-16 mb-stack-lg flex flex-col md:flex-row items-center justify-between gap-12 group">
        {/* Background Decorative Element */}
        <div className="absolute -right-8 -bottom-12 opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-700">
          <span className="material-symbols-outlined text-[320px] leading-none">
            install_desktop
          </span>
        </div>

        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase mb-6 opacity-60">
            {t('pwa.desktop_edition')}
          </div>
          <h2 className="text-[clamp(32px,5vw,48px)] font-heading leading-tight mb-6">
            {t('pwa.title')}
          </h2>
          <p className="text-sm md:text-base opacity-80 max-w-md leading-relaxed font-medium uppercase tracking-wide">
            {t('pwa.desc')}
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={handleInstall}
            className="bg-white text-primary py-6 px-10 font-bold tracking-[0.2em] uppercase text-sm border-2 border-white hover:bg-transparent hover:text-white transition-all active:scale-95 flex items-center gap-4"
          >
            <span className="material-symbols-outlined">download</span>
            <span>{t('pwa.install_now')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-t border-primary bg-surface-container-low">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-primary animate-pulse"></span>
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-60">{t('pwa.available_desktop')}</span>
        </div>
        
        <h4 className="font-heading font-bold text-base leading-tight uppercase">
          {t('pwa.access_title')}
        </h4>
        
        <p className="text-[10px] text-secondary leading-normal uppercase tracking-wider font-bold">
          {t('pwa.access_desc')}
        </p>
        
        <button
          onClick={handleInstall}
          className="bg-primary text-on-primary py-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-primary border border-primary active:scale-95 flex items-center justify-center gap-3 mt-2"
        >
          <span className="material-symbols-outlined text-sm">install_desktop</span>
          <span>{t('pwa.get_app')}</span>
        </button>
      </div>
    </div>
  );
}
