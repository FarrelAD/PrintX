export default function Step2Assets({ onNext, onBack }: {
  onNext: () => void,
  onBack: () => void
}) {
  return (
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
          onClick={onBack}
          className="flex-1 md:flex-none py-2.5 px-6 md:py-3 md:px-8 border border-primary text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
        >
          Kembali
        </button>
        <button 
          onClick={onNext}
          className="flex-1 md:flex-none py-2.5 px-8 md:py-3 md:px-12 bg-primary text-white text-[10px] md:text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
