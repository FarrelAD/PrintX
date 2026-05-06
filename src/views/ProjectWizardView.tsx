import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WizardShell from '@/features/wizard/WizardShell';
import { getProject } from '@/lib/db';
import type { ProjectData } from '@/types/project';

export default function ProjectWizardView() {
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
          setError('Proyek tidak ditemukan.');
          setInitialData(null);
        }
      }).catch(err => {
        console.error(err);
        setError('Gagal memuat proyek.');
        setInitialData(null);
      });
    } else {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');
      Promise.resolve().then(() => setInitialData(name ? { name, type: null } as any : null)); // 'new' project with name
    }
  }, [id]);

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
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto pb-10">
      <WizardShell 
        initialData={initialData} 
        onClose={() => navigate('/dashboard')} 
      />
    </div>
  );
}
