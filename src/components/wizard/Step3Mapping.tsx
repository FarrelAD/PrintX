import type { ProjectData } from '../../types/project';

export default function Step3Mapping({ data, onNext, onBack }: {
  data: ProjectData,
  onNext: () => void,
  onBack: () => void
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-heading mb-4 text-center">Pemetaan Data</h2>
      <p className="text-secondary text-center mb-12">Hubungkan kolom dari dataset Anda ke elemen dalam desain.</p>

      <div className="bg-white border border-primary p-8">
        <div className="flex gap-8 max-md:flex-col">
          <div className="flex-1 bg-surface-container aspect-video border border-primary flex items-center justify-center overflow-hidden">
            {data.design?.preview ? (
              <img src={data.design.preview} alt="Design preview" className="max-w-full max-h-full object-contain opacity-50" />
            ) : (
              <span className="text-secondary italic text-sm">Pratinjau Kanvas Desain</span>
            )}
          </div>
          <div className="w-full md:w-64 flex flex-col gap-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">Kolom Dataset</div>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
              {data.dataset?.headers.map((header, i) => (
                <div key={i} className="p-3 border border-outline-variant bg-surface-container-low flex justify-between items-center text-xs group cursor-pointer hover:border-primary transition-colors">
                  <span className="truncate mr-2">{header}</span>
                  <span className="material-symbols-outlined text-sm text-secondary group-hover:text-primary transition-colors">drag_handle</span>
                </div>
              ))}
              {(!data.dataset || data.dataset.headers.length === 0) && (
                <p className="text-[10px] text-secondary italic">Tidak ada data ditemukan</p>
              )}
            </div>
            <button className="mt-4 py-2 border border-dashed border-primary text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container transition-colors">+ Tambah Bidang Manual</button>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex-1 md:flex-none py-3 px-8 border border-primary text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
        >
          Kembali
        </button>
        <button 
          onClick={onNext}
          className="flex-1 md:flex-none py-3 px-12 bg-primary text-white text-[10px] md:text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Pratinjau & Selesai
        </button>
      </div>
    </div>
  );
}
