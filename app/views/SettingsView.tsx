import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDB } from '@/lib/db';

export default function SettingsView() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClearData = async () => {
    const isConfirmed = window.confirm(t('settings.data.confirm_clear'));

    if (isConfirmed) {
      try {
        const db = await getDB();
        await db.clear('projects');
        alert(t('settings.data.success_clear'));
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to clear data:', err);
        alert(t('settings.data.error_clear'));
      }
    }
  };

  return (
    <>
      <title>{t('nav.settings')} | PrintX</title>
      <div className="flex justify-between items-end mb-8 border-b border-primary pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">
            {t('settings.title')}
          </h1>
          <p className="text-secondary text-sm mt-2">{t('settings.desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="border border-primary bg-white p-6 md:p-8">
          <h2 className="text-xl font-heading uppercase mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">storage</span>
            {t('settings.data.title')}
          </h2>
          <p className="text-sm text-secondary mb-6">
            {t('settings.data.desc')}
          </p>

          <div className="border border-error/30 bg-error/5 p-4 md:p-6 mt-8">
            <h3 className="text-error font-bold uppercase tracking-widest text-xs mb-2">
              {t('settings.data.danger_zone')}
            </h3>
            <p className="text-xs text-secondary mb-4">
              {t('settings.data.danger_desc')}
            </p>
            <button
              onClick={handleClearData}
              className="bg-error text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">
                delete_forever
              </span>
              {t('settings.data.clear_button')}
            </button>
          </div>
        </section>

        <section className="border border-primary bg-white p-6 md:p-8">
          <h2 className="text-xl font-heading uppercase mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            {t('settings.info.title')}
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-secondary">
                {t('settings.info.version')}
              </span>
              <span className="font-mono text-sm bg-surface-container px-2 py-1">
                1.0.0-beta
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-secondary">
                {t('settings.info.license')}
              </span>
              <span className="font-mono text-sm text-primary">MIT</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-secondary">
                {t('settings.info.architecture')}
              </span>
              <span className="font-mono text-sm text-secondary">
                PWA / Local-First
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
