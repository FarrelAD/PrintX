import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => i18n.changeLanguage('id')}
        className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition-all ${
          i18n.language === 'id'
            ? 'bg-primary text-white'
            : 'text-secondary hover:text-primary'
        }`}
      >
        ID
      </button>
      <div className="w-px h-3 bg-outline-variant mx-0.5"></div>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition-all ${
          i18n.language === 'en'
            ? 'bg-primary text-white'
            : 'text-secondary hover:text-primary'
        }`}
      >
        EN
      </button>
    </div>
  );
}
