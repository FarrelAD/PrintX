import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProjects } from '@/lib/db';
import type { ProjectData } from '@/types/project';

export default function DashboardHome() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  async function loadProjects() {
    try {
      const data = await getAllProjects();
      console.log('Dashboard: Loaded projects:', data);
      if (!Array.isArray(data)) {
        console.warn('Dashboard: Expected array of projects, got:', typeof data);
        setProjects([]);
        return;
      }
      // Create a copy before reversing to avoid mutation of source data
      setProjects([...data].reverse());
    } catch (err) {
      console.error('Dashboard: Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);


  // Defensive checks for projects data
  const validProjects = projects.filter(p => p && typeof p === 'object');
  const activeProjects = validProjects.filter(p => p.status !== 'Siap Cetak').length;
  const completedProjects = validProjects.filter(p => p.status === 'Siap Cetak').length;
  const recentProjects = validProjects.slice(0, 3);

  return (
    <>
      <section className="mb-12 md:mb-20 border-b border-primary pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] bg-primary text-white px-2 py-0.5">Vol. 01</span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-secondary">
                {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading leading-[0.9] tracking-tighter mb-4">
              Dashboard <br className="hidden md:block" />
              <span className="font-serif-display">Ringkasan</span>
            </h1>
            <p className="text-secondary text-sm md:text-base max-w-md">
              Kelola alur kerja cetak massal Anda dengan presisi. Mulai dari desain hingga distribusi data dalam satu tempat.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-4">
            <Link 
              to="/dashboard/project/new"
              className="group relative bg-primary text-on-primary py-4 px-8 font-semibold tracking-widest uppercase text-sm border border-primary overflow-hidden transition-all hover:bg-white hover:text-primary active:scale-95 flex items-center gap-3 w-full md:w-auto justify-center"
            >
              <span className="material-symbols-outlined text-xl transition-transform group-hover:rotate-90">add</span>
              <span>Proyek Baru</span>
            </Link>
            <div className="hidden md:flex gap-8 border-t border-primary/20 pt-4 w-full justify-end">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-secondary">Total Proyek</div>
                <div className="font-heading text-xl">{projects.length}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-secondary">Penyimpanan</div>
                <div className="font-heading text-xl">LOKAL</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div className="border border-primary p-6 bg-surface-container">
          <span className="text-2xl material-symbols-outlined text-secondary mb-2">work_history</span>
          <div className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Draf Aktif</div>
          <div className="text-3xl font-heading">{activeProjects}</div>
        </div>
        <div className="border border-primary p-6 bg-surface-container">
          <span className="text-2xl material-symbols-outlined text-secondary mb-2">task_alt</span>
          <div className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Siap Cetak</div>
          <div className="text-3xl font-heading">{completedProjects}</div>
        </div>
        <div className="border border-primary p-6 bg-surface-container">
          <span className="text-2xl material-symbols-outlined text-secondary mb-2">storage</span>
          <div className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Status Storage</div>
          <div className="text-3xl font-heading">Aman</div>
        </div>
        <div className="border border-primary p-6 bg-surface-container flex flex-col justify-between items-start cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => navigate('/dashboard/projects')}>
          <span className="text-2xl material-symbols-outlined text-primary mb-2">folder_open</span>
          <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Lihat Semua Proyek</div>
          <span className="material-symbols-outlined text-primary self-end">arrow_forward</span>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6 border-b border-primary/20 pb-4">
          <h2 className="text-2xl font-heading uppercase">Proyek Terakhir</h2>
          <Link to="/dashboard/projects" className="text-xs uppercase font-bold tracking-widest text-primary hover:underline">Semua Proyek &rarr;</Link>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex justify-center"><span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span></div>
        ) : recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {recentProjects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => navigate(`/dashboard/project/${project.id}`)}
                className="group flex flex-col cursor-pointer"
              >
                <div className="aspect-4/3 bg-surface-container border border-primary relative overflow-hidden mb-4 transition-all group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-1 group-hover:-translate-y-1">
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
                  <div className="absolute top-0 left-0 p-3">
                    <div className="text-[9px] font-mono bg-white border border-primary px-2 py-0.5">ID: {project.id?.slice(0, 8)}</div>
                  </div>
                  <div className={`absolute bottom-3 right-3 py-1 px-3 text-[9px] uppercase font-bold tracking-wider border border-primary ${project.status === 'Siap Cetak' ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                    {project.status || 'Draf'}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-heading leading-tight group-hover:italic transition-all truncate pr-4">{project.name || 'Proyek Tanpa Nama'}</h3>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                    {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-outline-variant py-16 flex flex-col items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-4xl mb-3">inbox</span>
            <p className="text-xs font-bold uppercase tracking-widest">Belum ada proyek lokal</p>
            <Link to="/dashboard/project/new" className="mt-4 text-xs font-bold text-primary uppercase border-b border-primary pb-0.5">Buat Sekarang</Link>
          </div>
        )}
      </section>
    </>
  );
}
