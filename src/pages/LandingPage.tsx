import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import InstallPrompt from '@/components/InstallPrompt';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user opens the app via the installed PWA (standalone mode)
    // we take them directly to the dashboard instead of showing the landing page.
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <nav className="bg-on-primary border-b border-primary w-full sticky top-0 z-100">
        <div className="flex justify-between items-center py-8 px-margin max-w-[1440px] mx-auto flex-wrap gap-4 max-xs:px-margin max-xs:justify-center">
          <div className="flex items-center gap-3 cursor-pointer">
            <Logo size="lg" />
            <div className="text-2xl font-bold tracking-tighter uppercase">PRINTX</div>
          </div>

          <div className="flex items-center gap-4">
            <InstallPrompt variant="compact" className="py-3 px-6 text-sm" />
            <button className="bg-primary text-on-primary py-3 px-6 font-semibold tracking-widest uppercase text-sm border border-primary hover:bg-on-primary hover:text-primary active:scale-95 transition-all" onClick={() => navigate('/dashboard')}>
              MULAI SEKARANG
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] w-full mx-auto px-margin">
        {/* Hero Section */}
        <section className="grid grid-cols-12 gap-gutter py-stack-lg border-b border-primary">
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
            <h1 className="text-[clamp(40px,5vw,64px)] leading-[1.1] tracking-tight mb-stack-sm font-heading">
              Ubah Spreadsheet Anda Menjadi Dokumen Siap Cetak
            </h1>
            <p className="text-lg text-secondary mb-stack-md max-w-[480px]">
              Solusi cetak dokumen massal yang mudah untuk siapa saja. Buat kartu ID, sertifikat, dan label dalam hitungan detik.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-primary text-on-primary py-3 px-6 font-semibold tracking-widest uppercase text-sm border border-primary hover:bg-on-primary hover:text-primary active:scale-95 transition-all" onClick={() => navigate('/dashboard')}>Mulai Gratis</button>
              <InstallPrompt variant="compact" className="py-3 px-6 text-sm" />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 bg-surface-container border border-primary p-8 flex items-center justify-center">
            <div className="brutalist-shadow border border-primary bg-white p-6 w-full aspect-video relative">
              <div className="flex gap-4 h-full">
                <div className="w-1/3 border-r border-[#ccc] opacity-50 text-[10px] font-mono leading-tight">
                  NAMA,JABATAN,UID<br/>
                  Jane Doe,Senior Lead,8821<br/>
                  John Smith,Desainer,9912
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border border-black relative">
                  <div className="w-16 h-16 bg-[#eee] mb-4"></div>
                  <h3 className="text-2xl font-heading">Jane Doe</h3>
                  <p className="text-[12px] uppercase tracking-widest text-[#666]">Senior Lead</p>
                  <div className="absolute -top-2 -right-2 bg-black text-white text-[8px] px-2 py-1 uppercase">
                    Siap Cetak
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="border-b border-primary py-stack-lg grid grid-cols-12 gap-gutter">
          <div className="col-span-12 md:col-span-4 md:border-r border-primary md:pr-gutter max-md:border-b max-md:pb-stack-sm max-md:mb-stack-sm">
            <h2 className="text-[clamp(24px,4vw,32px)] uppercase tracking-tight mb-stack-sm">Beban Manual</h2>
          </div>
          <div className="col-span-12 md:col-span-8 text-lg text-secondary">
            <p>
              Memformat dokumen secara manual adalah cara lama. Menyalin data dari spreadsheet ke perangkat lunak desain sangat rawan kesalahan, membosankan, dan sulit dikembangkan. PrintX menjembatani celah antara data terstruktur dan hasil fisik tanpa hambatan.
            </p>
          </div>
        </section>

        {/* Solution Flow */}
        <section className="grid grid-cols-1 md:grid-cols-3 border-b border-primary">
          <div className="p-12 border-b md:border-b-0 md:border-r border-primary last:border-none hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[48px] mb-stack-sm">dashboard</span>
            <h3 className="text-2xl mb-2">1. Pilih Templat</h3>
            <p className="text-secondary">Pilih dari perpustakaan standar arsip kami atau bangun tata letak berbasis grid kustom Anda sendiri.</p>
          </div>
          <div className="p-12 border-b md:border-b-0 md:border-r border-primary last:border-none hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[48px] mb-stack-sm">upload_file</span>
            <h3 className="text-2xl mb-2">2. Unggah Data</h3>
            <p className="text-secondary">Masukkan CSV, Excel, atau Google Sheet Anda. Kami menangani parsing dan sanitasi data secara otomatis.</p>
          </div>
          <div className="p-12 border-b md:border-b-0 md:border-r border-primary last:border-none hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[48px] mb-stack-sm">print</span>
            <h3 className="text-2xl mb-2">3. Ekspor &amp; Cetak</h3>
            <p className="text-secondary">Hasilkan PDF siap cetak dengan tanda bleed dan garis potong hanya dalam satu klik.</p>
          </div>
        </section>

        {/* PWA Install Promotion */}
        <InstallPrompt variant="landing" />

        {/* Feature Highlights */}
        <section className="border-b border-primary py-stack-lg">
          <div className="flex justify-between items-baseline mb-stack-md gap-4 max-md:flex-col max-md:gap-2">
            <h2 className="text-[clamp(24px,4vw,32px)] uppercase tracking-tight mb-stack-sm">Kemampuan Sistem</h2>
            <div className="text-[12px] text-secondary uppercase tracking-[0.2em]">04 Fitur Utama</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mt-stack-md">
            {[
              { icon: 'drag_pan', title: 'Tarik & Lepas Bidang', desc: 'Tempatkan variabel dinamis di mana pun pada kanvas Anda dengan presisi piksel yang sempurna.', label: 'Visual Editor' },
              { icon: 'auto_awesome', title: 'Pemetaan Data Otomatis', desc: 'Kami mendeteksi nama header dan secara otomatis menghubungkannya ke bidang dokumen Anda.', label: 'Inteligensi' },
              { icon: 'visibility', title: 'Pratinjau Langsung', desc: 'Lihat setiap data rekaman secara instan sebelum Anda melakukan proses cetak massal.', label: 'Proofing' },
              { icon: 'picture_as_pdf', title: 'Ekspor PDF Massal', desc: 'Ukuran file yang dioptimalkan dengan rendering teks vektor sempurna untuk skala apa pun.', label: 'Output' }
            ].map((f, i) => (
              <div key={i} className="border border-primary p-8 flex flex-col h-full">
                <span className="material-symbols-outlined text-[32px] mb-4">{f.icon}</span>
                <h4 className="text-2xl mb-4">{f.title}</h4>
                <p className="text-secondary mb-8">{f.desc}</p>
                <div className="mt-auto pt-4 border-t border-outline-variant text-[12px] uppercase tracking-widest font-semibold">{f.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="grid grid-cols-2 lg:grid-cols-4 border-y border-primary">
          {['Kartu ID', 'Sertifikat', 'Label', 'Undangan'].map((u, i) => (
            <div key={i} className={`p-8 text-center border-r border-primary last:border-none ${i === 1 && 'max-md:border-r-0'} ${i < 2 && 'max-md:border-b'}`}>
              <div className="text-[12px] text-[#666] uppercase mb-2">Kasus 0{i + 1}</div>
              <h3 className="text-2xl">{u}</h3>
            </div>
          ))}
        </section>

        {/* Final CTA */}
        <section className="text-center py-16">
          <h2 className="text-[clamp(32px,6vw,48px)] mb-8 max-w-[800px] mx-auto">
            Mulai Buat Dokumen Pertama Anda
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
            <button className="bg-primary text-on-primary py-6 px-12 font-semibold tracking-widest uppercase text-base border border-primary hover:bg-on-primary hover:text-primary active:scale-95 transition-all" onClick={() => navigate('/dashboard')}>
              Buka Aplikasi PrintX
            </button>
            <InstallPrompt 
              variant="compact" 
              className="py-6 px-12 text-base bg-white text-primary border-primary hover:bg-primary hover:text-white" 
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-primary py-16 mt-16">
        <div className="max-w-[1440px] w-full mx-auto px-margin flex justify-between items-center gap-8 max-md:flex-col max-md:text-center">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Logo size="md" />
              <div className="text-2xl font-bold tracking-tighter uppercase">PRINTX</div>
            </div>
            <div className="font-heading text-[12px] uppercase tracking-widest">
              © {new Date().getFullYear()} PRINTX. DIKEMBANGKAN OLEH <a href="https://github.com/FarrelAD/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FARREL AD</a>.
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-widest text-primary font-bold bg-surface-container px-4 py-2">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            100% Berjalan Lokal
          </div>
        </div>
      </footer>
    </>
  );
}
