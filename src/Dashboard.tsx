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
      <main className="flex-1 flex flex-col pb-20 lg:pb-0 items-center">
        <header className="p-6 md:p-margin bg-white border-b border-primary w-full">
          <div className="flex lg:hidden justify-between items-center mb-6">
            <div className="text-2xl font-bold tracking-tighter uppercase cursor-pointer" onClick={onBack}>PRINTX</div>
            <button className="p-2">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
          <div className="flex justify-between items-center gap-6 max-md:flex-col max-md:items-start">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-medium">Dashboard Proyek</h1>
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-primary text-on-primary py-2.5 px-5 md:py-3 md:px-6 font-semibold tracking-widest uppercase text-xs md:text-sm border border-primary hover:bg-on-primary hover:text-primary active:scale-95 transition-all flex items-center gap-2 max-md:w-full max-md:justify-center"
            >
              <span className="material-symbols-outlined text-lg md:text-xl">add</span>
              PROYEK BARU
            </button>
          </div>
        </header>

        <div className="p-stack-lg px-margin max-w-[1200px] w-full mx-auto">
          {isCreating ? (
            <CreateProjectWizard onClose={() => setIsCreating(false)} />
          ) : (
            <>
              {/* Quick Stats */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-stack-lg">
                <div className="bg-white border border-primary p-8">
                  <div className="text-[12px] uppercase tracking-widest text-secondary mb-3">Total Proyek</div>
                  <div className="font-heading text-4xl font-semibold">12</div>
                </div>
                <div className="bg-white border border-primary p-8">
                  <div className="text-[12px] uppercase tracking-widest text-secondary mb-3">Total Item Dicetak</div>
                  <div className="font-heading text-4xl font-semibold">1,240</div>
                </div>
                <div className="bg-white border border-primary p-8">
                  <div className="text-[12px] uppercase tracking-widest text-secondary mb-3">Kapasitas Penyimpanan</div>
                  <div className="font-heading text-4xl font-semibold">85%</div>
                </div>
              </section>

              {/* Project List */}
              <section className="mt-stack-md">
                <div className="flex justify-between items-baseline mb-8">
                  <h2 className="text-2xl font-heading">Aktivitas Terakhir</h2>
                  <a href="#" className="text-[12px] font-semibold uppercase tracking-wider">LIHAT SEMUA</a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white border border-primary transition-all cursor-pointer hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-primary)] flex flex-col">
                      <div className="aspect-16/10 bg-surface-container border-b border-primary relative overflow-hidden">
                        <div className="h-full flex items-center justify-center text-surface-container-highest">
                          <span className="text-[64px] material-symbols-outlined">description</span>
                        </div>
                        <div className={`absolute top-4 right-4 py-1 px-3 text-[10px] uppercase font-bold tracking-wider border border-primary ${project.status === 'Siap Cetak' ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                          {project.status}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="font-mono text-[10px] text-secondary mb-2">#{project.id}</div>
                        <h3 className="text-lg mb-3">{project.name}</h3>
                        <div className="text-[12px] text-secondary flex items-center gap-2">
                          <span>{project.items} Item</span>
                          <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                          <span>{project.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
