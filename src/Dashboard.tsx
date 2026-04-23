import React from 'react';
import './Dashboard.css';

interface DashboardProps {
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const projects = [
    { id: '001', name: 'Kartu Nama Karyawan', items: 24, status: 'Siap Cetak', date: '24 Apr 2024' },
    { id: '002', name: 'Sertifikat Webinar UX', items: 156, status: 'Draf', date: '22 Apr 2024' },
    { id: '003', name: 'Label Pengiriman V1', items: 89, status: 'Siap Cetak', date: '20 Apr 2024' },
    { id: '004', name: 'Undangan Gala Dinner', items: 42, status: 'Menunggu Data', date: '18 Apr 2024' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar for Desktop */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo" onClick={onBack} style={{ cursor: 'pointer' }}>PRINTX</div>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">folder</span>
            <span>Proyek Saya</span>
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">database</span>
            <span>Dataset</span>
          </a>
          <a href="#" className="nav-item">
            <span className="material-symbols-outlined">settings</span>
            <span>Pengaturan</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info">
              <div className="user-name">Jane Doe</div>
              <div className="user-role">Premium Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="mobile-header-top">
            <div className="logo" onClick={onBack}>PRINTX</div>
            <button className="icon-btn">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
          <div className="header-content">
            <h1 className="headline-lg">Dashboard Proyek</h1>
            <button className="btn-primary">
              <span className="material-symbols-outlined">add</span>
              PROYEK BARU
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Quick Stats */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Proyek</div>
              <div className="stat-value">12</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Item Dicetak</div>
              <div className="stat-value">1,240</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Kapasitas Penyimpanan</div>
              <div className="stat-value">85%</div>
            </div>
          </section>

          {/* Project List */}
          <section className="projects-section">
            <div className="section-header">
              <h2 className="section-title">Aktivitas Terakhir</h2>
              <a href="#" className="label-sm">LIHAT SEMUA</a>
            </div>
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-thumbnail">
                    <div className="thumbnail-placeholder">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>
                      {project.status}
                    </div>
                  </div>
                  <div className="project-info">
                    <div className="project-id">#{project.id}</div>
                    <h3 className="project-name">{project.name}</h3>
                    <div className="project-meta">
                      <span>{project.items} Item</span>
                      <span className="dot"></span>
                      <span>{project.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav">
        <a href="#" className="bottom-nav-item active">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Beranda</span>
        </a>
        <a href="#" className="bottom-nav-item">
          <span className="material-symbols-outlined">folder</span>
          <span>Proyek</span>
        </a>
        <a href="#" className="bottom-nav-item">
          <span className="material-symbols-outlined">add_box</span>
          <span>Baru</span>
        </a>
        <a href="#" className="bottom-nav-item">
          <span className="material-symbols-outlined">database</span>
          <span>Data</span>
        </a>
        <a href="#" className="bottom-nav-item">
          <span className="material-symbols-outlined">settings</span>
          <span>Opsi</span>
        </a>
      </nav>
    </div>
  );
};

export default Dashboard;
