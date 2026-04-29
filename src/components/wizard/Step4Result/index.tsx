import { useRef, useState, useEffect } from 'react';
import type { ProjectData } from '@/types/project';
import { useImageLoader } from '@/hooks/useImageLoader';
import { RowPreview } from './RowPreview';
import { Stat } from './Stat';


export default function Step4Result({
  data,
  onBack,
  onComplete,
}: {
  data: ProjectData;
  onBack: () => void;
  onComplete: () => void;
}) {
  const bgImage = useImageLoader(data.design?.preview);
  const totalRows = data.dataset?.rows.length ?? 0;
  const mappedFields = data.mapping?.length ?? 0;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Measure container for responsive preview
  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      if (entries[0]) {
        const w = entries[0].contentRect.width;
        setContainerWidth(Math.min(600, w - 80)); // 80px for buttons
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setCurrentIndex(prev => Math.min(totalRows - 1, prev + 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [totalRows]);

  // Auto-scroll mini strip
  useEffect(() => {
    if (scrollRef.current) {
      const activeBtn = scrollRef.current.children[currentIndex] as HTMLElement;
      if (activeBtn) {
        scrollRef.current.scrollTo({
          left: activeBtn.offsetLeft - scrollRef.current.offsetWidth / 2 + activeBtn.offsetWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  const hasMappings = mappedFields > 0 && totalRows > 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-4xl font-heading mb-2 text-center">Konfirmasi Akhir</h2>
      <p className="text-secondary text-center mb-6 md:mb-8 text-xs md:text-sm px-4">
        Pratinjau hasil pemetaan data Anda sebelum proses cetak massal dimulai.
      </p>

      {/* Carousel Preview Area */}
      <div 
        ref={containerRef}
        className="border border-primary bg-white p-4 md:p-8 mb-6 relative"
      >
        {!hasMappings ? (
          <div className="border border-dashed border-outline-variant p-10 text-center">
            <span className="material-symbols-outlined text-3xl text-secondary mb-2 block">
              warning
            </span>
            <p className="text-sm text-secondary">
              {mappedFields === 0
                ? 'Tidak ada bidang yang dipetakan. Kembali ke langkah Pemetaan.'
                : 'Tidak ada data ditemukan. Kembali ke langkah Aset.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Main Stage */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center justify-center gap-4 md:contents">
                <button 
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className={`w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-primary hover:bg-surface-container transition-all ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                <div className="flex-1 flex justify-center animate-in fade-in zoom-in-95 duration-300" key={currentIndex}>
                  <RowPreview
                    rowIndex={currentIndex}
                    data={data}
                    bgImage={bgImage}
                    width={containerWidth}
                  />
                </div>

                <button 
                  onClick={() => setCurrentIndex(prev => Math.min(totalRows - 1, prev + 1))}
                  disabled={currentIndex === totalRows - 1}
                  className={`w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-primary hover:bg-surface-container transition-all ${currentIndex === totalRows - 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Navigation Strip */}
            <div className="flex flex-col gap-6 md:gap-4 pt-6 border-t border-outline-variant">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                  Navigasi Rekaman
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-primary text-white px-3 py-1">
                    {currentIndex + 1} / {totalRows}
                  </span>
                </div>
              </div>
              
              <div 
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
              >
                {Array.from({ length: totalRows }, (_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentIndex(i)}
                    className={`shrink-0 transition-all duration-300 p-1 border-2 ${
                      i === currentIndex ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    <RowPreview
                      rowIndex={i}
                      data={data}
                      bgImage={bgImage}
                      width={60}
                    />
                  </button>
                ))}
              </div>

              {/* Slider for quick jump */}
              <div className="px-2 py-4 md:py-0">
                <input 
                  type="range"
                  min={0}
                  max={totalRows - 1}
                  value={currentIndex}
                  onChange={(e) => setCurrentIndex(Number(e.target.value))}
                  className="w-full accent-primary h-2.5 md:h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer touch-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary bar */}
      <div className="p-5 bg-surface-container-high border border-primary mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat
            label="Tipe Proyek"
            value={(data.type ?? '-').replace('_', ' ').toUpperCase()}
          />
          <Stat
            label="Total Dokumen"
            value={`${totalRows}`}
          />
          <Stat
            label="Bidang Dipetakan"
            value={`${mappedFields}`}
          />
          <Stat
            label="Kolom Dataset"
            value={`${data.dataset?.headers.length ?? 0}`}
          />
        </div>
      </div>

      {/* Nav */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button
          onClick={onBack}
          className="w-full md:w-auto py-2.5 px-6 md:py-3 md:px-8 border border-primary text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors order-2 md:order-1"
        >
          Kembali
        </button>
        <button
          onClick={onComplete}
          disabled={!hasMappings}
          title={!hasMappings ? 'Lengkapi pemetaan data terlebih dahulu' : ''}
          className={`w-full md:w-auto py-3.5 px-8 md:py-4 md:px-16 bg-primary text-white text-xs md:text-base font-bold uppercase tracking-widest transition-all brutalist-shadow order-1 md:order-2 ${
            !hasMappings ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          Generate Dokumen
        </button>
      </div>
    </div>
  );
}
