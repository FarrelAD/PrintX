import { useNavigate, useLoaderData } from 'react-router';
import type { MetaFunction, ClientLoaderFunctionArgs } from 'react-router';
import { useTranslation } from 'react-i18next';
import WizardShell from '@/features/wizard/WizardShell';
import { getProject, saveProject } from '@/lib/db';
import type { ProjectData } from '@/types/project';

export const meta: MetaFunction = () => {
  return [
    { title: 'Project Wizard | PrintX' },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
};

export async function clientLoader({
  params,
  request,
}: ClientLoaderFunctionArgs) {
  const id = params.id;
  if (id && id !== 'new') {
    try {
      const project = await getProject(id);
      return {
        project: project ?? null,
        notFound: !project,
      };
    } catch (err) {
      console.error(err);
      return {
        project: null,
        notFound: true,
      };
    }
  }

  const url = new URL(request.url);
  const name = url.searchParams.get('name')?.trim();
  if (name) {
    try {
      const saved = await saveProject({
        name,
        type: null,
        status: 'draft',
      });
      return {
        project: saved,
        notFound: false,
      };
    } catch (err) {
      console.error('Failed to initialize named project:', err);
      return {
        project: { name, type: null, status: 'draft' } as ProjectData,
        notFound: false,
      };
    }
  }

  return {
    project: null,
    notFound: false,
  };
}

export function HydrateFallback() {
  return (
    <div className="py-20 flex justify-center">
      <span className="material-symbols-outlined animate-spin text-4xl text-primary">
        autorenew
      </span>
    </div>
  );
}

export default function ProjectWizardView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof clientLoader>();
  const initialData = loaderData?.project;
  const notFound = loaderData?.notFound;

  if (notFound) {
    return (
      <div className="py-20 flex flex-col items-center text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">
          error
        </span>
        <h2 className="text-2xl font-heading mb-2">
          {t('common.error.project_not_found')}
        </h2>
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
    <div className="max-w-full mx-auto pb-10">
      <WizardShell
        key={initialData?.id || 'new'}
        initialData={initialData}
        onClose={() => navigate('/dashboard')}
      />
    </div>
  );
}
