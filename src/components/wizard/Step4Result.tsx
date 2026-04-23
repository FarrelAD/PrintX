import type { ProjectType } from '../../types/project';

export default function Step4Result({ onBack, onComplete, projectType }: {
  onBack: () => void,
  onComplete: () => void,
  projectType: ProjectType,
}) {
  return (
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
          onClick={onBack}
          className="w-full md:w-auto py-2.5 px-6 md:py-3 md:px-8 border border-primary text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors order-2 md:order-1"
        >
          Kembali
        </button>
        <button 
          onClick={onComplete}
          className="w-full md:w-auto py-3.5 px-8 md:py-4 md:px-16 bg-primary text-white text-xs md:text-base font-bold uppercase tracking-widest hover:opacity-90 transition-opacity brutalist-shadow order-1 md:order-2"
        >
          GENERATE DOKUMEN
        </button>
      </div>
    </div>
  );
}
