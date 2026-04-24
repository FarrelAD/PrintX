import { useState } from 'react';
import CreateProjectWizard from './CreateProjectWizard';

export default function Dashboard({ onBack }: {
  onBack: () => void;
}) {
  const [isCreating, setIsCreating] = useState(false);

  const projects = [
    { id: '001', name: 'Kartu Nama Karyawan', items: 24, status: 'Siap Cetak', date: '24 Apr 2024' },
    { id: '002', name: 'Sertifikat Webinar UX', items: 156, status: 'Draf', date: '22 Apr 2024' },
    { id: '003', name: 'Label Pengiriman V1', items: 89, status: 'Siap Cetak', date: '20 Apr 2024' },
    { id: '004', name: 'Undangan Gala Dinner', items: 42, status: 'Menunggu Data', date: '18 Apr 2024' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-[280px] bg-white border-r border-primary flex-col sticky top-0 h-screen z-10">
        <div className="p-8 border-b border-primary">
          <div className="text-2xl font-bold tracking-tighter uppercase cursor-pointer" onClick={onBack}>PRINTX</div>
        </div>
        <nav className="flex-1 py-6 flex flex-col">
          <a href="#" onClick={() => setIsCreating(false)} className={`flex items-center gap-4 py-4 px-8 uppercase text-sm font-semibold tracking-wider transition-all ${!isCreating ? 'text-primary bg-surface-container-high border-l-4 border-primary' : 'text-secondary border-l-4 border-transparent hover:bg-surface-container hover:text-primary'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-4 py-4 px-8 uppercase text-sm font-semibold tracking-wider text-secondary border-l-4 border-transparent hover:bg-surface-container hover:text-primary transition-all">
            <span className="material-symbols-outlined">folder</span>
            <span>Proyek Saya</span>
          </a>
          <a href="#" className="flex items-center gap-4 py-4 px-8 uppercase text-sm font-semibold tracking-wider text-secondary border-l-4 border-transparent hover:bg-surface-container hover:text-primary transition-all">
            <span className="material-symbols-outlined">database</span>
            <span>Dataset</span>
          </a>
          <a href="#" className="flex items-center gap-4 py-4 px-8 uppercase text-sm font-semibold tracking-wider text-secondary border-l-4 border-transparent hover:bg-surface-container hover:text-primary transition-all">
            <span className="material-symbols-outlined">settings</span>
            <span>Pengaturan</span>
          </a>
        </nav>
        <div className="p-8 border-t border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-bold text-sm uppercase">JD</div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold">Jane Doe</div>
              <div className="text-[10px] uppercase text-secondary tracking-widest">Premium Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-24 lg:pb-0 min-w-0">
        {/* Mobile Header - Compact & Sticky */}
        <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b border-primary z-50 px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter uppercase cursor-pointer" onClick={onBack}>PRINTX</div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-xl">search</button>
            <button className="material-symbols-outlined text-xl">account_circle</button>
          </div>
        </header>

        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-margin pt-8 md:pt-12">
          {isCreating ? (
            <div className="max-w-full mx-auto">
              <CreateProjectWizard onClose={() => setIsCreating(false)} />
            </div>
          ) : (
            <>
              {/* Masthead / Hero Section */}
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
                      <span className="font-serif-display">Proyek</span>
                    </h1>
                    <p className="text-secondary text-sm md:text-base max-w-md">
                      Kelola alur kerja cetak massal Anda dengan presisi. Mulai dari desain hingga distribusi data dalam satu tempat.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-4">
                    <button 
                      onClick={() => setIsCreating(true)}
                      className="group relative bg-primary text-on-primary py-4 px-8 font-semibold tracking-widest uppercase text-sm border border-primary overflow-hidden transition-all hover:bg-white hover:text-primary active:scale-95 flex items-center gap-3 w-full md:w-auto justify-center"
                    >
                      <span className="material-symbols-outlined text-xl transition-transform group-hover:rotate-90">add</span>
                      <span>Proyek Baru</span>
                    </button>
                    <div className="hidden md:flex gap-8 border-t border-primary/20 pt-4 w-full justify-end">
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest text-secondary">Aktif</div>
                        <div className="font-heading text-xl">12</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest text-secondary">Selesai</div>
                        <div className="font-heading text-xl">1.2k</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

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
                  <div key={project.id} className="group flex flex-col cursor-pointer">
                    <div className="aspect-4/3 bg-surface-container border border-primary relative overflow-hidden mb-6 transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-1 group-hover:-translate-y-1">
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="text-[80px] material-symbols-outlined">description</span>
                      </div>
                      <div className="absolute top-0 left-0 p-4">
                        <div className="text-[10px] font-mono bg-white border border-primary px-2 py-0.5">ID: {project.id}</div>
                      </div>
                      <div className={`absolute bottom-4 right-4 py-1.5 px-4 text-[10px] uppercase font-bold tracking-wider border border-primary ${project.status === 'Siap Cetak' ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                        {project.status}
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl md:text-3xl font-heading leading-tight group-hover:italic transition-all">{project.name}</h3>
                        <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_outward</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-secondary font-bold border-t border-primary/10 pt-3 mt-auto">
                        <span>{project.items} Salinan</span>
                        <span className="w-1 h-1 bg-primary rounded-full"></span>
                        <span>{project.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty State / Call to Action Card */}
                <div 
                  onClick={() => setIsCreating(true)}
                  className="hidden md:flex aspect-4/3 border border-primary border-dashed items-center justify-center flex-col gap-4 cursor-pointer hover:bg-surface-container transition-colors group"
                >
                  <span className="material-symbols-outlined text-4xl text-secondary group-hover:scale-110 transition-transform">add_circle</span>
                  <span className="text-xs uppercase tracking-widest font-bold text-secondary">Buat Proyek Baru</span>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary h-20 z-100 flex justify-around items-center px-4">
        <a href="#" className="flex flex-col items-center gap-1 text-primary no-underline">
          <span className="text-2xl material-symbols-outlined">dashboard</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">Beranda</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-secondary no-underline">
          <span className="text-2xl material-symbols-outlined">folder</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">Proyek</span>
        </a>
        <a href="#" onClick={() => setIsCreating(true)} className={`flex flex-col items-center gap-1 no-underline ${isCreating ? 'text-primary' : 'text-secondary'}`}>
          <span className="text-2xl material-symbols-outlined">add_box</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">Baru</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-secondary no-underline">
          <span className="text-2xl material-symbols-outlined">database</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">Data</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-secondary no-underline">
          <span className="text-2xl material-symbols-outlined">settings</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider">Opsi</span>
        </a>
      </nav>
    </div>
  );
};
