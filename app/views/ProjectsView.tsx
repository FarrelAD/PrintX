import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllProjects, deleteProject as dbDeleteProject, saveProject as dbSaveProject } from '@/lib/db';
import type { ProjectData } from '@/types/project';

import NameModal from '@/components/ui/NameModal';
import StatusDropdown from '@/components/ui/StatusDropdown';

export default function ProjectsView() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    initialValue: string;
    project?: ProjectData;
  }>({
    isOpen: false,
    title: '',
    initialValue: '',
  });
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();


  async function loadProjects() {
    try {
      const data = await getAllProjects();
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
    if (!confirm(t('common.confirm_delete') || 'Apakah Anda yakin ingin menghapus proyek ini?')) return;
    setIsLoading(true);
    await dbDeleteProject(id);
    loadProjects();
  }

  async function updateProjectStatus(project: ProjectData, nextStatus: ProjectData['status']) {
    setIsLoading(true);
    try {
      await dbSaveProject({ ...project, status: nextStatus, updatedAt: Date.now() });
      await loadProjects();
    } catch (err) {
      console.error('Failed to change status:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredProjects = projects.filter(p => {
    if (activeTab === 'all') return true;
    return (p.status || 'draft') === activeTab;
  });

  const handleNewProject = () => {
    setModalConfig({
      isOpen: true,
      title: t('common.new_project'),
      initialValue: '',
    });
  };

  const handleRenameClick = (e: React.MouseEvent, project: ProjectData) => {
    e.stopPropagation();
    setModalConfig({
      isOpen: true,
      title: t('common.rename'),
      initialValue: project.name || '',
      project,
    });
  };

  const handleModalConfirm = async (name: string) => {
    const { project } = modalConfig;
    setModalConfig(prev => ({ ...prev, isOpen: false }));
    
    if (project) {
      // Rename case
      if (name.trim() !== project.name) {
        setIsLoading(true);
        try {
          await dbSaveProject({ ...project, name: name.trim() });
          await loadProjects();
        } catch (err) {
          console.error('Failed to rename project:', err);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      // New project case
      const url = name.trim() ? `/dashboard/project/new?name=${encodeURIComponent(name.trim())}` : '/dashboard/project/new';
      navigate(url);
    }
  };

  const tabs = [
    { key: 'all', label: t('projects.tabs.all') },
    { key: 'draft', label: t('projects.tabs.draft') },
    { key: 'in_progress', label: t('projects.tabs.in_progress') },
    { key: 'ready', label: t('projects.tabs.ready') },
    { key: 'finished', label: t('projects.tabs.finished') },
  ];

  return (
    <>
      <title>{t('nav.projects')} | PrintX</title>
      <NameModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleModalConfirm}
        title={modalConfig.title}
        initialValue={modalConfig.initialValue}
        placeholder={t('common.project_name_placeholder') || 'Nama proyek...'}
      />
      <div className="flex justify-between items-end mb-8 border-b border-primary pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">{t('projects.title')}</h1>
          <p className="text-secondary text-sm mt-2">{t('projects.desc')}</p>
        </div>
        <button 
          onClick={handleNewProject}
          className="bg-primary text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-on-primary hover:text-primary border border-primary transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {t('common.new_project')}
        </button>
      </div>

      {/* Navigation & Filter Bar */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-primary/10 pb-6">
        <div className="flex gap-6 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {tabs.map((tab) => (
            <button 
              key={tab.key} 
              onClick={() => setActiveTab(tab.key)}
              className={`text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all pb-2 ${activeTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4 w-full md:w-64 border-b border-primary/20 pb-1">
          <span className="material-symbols-outlined text-secondary text-lg">search</span>
          <input type="text" placeholder={t('common.search') || 'Cari...'} className="bg-transparent border-none outline-none text-sm w-full font-body" />
        </div>
      </section>

      {/* Project Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => navigate(`/dashboard/project/${project.id}`)}
            className="group flex flex-col cursor-pointer"
          >
            <div className="aspect-4/3 bg-surface-container border border-primary relative mb-6 transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-1 group-hover:-translate-y-1">
              <div className="absolute inset-0 overflow-hidden">
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
              </div>
              <div className="absolute top-0 left-0 p-4 flex justify-between w-full items-start">
                <div className="text-[10px] font-mono bg-white border border-primary px-2 py-0.5">ID: {project.id?.slice(0, 8)}</div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleRenameClick(e, project)}
                    className="w-8 h-8 bg-white border border-primary flex items-center justify-center hover:bg-surface-container transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                    title={t('common.rename') || 'Ubah Nama'}
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, project.id!)}
                    className="w-8 h-8 bg-white border border-primary flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                    title={t('common.delete') || 'Hapus Proyek'}
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <StatusDropdown 
                currentStatus={project.status || 'draft'}
                onStatusChange={(newStatus) => updateProjectStatus(project, newStatus)}
                className="mb-3 self-start"
                direction="down"
              />
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl md:text-3xl font-heading leading-tight group-hover:italic transition-all truncate pr-4">{project.name || (t('projects.untitled') || 'Proyek Tanpa Nama')}</h3>
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity shrink-0">arrow_outward</span>
              </div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-secondary font-bold border-t border-primary/10 pt-3 mt-auto">
                <span>{project.dataset?.rows.length || 0} {t('projects.copies')}</span>
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                <span>{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short' }) : '-'}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && !isLoading && (
          <div className="col-span-full border-2 border-dashed border-outline-variant py-20 flex flex-col items-center justify-center text-secondary opacity-50">
            <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
            <p className="text-sm font-bold uppercase tracking-widest">{t('projects.empty')}</p>
          </div>
        )}
        
        {/* Empty State / Call to Action Card */}
        <div 
          onClick={handleNewProject}
          className="hidden md:flex aspect-4/3 border border-primary border-dashed items-center justify-center flex-col gap-4 cursor-pointer hover:bg-surface-container transition-colors group"
        >
          <span className="material-symbols-outlined text-4xl text-secondary group-hover:scale-110 transition-transform">add_circle</span>
          <span className="text-xs uppercase tracking-widest font-bold text-secondary">{t('projects.create_new')}</span>
        </div>
      </section>
    </>
  );
}
