import { useState } from 'react';

type ProjectType = 'id_card' | 'certificate' | 'label' | null;

export default function CreateProjectWizard({ onClose }: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<ProjectType>(null);

  const steps = [
    { number: 1, title: 'Kategori' },
    { number: 2, title: 'Aset' },
    { number: 3, title: 'Pemetaan' },
    { number: 4, title: 'Hasil' },
  ];

  const handleTypeSelect = (type: ProjectType) => {
    setProjectType(type);
    setStep(2);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header Wizard */}
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          <button 
            onClick={onClose}
            className="text-xs md:text-sm font-semibold uppercase tracking-widest flex items-center gap-1 md:gap-2 hover:text-secondary transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Batal
          </button>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          {steps.map((s) => (
            <div key={s.number} className="flex items-center gap-1 md:gap-2">
              <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border font-bold text-[10px] md:text-xs ${step === s.number ? 'bg-primary text-white border-primary' : 'border-outline-variant text-secondary'}`}>
                {s.number}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-widest hidden lg:inline ${step === s.number ? 'text-primary' : 'text-secondary'}`}>
                {s.title}
              </span>
              {s.number < 4 && <div className="w-2 md:w-4 h-px bg-outline-variant"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[800px] mx-auto w-full">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading mb-4 text-center px-4">Apa yang ingin Anda cetak?</h2>
            <p className="text-xs md:text-sm text-secondary text-center mb-8 md:mb-12 px-6">Pilih kategori proyek untuk menyesuaikan alat pemrosesan kami.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'id_card', title: 'Kartu ID', icon: 'badge', desc: 'Kartu nama, ID karyawan, kartu anggota.' },
                { id: 'certificate', title: 'Sertifikat', icon: 'workspace_premium', desc: 'Sertifikat pelatihan, piagam, ijazah.' },
                { id: 'label', title: 'Label', icon: 'label', desc: 'Label pengiriman, barcode, stiker produk.' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTypeSelect(item.id as ProjectType)}
                  className="bg-white border border-primary p-6 md:p-8 text-left hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-primary)] transition-all group"
                >
                  <span className="material-symbols-outlined text-3xl md:text-4xl mb-4 md:mb-6 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <h3 className="text-lg md:text-xl mb-2 md:mb-3 font-heading">{item.title}</h3>
                  <p className="text-xs md:text-sm text-secondary leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-heading mb-4 text-center">Unggah Aset Proyek</h2>
            <p className="text-secondary text-center mb-12">Kami membutuhkan desain dasar dan data variabel Anda.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Design Upload */}
              <div className="border border-primary p-8 bg-white">
                <h3 className="text-lg font-heading mb-4 uppercase tracking-tight">1. Desain Dasar</h3>
                <div className="border-2 border-dashed border-outline-variant p-12 text-center flex flex-col items-center group cursor-pointer hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-4xl mb-4 text-secondary group-hover:text-primary transition-colors">image</span>
                  <p className="text-sm font-semibold uppercase tracking-widest mb-2">Unggah Desain (JPG/PNG)</p>
                  <p className="text-[10px] text-secondary">Seret file ke sini atau klik untuk memilih</p>
                </div>
              </div>

              {/* Data Upload */}
              <div className="border border-primary p-8 bg-white">
                <h3 className="text-lg font-heading mb-4 uppercase tracking-tight">2. Dataset</h3>
                <div className="border-2 border-dashed border-outline-variant p-12 text-center flex flex-col items-center group cursor-pointer hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-4xl mb-4 text-secondary group-hover:text-primary transition-colors">table_chart</span>
                  <p className="text-sm font-semibold uppercase tracking-widest mb-2">Unggah Data (CSV/XLSX)</p>
                  <p className="text-[10px] text-secondary">Seret file ke sini atau klik untuk memilih</p>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-12 flex justify-between gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 md:flex-none py-2.5 px-6 md:py-3 md:px-8 border border-primary text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
              >
                Kembali
              </button>
              <button 
                onClick={() => setStep(3)}
                className="flex-1 md:flex-none py-2.5 px-8 md:py-3 md:px-12 bg-primary text-white text-[10px] md:text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-heading mb-4 text-center">Pemetaan Data</h2>
            <p className="text-secondary text-center mb-12">Hubungkan kolom dari dataset Anda ke elemen dalam desain.</p>

            <div className="bg-white border border-primary p-8">
              <div className="flex gap-8 max-md:flex-col">
                <div className="flex-1 bg-surface-container aspect-video border border-primary flex items-center justify-center text-secondary italic text-sm">
                  Pratinjau Kanvas Desain
                </div>
                <div className="w-full md:w-64 flex flex-col gap-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">Bidang Dinamis</div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-3 border border-outline-variant bg-surface-container-low flex justify-between items-center text-xs">
                      <span>Field_{i}</span>
                      <span className="material-symbols-outlined text-sm">link</span>
                    </div>
                  ))}
                  <button className="mt-4 py-2 border border-dashed border-primary text-[10px] font-bold uppercase tracking-widest">+ Tambah Bidang</button>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-between">
              <button 
                onClick={() => setStep(2)}
                className="py-3 px-8 border border-primary text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
              >
                Kembali
              </button>
              <button 
                onClick={() => setStep(4)}
                className="py-3 px-12 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Pratinjau & Selesai
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-heading mb-4 text-center">Konfirmasi Akhir</h2>
            <p className="text-secondary text-center mb-12">Periksa pratinjau acak dari data Anda sebelum proses cetak massal.</p>

            <div className="bg-white border border-primary p-8 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-3/4 border border-outline-variant bg-surface-container relative">
                    <div className="absolute top-2 right-2 bg-primary text-white text-[8px] px-1">DATA #{i}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-surface-container-high border border-primary mb-12">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Ringkasan Output</span>
                  <span className="text-lg font-heading">{projectType?.toUpperCase().replace('_', ' ')} — 156 Dokumen</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Estimasi Ukuran</span>
                  <div className="text-lg font-heading">24.5 MB</div>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-between gap-4">
              <button 
                onClick={() => setStep(3)}
                className="w-full md:w-auto py-2.5 px-6 md:py-3 md:px-8 border border-primary text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors order-2 md:order-1"
              >
                Kembali
              </button>
              <button 
                onClick={onClose}
                className="w-full md:w-auto py-3.5 px-8 md:py-4 md:px-16 bg-primary text-white text-xs md:text-base font-bold uppercase tracking-widest hover:opacity-90 transition-opacity brutalist-shadow order-1 md:order-2"
              >
                GENERATE DOKUMEN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
