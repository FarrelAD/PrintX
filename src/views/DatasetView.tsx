import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '@/lib/db';
import type { ProjectData } from '@/types/project';

export default function DatasetView() {
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
      <div className="flex justify-between items-end mb-8 border-b border-primary pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">Manajemen Dataset</h1>
          <p className="text-secondary text-sm mt-2">Daftar semua data terstruktur dari proyek Anda.</p>
        </div>
      </div>

      <section className="bg-white border border-primary p-0 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center"><span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span></div>
        ) : projectsWithDataset.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container border-b border-primary">
                <tr>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest border-r border-primary/20">Nama Dataset</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest border-r border-primary/20">Kolom (Headers)</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest border-r border-primary/20">Total Baris</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest border-r border-primary/20">Digunakan Di Proyek</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {projectsWithDataset.map((project) => (
                  <tr key={project.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 border-r border-outline-variant font-semibold">
                      {project.dataset?.fileName || 'Dataset Tanpa Nama'}
                    </td>
                    <td className="p-4 border-r border-outline-variant text-sm text-secondary truncate max-w-[200px]">
                      {project.dataset?.headers.join(', ')}
                    </td>
                    <td className="p-4 border-r border-outline-variant text-sm font-mono">
                      {project.dataset?.rows.length}
                    </td>
                    <td className="p-4 border-r border-outline-variant text-sm text-secondary">
                      {project.name || 'Proyek Tanpa Nama'}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => navigate(`/dashboard/project/${project.id}`)}
                        className="text-xs uppercase font-bold tracking-widest text-primary hover:underline flex items-center gap-1"
                      >
                        Buka Proyek <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-dashed border-outline-variant py-20 m-6 flex flex-col items-center justify-center text-secondary opacity-50">
            <span className="material-symbols-outlined text-6xl mb-4">table_chart</span>
            <p className="text-sm font-bold uppercase tracking-widest mb-2">Belum ada dataset</p>
            <p className="text-xs">Buat proyek baru dan unggah data Anda untuk melihatnya di sini.</p>
          </div>
        )}
      </section>
    </>
  );
}
