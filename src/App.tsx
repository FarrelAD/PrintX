import { useState } from 'react'
import './App.css'
import Dashboard from './Dashboard'

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')

  if (view === 'dashboard') {
    return <Dashboard onBack={() => setView('landing')} />
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="logo">PRINTX</div>
          <div className="nav-links">
            <a href="#" className="nav-link">Arsip</a>
            <a href="#" className="nav-link">Fitur</a>
            <a href="#" className="nav-link">Harga</a>
            <a href="#" className="nav-link">Manifesto</a>
          </div>
          <button className="btn-primary" onClick={() => setView('dashboard')}>
            MULAI SEKARANG
          </button>
        </div>
      </nav>

      <main className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="display-lg">
              Ubah Spreadsheet Anda Menjadi Dokumen Siap Cetak
            </h1>
            <p className="body-lg">
              Solusi cetak dokumen massal yang mudah untuk siapa saja. Buat kartu ID, sertifikat, dan label dalam hitungan detik.
            </p>
            <div style={{ display: 'flex' }}>
              <button className="btn-primary" onClick={() => setView('dashboard')}>Mulai Gratis</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="brutalist-shadow brutalist-border" style={{ background: 'white', padding: '24px', width: '100%', aspectRatio: '16/9', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '16px', height: '100%' }}>
                <div style={{ width: '33%', borderRight: '1px solid #ccc', opacity: 0.5, fontSize: '10px', fontFamily: 'monospace' }}>
                  NAMA,JABATAN,UID<br/>
                  Jane Doe,Senior Lead,8821<br/>
                  John Smith,Desainer,9912
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid black', position: 'relative' }}>
                  <div style={{ width: '64px', height: '64px', background: '#eee', marginBottom: '16px' }}></div>
                  <h3 style={{ fontSize: '24px' }}>Jane Doe</h3>
                  <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666' }}>Senior Lead</p>
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'black', color: 'white', fontSize: '8px', padding: '4px 8px', textTransform: 'uppercase' }}>
                    Siap Cetak
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="section-border problem-section">
          <div className="problem-title">
            <h2 className="section-title">Beban Manual</h2>
          </div>
          <div className="problem-text">
            <p>
              Memformat dokumen secara manual adalah cara lama. Menyalin data dari spreadsheet ke perangkat lunak desain sangat rawan kesalahan, membosankan, dan sulit dikembangkan. PrintX menjembatani celah antara data terstruktur dan hasil fisik tanpa hambatan.
            </p>
          </div>
        </section>

        {/* Solution Flow */}
        <section className="solution-flow">
          <div className="solution-step">
            <span className="material-symbols-outlined step-icon">dashboard</span>
            <h3 className="step-title">1. Pilih Templat</h3>
            <p className="step-desc">Pilih dari perpustakaan standar arsip kami atau bangun tata letak berbasis grid kustom Anda sendiri.</p>
          </div>
          <div className="solution-step">
            <span className="material-symbols-outlined step-icon">upload_file</span>
            <h3 className="step-title">2. Unggah Data</h3>
            <p className="step-desc">Masukkan CSV, Excel, atau Google Sheet Anda. Kami menangani parsing dan sanitasi data secara otomatis.</p>
          </div>
          <div className="solution-step">
            <span className="material-symbols-outlined step-icon">print</span>
            <h3 className="step-title">3. Ekspor & Cetak</h3>
            <p className="step-desc">Hasilkan PDF siap cetak dengan tanda bleed dan garis potong hanya dalam satu klik.</p>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="section-border">
          <div className="section-header">
            <h2 className="section-title">Kemampuan Sistem</h2>
            <div className="section-subtitle">04 Fitur Utama</div>
          </div>
          <div className="features-grid">
            {[
              { icon: 'drag_pan', title: 'Tarik & Lepas Bidang', desc: 'Tempatkan variabel dinamis di mana pun pada kanvas Anda dengan presisi piksel yang sempurna.', label: 'Visual Editor' },
              { icon: 'auto_awesome', title: 'Pemetaan Data Otomatis', desc: 'Kami mendeteksi nama header dan secara otomatis menghubungkannya ke bidang dokumen Anda.', label: 'Inteligensi' },
              { icon: 'visibility', title: 'Pratinjau Langsung', desc: 'Lihat setiap data rekaman secara instan sebelum Anda melakukan proses cetak massal.', label: 'Proofing' },
              { icon: 'picture_as_pdf', title: 'Ekspor PDF Massal', desc: 'Ukuran file yang dioptimalkan dengan rendering teks vektor sempurna untuk skala apa pun.', label: 'Output' }
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <span className="material-symbols-outlined" style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</span>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-label">{f.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="use-cases">
          {['Kartu ID', 'Sertifikat', 'Label', 'Undangan'].map((u, i) => (
            <div key={i} className="use-case-item">
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '8px' }}>Kasus 0{i + 1}</div>
              <h3 style={{ fontSize: '24px' }}>{u}</h3>
            </div>
          ))}
        </section>

        {/* Preview Archive */}
        <section className="section-border">
          <div className="preview-container">
            <div className="preview-header">
              <div className="preview-title">Arsip Hasil Cetak</div>
              <div className="preview-filename">FILE_EKSPOR_V1_SIAP_CETAK.PDF</div>
            </div>
            <div className="preview-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="preview-card">
                  <div style={{ width: '100%', height: '100px', background: '#eee', marginBottom: '16px' }}></div>
                  <div style={{ height: '8px', background: 'black', width: '75%', marginBottom: '8px' }}></div>
                  <div style={{ height: '8px', background: '#666', width: '50%', marginBottom: '16px' }}></div>
                  <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
                    <span>REF: 00{n}</span>
                    <span>TERVERIFIKASI</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="cta-section">
          <h2 className="cta-title">
            Mulai Buat Dokumen Pertama Anda
          </h2>
          <button className="btn-primary btn-cta" onClick={() => setView('dashboard')}>
            Buka Aplikasi PrintX
          </button>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="logo">PRINTX</div>
            <div className="font-serif" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              © 2024 PRINTX SYSTEMS. DISUSUN DENGAN NEWSREADER. SELURUH HAK CIPTA DILINDUNGI.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {['Ketentuan Layanan', 'Kebijakan Privasi', 'Dokumentasi API', 'Kontak'].map((l) => (
              <a key={l} href="#" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
