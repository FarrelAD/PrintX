import { useNavigate } from 'react-router-dom';
import { getDB } from '@/lib/db';

export default function SettingsView() {
  const navigate = useNavigate();

  const handleClearData = async () => {
    const isConfirmed = window.confirm(
      'PERINGATAN: Tindakan ini akan menghapus semua proyek dan dataset lokal Anda. Data tidak dapat dipulihkan. Apakah Anda yakin ingin melanjutkan?'
    );
    
    if (isConfirmed) {
      try {
        const db = await getDB();
        await db.clear('projects');
        alert('Semua data lokal telah berhasil dihapus.');
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to clear data:', err);
        alert('Gagal menghapus data.');
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-8 border-b border-primary pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter">Pengaturan</h1>
          <p className="text-secondary text-sm mt-2">Konfigurasi preferensi dan manajemen data aplikasi Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="border border-primary bg-white p-6 md:p-8">
          <h2 className="text-xl font-heading uppercase mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">storage</span>
            Manajemen Data Lokal
          </h2>
          <p className="text-sm text-secondary mb-6">
            PrintX menyimpan semua proyek dan data desain Anda langsung di browser menggunakan IndexedDB. Anda mengontrol penuh data Anda.
          </p>
          
          <div className="border border-error/30 bg-error/5 p-4 md:p-6 mt-8">
            <h3 className="text-error font-bold uppercase tracking-widest text-xs mb-2">Zona Bahaya</h3>
            <p className="text-xs text-secondary mb-4">
              Menghapus semua data akan mengembalikan PrintX ke kondisi awal. Semua desain, dataset, dan konfigurasi cetak akan hilang secara permanen.
            </p>
            <button 
              onClick={handleClearData}
              className="bg-error text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">delete_forever</span>
              Hapus Semua Data Lokal
            </button>
          </div>
        </section>

        <section className="border border-primary bg-white p-6 md:p-8">
          <h2 className="text-xl font-heading uppercase mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            Informasi Aplikasi
          </h2>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-secondary">Versi</span>
              <span className="font-mono text-sm bg-surface-container px-2 py-1">1.0.0-beta</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-secondary">Lisensi</span>
              <span className="font-mono text-sm text-primary">MIT</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant pb-4">
              <span className="text-sm font-bold uppercase tracking-widest text-secondary">Arsitektur</span>
              <span className="font-mono text-sm text-secondary">PWA / Local-First</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
