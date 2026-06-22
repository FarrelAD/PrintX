import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllProjects } from '@/lib/db';
import type { ProjectData } from '@/types/project';

export default function DatasetView() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  async function loadProjects() {
    try {
      const data = await getAllProjects();
      setProjects(data.reverse());
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => loadProjects());
  }, []);

  const projectsWithDataset = projects.filter(p => p.dataset && p.dataset.rows.length > 0);

  return (
    <>
      <title>{t('nav.dataset')} | PrintX</title>
      <div className="flex justify-between items-end mb-8 border-b border-primary pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">{t('datasets.title')}</h1>
          <p className="text-secondary text-sm mt-2">{t('datasets.desc')}</p>
        </div>
      </div>

      <section className="bg-white border border-primary p-0 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center"><span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span></div>
        ) : projectsWithDataset.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container border-b border-primary">
                  <tr>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest border-r border-primary/20">{t('datasets.table.name')}</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest border-r border-primary/20">{t('datasets.table.columns')}</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest border-r border-primary/20">{t('datasets.table.total_rows')}</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest border-r border-primary/20">{t('datasets.table.project')}</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest">{t('datasets.table.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsWithDataset.map((project) => (
                    <tr key={project.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                      <td className="p-4 border-r border-outline-variant font-semibold">
                        {project.dataset?.fileName || t('datasets.table.untitled')}
                      </td>
                      <td className="p-4 border-r border-outline-variant text-sm text-secondary truncate max-w-[200px]">
                        {project.dataset?.headers.join(', ')}
                      </td>
                      <td className="p-4 border-r border-outline-variant text-sm font-mono">
                        {project.dataset?.rows.length}
                      </td>
                      <td className="p-4 border-r border-outline-variant text-sm text-secondary">
                        {project.name || t('projects.untitled')}
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => navigate(`/dashboard/project/${project.id}`)}
                          className="text-xs uppercase font-bold tracking-widest text-primary hover:underline flex items-center gap-1"
                        >
                          {t('datasets.table.open')} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col">
              {projectsWithDataset.map((project) => (
                <div key={project.id} className="border-b border-primary p-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-bold text-lg leading-tight truncate">
                        {project.dataset?.fileName || t('datasets.table.untitled')}
                      </h3>
                      <p className="text-xs text-secondary uppercase tracking-wider mt-1">
                        {project.name || t('projects.untitled')}
                      </p>
                    </div>
                    <div className="bg-primary text-white px-2 py-1 text-[10px] font-mono">
                      {t('datasets.table.rows_count', { count: project.dataset?.rows.length })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-1">{t('datasets.table.columns_label')}</span>
                      <div className="flex flex-wrap gap-1">
                        {project.dataset?.headers.slice(0, 5).map((header, idx) => (
                          <span key={idx} className="text-[10px] bg-surface-container px-1.5 py-0.5 border border-outline-variant">
                            {header}
                          </span>
                        ))}
                        {project.dataset?.headers && project.dataset.headers.length > 5 && (
                          <span className="text-[10px] text-secondary self-center px-1">
                            {t('datasets.table.others', { count: project.dataset.headers.length - 5 })}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/dashboard/project/${project.id}`)}
                      className="w-full bg-primary text-white py-3 text-xs uppercase font-bold tracking-widest flex justify-center items-center gap-2 hover:bg-neutral-800 transition-colors"
                    >
                      {t('datasets.table.open')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="border border-dashed border-outline-variant py-20 m-6 flex flex-col items-center justify-center text-secondary opacity-50">
            <span className="material-symbols-outlined text-6xl mb-4">table_chart</span>
            <p className="text-sm font-bold uppercase tracking-widest mb-2">{t('datasets.empty.title')}</p>
            <p className="text-xs">{t('datasets.empty.desc')}</p>
          </div>
        )}
      </section>
    </>
  );
}
