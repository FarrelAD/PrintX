import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, deleteProject as dbDeleteProject } from '@/lib/db';
import type { ProjectData } from '@/types/project';

export default function ProjectsView() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  async function loadProjects() {
    try {
      const data = await getAllProjects();
      console.log('ProjectsView: Loaded projects:', data);
      if (!Array.isArray(data)) {
        setProjects([]);
        return;
      }
      setProjects([...data].reverse());
    } catch (err) {
      console.error('ProjectsView: Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    setIsLoading(true);
    await dbDeleteProject(id);
    loadProjects();
  }

  return (
    <>
      <div className="flex justify-between items-end mb-8 border-b border-primary pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">Proyek Saya</h1>
          <p className="text-secondary text-sm mt-2">Kelola semua proyek cetak lokal Anda.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/project/new')}
          className="bg-primary text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-on-primary hover:text-primary border border-primary transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Proyek Baru
        </button>
      </div>

      {/* Navigation & Filter Bar */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-primary/10 pb-6">
        <div className="flex gap-6 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {['Semua', 'Draf', 'Siap Cetak', 'Selesai'].map((tab, i) => (
            <button key={tab} className={`text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all ${i === 0 ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4 w-full md:w-64 border-b border-primary/20 pb-1">
          <span className="material-symbols-outlined text-secondary text-lg">search</span>
          <input type="text" placeholder="Cari proyek..." className="bg-transparent border-none outline-none text-sm w-full font-body" />
        </div>
      </section>

      {/* Project Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16">
        {projects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => navigate(`/dashboard/project/${project.id}`)}
            className="group flex flex-col cursor-pointer"
          >
            <div className="aspect-4/3 bg-surface-container border border-primary relative overflow-hidden mb-6 transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-1 group-hover:-translate-y-1">
              {project.design?.preview ? (
                <img 
                  src={project.design.preview} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  alt={project.name} 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                  <span className="text-[80px] material-symbols-outlined">description</span>
                </div>
              )}
              <div className="absolute top-0 left-0 p-4 flex justify-between w-full items-start">
                <div className="text-[10px] font-mono bg-white border border-primary px-2 py-0.5">ID: {project.id?.slice(0, 8)}</div>
                <button 
                  onClick={(e) => handleDelete(e, project.id!)}
                  className="w-8 h-8 bg-white border border-primary flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              <div className={`absolute bottom-4 right-4 py-1.5 px-4 text-[10px] uppercase font-bold tracking-wider border border-primary ${project.status === 'Siap Cetak' ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                {project.status || 'Draf'}
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl md:text-3xl font-heading leading-tight group-hover:italic transition-all truncate pr-4">{project.name || 'Proyek Tanpa Nama'}</h3>
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity shrink-0">arrow_outward</span>
              </div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-secondary font-bold border-t border-primary/10 pt-3 mt-auto">
                <span>{project.dataset?.rows.length || 0} Salinan</span>
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                <span>{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '-'}</span>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && !isLoading && (
          <div className="col-span-full border-2 border-dashed border-outline-variant py-20 flex flex-col items-center justify-center text-secondary opacity-50">
            <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
            <p className="text-sm font-bold uppercase tracking-widest">Belum ada proyek lokal</p>
          </div>
        )}
        
        {/* Empty State / Call to Action Card */}
        <div 
          onClick={() => navigate('/dashboard/project/new')}
          className="hidden md:flex aspect-4/3 border border-primary border-dashed items-center justify-center flex-col gap-4 cursor-pointer hover:bg-surface-container transition-colors group"
        >
          <span className="material-symbols-outlined text-4xl text-secondary group-hover:scale-110 transition-transform">add_circle</span>
          <span className="text-xs uppercase tracking-widest font-bold text-secondary">Buat Proyek Baru</span>
        </div>
      </section>
    </>
  );
}
