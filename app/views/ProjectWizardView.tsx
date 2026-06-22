import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WizardShell from '@/features/wizard/WizardShell';
import { getProject } from '@/lib/db';
import type { ProjectData } from '@/types/project';

export default function ProjectWizardView() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<ProjectData | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      getProject(id).then(project => {
        if (project) {
          setInitialData(project);
        } else {
          setError(t('common.error.project_not_found'));
          setInitialData(null);
        }
      }).catch(err => {
        console.error(err);
        setError(t('common.error.failed_load_project'));
        setInitialData(null);
      });
    } else {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');
      Promise.resolve().then(() => setInitialData(name ? { name, type: null } as any : null)); // 'new' project with name
    }
  }, [id, t]);

  if (initialData === undefined) {
    return <div className="py-20 flex justify-center"><span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span></div>;
  }

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <h2 className="text-2xl font-heading mb-2">{error}</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-xs font-bold uppercase tracking-widest text-primary border-b border-primary"
        >
          {t('common.error.back_to_dashboard')}
        </button>
      </div>
    );
  }

  return (
    <>
      <title>{initialData?.name || t('wizard.project')} | PrintX</title>
      <div className="max-w-full mx-auto pb-10">
        <WizardShell 
          initialData={initialData} 
          onClose={() => navigate('/dashboard')} 
        />
      </div>
    </>
  );
}
