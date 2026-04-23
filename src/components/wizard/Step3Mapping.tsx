export default function Step3Mapping({ onNext, onBack }: {
  onNext: () => void,
  onBack: () => void
}) {
  return (
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
          onClick={onBack}
          className="py-3 px-8 border border-primary text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
        >
          Kembali
        </button>
        <button 
          onClick={onNext}
          className="py-3 px-12 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Pratinjau & Selesai
        </button>
      </div>
    </div>
  );
}
