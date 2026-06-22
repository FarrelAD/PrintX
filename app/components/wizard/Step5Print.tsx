import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProjectData, PrintConfig } from '@/types/project';
import { generateProfessionalPDF } from '@/utils/pdf/generator';

const DEFAULT_CONFIG: PrintConfig = {
  paperSize: 'A4',
  orientation: 'p',
  widthCm: 8.5, // Default ID card size
  heightCm: 5.5,
  bleedMm: 3,
  showCropMarks: true,
  nUp: true,
  gapHorizontalMm: 2,
  gapVerticalMm: 2,
};

export default function Step5Print({
  data,
  onBack,
  onUpdate,
  onComplete,
}: {
  data: ProjectData;
  onBack: () => void;
  onUpdate: (data: ProjectData) => void;
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const [config, setConfig] = useState<PrintConfig>({ ...DEFAULT_CONFIG, ...data.printConfig });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [imageRatio, setImageRatio] = useState<number | null>(null);

  // Detect image aspect ratio and sync initial height
  useEffect(() => {
    if (data.design?.preview) {
      const img = new Image();
      img.src = data.design.preview;
      img.onload = () => {
        const ratio = img.naturalHeight / img.naturalWidth;
        setImageRatio(ratio);
        
        // Only auto-sync height on the first load if not already set by user
        if (!data.printConfig) {
          setConfig(prev => ({
            ...prev,
            heightCm: Math.round(prev.widthCm * ratio * 10) / 10
          }));
        }
      };
    }
  }, [data.design?.preview, data.printConfig]);

  useEffect(() => {
    onUpdate({ ...data, printConfig: config });
  }, [config, data, onUpdate]);

  const handleWidthChange = (val: number) => {
    setConfig(prev => {
      const newHeight = lockAspectRatio && imageRatio 
        ? Math.round(val * imageRatio * 10) / 10 
        : prev.heightCm;
      return { ...prev, widthCm: val, heightCm: newHeight };
    });
  };

  const handleHeightChange = (val: number) => {
    setConfig(prev => {
      const newWidth = lockAspectRatio && imageRatio 
        ? Math.round(val / imageRatio * 10) / 10 
        : prev.widthCm;
      return { ...prev, heightCm: val, widthCm: newWidth };
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      await generateProfessionalPDF(data, config, (p) => setProgress(p));
      onUpdate({ ...data, status: 'Siap Cetak', printConfig: config });
      onComplete();
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert(t('wizard.step5.error_generate') || 'Gagal menghasilkan PDF. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-4xl font-heading mb-2 text-center">{t('wizard.step5.title')}</h2>
      <p className="text-secondary text-center mb-8 text-xs md:text-sm px-4">
        {t('wizard.step5.desc')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Settings Panel */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-primary space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('wizard.step5.form.paper_size')}</label>
                <select 
                  value={config.paperSize}
                  onChange={(e) => setConfig({ ...config, paperSize: e.target.value as PrintConfig['paperSize'] })}
                  className="p-2.5 border-2 border-primary text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="A3">A3 (297 x 420 mm)</option>
                  <option value="SRA3">SRA3 (320 x 450 mm)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('wizard.step5.form.orientation')}</label>
                <div className="flex border-2 border-primary h-[42px]">
                  <button 
                    onClick={() => setConfig({ ...config, orientation: 'p' })}
                    className={`flex-1 text-[10px] font-bold uppercase ${config.orientation === 'p' ? 'bg-primary text-white' : 'hover:bg-surface-container'}`}
                  >
                    {t('wizard.step5.form.portrait')}
                  </button>
                  <button 
                    onClick={() => setConfig({ ...config, orientation: 'l' })}
                    className={`flex-1 text-[10px] font-bold uppercase ${config.orientation === 'l' ? 'bg-primary text-white' : 'hover:bg-surface-container'}`}
                  >
                    {t('wizard.step5.form.landscape')}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant relative">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('wizard.step5.form.design_width') || 'Lebar Desain (cm)'}</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={config.widthCm}
                  onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                  className="p-2.5 border-2 border-primary text-sm font-bold focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('wizard.step5.form.design_height') || 'Tinggi Desain (cm)'}</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={config.heightCm}
                  onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                  className="p-2.5 border-2 border-primary text-sm font-bold focus:outline-none"
                />
              </div>
              
              {/* Aspect Ratio Lock Toggle */}
              <button 
                onClick={() => setLockAspectRatio(!lockAspectRatio)}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1 w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center transition-all z-10 ${lockAspectRatio ? 'border-primary text-primary' : 'border-outline-variant text-secondary opacity-50'}`}
                title={lockAspectRatio ? (t('wizard.step5.lock_ratio') || 'Kunci Rasio Aspek') : (t('wizard.step5.unlock_ratio') || 'Rasio Aspek Bebas')}
              >
                <span className="material-symbols-outlined text-sm">
                  {lockAspectRatio ? 'link' : 'link_off'}
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5 pt-4 border-t border-outline-variant">
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('wizard.step5.form.bleed') || 'Bleed / Margin Potong (mm)'}</label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="1"
                value={config.bleedMm}
                onChange={(e) => setConfig({ ...config, bleedMm: parseInt(e.target.value) })}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-secondary">
                <span>0mm</span>
                <span>{config.bleedMm}mm</span>
                <span>10mm</span>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-outline-variant">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.showCropMarks}
                  onChange={(e) => setConfig({ ...config, showCropMarks: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('wizard.step5.form.crop_marks') || 'Tanda Potong (Crop Marks)'}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.nUp}
                  onChange={(e) => setConfig({ ...config, nUp: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{t('wizard.step5.form.n_up') || 'Optimasi Layout (N-Up)'}</span>
              </label>
            </div>

            {config.nUp && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary text-left">{t('wizard.step5.form.horizontal_gap') || 'Gap Horizontal (mm)'}</label>
                  <input 
                    type="number" 
                    value={config.gapHorizontalMm || ''}
                    onChange={(e) => setConfig({ ...config, gapHorizontalMm: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="p-2.5 border-2 border-primary text-sm font-bold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary text-left">{t('wizard.step5.form.vertical_gap') || 'Gap Vertikal (mm)'}</label>
                  <input 
                    type="number" 
                    value={config.gapVerticalMm || ''}
                    onChange={(e) => setConfig({ ...config, gapVerticalMm: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="p-2.5 border-2 border-primary text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visual Preview / Summary */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-surface-container-low border border-outline-variant p-8 flex items-center justify-center relative min-h-[300px]">
            <div 
              className="bg-white shadow-2xl border border-outline transition-all duration-500 flex items-center justify-center overflow-hidden"
              style={{
                width: config.orientation === 'p' ? '180px' : '254px',
                height: config.orientation === 'p' ? '254px' : '180px',
                transform: 'scale(0.8)'
              }}
            >
              <div className="grid grid-cols-2 gap-1 opacity-20">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border border-primary w-20 h-12 bg-primary/5 flex items-center justify-center text-[6px]">
                    DESIGN
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 border-2 border-dashed border-primary/20 pointer-events-none"></div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-secondary">
              <span>{t('wizard.step5.preview_label') || 'Preview Layout Kertas'}</span>
              <span>{config.paperSize} {config.orientation === 'p' ? t('wizard.step5.form.portrait') : t('wizard.step5.form.landscape')}</span>
            </div>
          </div>

          <div className="p-4 bg-primary text-white space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t('wizard.step5.result_estimate') || 'Estimasi Hasil'}</p>
            <p className="text-xl font-heading">
              {data.dataset?.rows.length ?? 0} {t('wizard.step5.documents_label') || 'Dokumen'} • 300 DPI • CMYK Ready
            </p>
          </div>
        </div>
      </div>

      {/* Generating Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-full max-w-md p-8 text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-surface-container rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono">
                {Math.round(progress)}%
              </div>
            </div>
            <div>
              <h3 className="text-xl font-heading mb-1">{t('wizard.step5.generating_title') || 'Menghasilkan Dokumen...'}</h3>
              <p className="text-xs text-secondary uppercase tracking-widest font-bold">
                {t('wizard.step5.processing_desc', { count: data.dataset?.rows.length }) || `Memproses ${data.dataset?.rows.length} data dengan resolusi tinggi`}
              </p>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="w-full md:w-auto py-2.5 px-6 md:py-3 md:px-8 border border-primary text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors order-2 md:order-1"
        >
          {t('common.back')}
        </button>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full md:w-auto py-3.5 px-8 md:py-4 md:px-16 bg-primary text-white text-xs md:text-base font-bold uppercase tracking-widest transition-all brutalist-shadow order-1 md:order-2 hover:opacity-90 active:scale-[0.98]"
        >
          {isGenerating ? (t('wizard.step5.actions.processing') || 'Memproses...') : (t('wizard.step5.actions.generate') || 'Download PDF Siap Cetak')}
        </button>
      </div>
    </div>
  );
}


