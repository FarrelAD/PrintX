import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { ProjectData, PrintConfig } from '../../types/project';

// ── Constants ────────────────────────────────────────────────────────────────

const PAPER_SIZES = {
  A4: { w: 210, h: 297 },
  A3: { w: 297, h: 420 },
  SRA3: { w: 320, h: 450 },
  Custom: { w: 210, h: 297 }
};

const DEFAULT_CONFIG: PrintConfig = {
  paperSize: 'A4',
  orientation: 'p',
  widthCm: 8.5, // Default ID card size
  heightCm: 5.5,
  bleedMm: 3,
  showCropMarks: true,
  nUp: true,
};

// ── Step5Print ───────────────────────────────────────────────────────────────

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
  const [config, setConfig] = useState<PrintConfig>(data.printConfig || DEFAULT_CONFIG);
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
  }, [config]);

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
      alert('Gagal menghasilkan PDF. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-4xl font-heading mb-2 text-center">Konfigurasi Cetak</h2>
      <p className="text-secondary text-center mb-8 text-xs md:text-sm px-4">
        Atur ukuran kertas dan dimensi fisik untuk dokumen siap cetak.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Settings Panel */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-primary space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Ukuran Kertas</label>
                <select 
                  value={config.paperSize}
                  onChange={(e) => setConfig({ ...config, paperSize: e.target.value as any })}
                  className="p-2.5 border-2 border-primary text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="A3">A3 (297 x 420 mm)</option>
                  <option value="SRA3">SRA3 (320 x 450 mm)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Orientasi</label>
                <div className="flex border-2 border-primary h-[42px]">
                  <button 
                    onClick={() => setConfig({ ...config, orientation: 'p' })}
                    className={`flex-1 text-[10px] font-bold uppercase ${config.orientation === 'p' ? 'bg-primary text-white' : 'hover:bg-surface-container'}`}
                  >
                    Potret
                  </button>
                  <button 
                    onClick={() => setConfig({ ...config, orientation: 'l' })}
                    className={`flex-1 text-[10px] font-bold uppercase ${config.orientation === 'l' ? 'bg-primary text-white' : 'hover:bg-surface-container'}`}
                  >
                    Lanskap
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant relative">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Lebar Desain (cm)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={config.widthCm}
                  onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                  className="p-2.5 border-2 border-primary text-sm font-bold focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Tinggi Desain (cm)</label>
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
                title={lockAspectRatio ? 'Kunci Rasio Aspek' : 'Rasio Aspek Bebas'}
              >
                <span className="material-symbols-outlined text-sm">
                  {lockAspectRatio ? 'link' : 'link_off'}
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5 pt-4 border-t border-outline-variant">
              <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">Bleed / Margin Potong (mm)</label>
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Tanda Potong (Crop Marks)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.nUp}
                  onChange={(e) => setConfig({ ...config, nUp: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Optimasi Layout (N-Up)</span>
              </label>
            </div>
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
              <span>Preview Layout Kertas</span>
              <span>{config.paperSize} {config.orientation === 'p' ? 'Portrait' : 'Landscape'}</span>
            </div>
          </div>

          <div className="p-4 bg-primary text-white space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Estimasi Hasil</p>
            <p className="text-xl font-heading">
              {data.dataset?.rows.length ?? 0} Dokumen • 300 DPI • CMYK Ready
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
              <h3 className="text-xl font-heading mb-1">Menghasilkan Dokumen...</h3>
              <p className="text-xs text-secondary uppercase tracking-widest font-bold">
                Memproses {data.dataset?.rows.length} data dengan resolusi tinggi
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
          Kembali
        </button>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full md:w-auto py-3.5 px-8 md:py-4 md:px-16 bg-primary text-white text-xs md:text-base font-bold uppercase tracking-widest transition-all brutalist-shadow order-1 md:order-2 hover:opacity-90 active:scale-[0.98]"
        >
          {isGenerating ? 'Memproses...' : 'Download PDF Siap Cetak'}
        </button>
      </div>
    </div>
  );
}

// ── PDF Generator Logic ──────────────────────────────────────────────────────

async function generateProfessionalPDF(
  data: ProjectData, 
  config: PrintConfig,
  onProgress: (p: number) => void
) {
  const { dataset, mapping, design } = data;
  if (!dataset || !mapping || !design?.preview) return;

  const paperDim = PAPER_SIZES[config.paperSize] || PAPER_SIZES.A4;
  const paperW = config.orientation === 'p' ? paperDim.w : paperDim.h;
  const paperH = config.orientation === 'p' ? paperDim.h : paperDim.w;

  const pdf = new jsPDF({
    orientation: config.orientation,
    unit: 'mm',
    format: [paperW, paperH],
  });

  // 1. Load Background Image once
  const bgImg = await loadImage(design.preview);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 300 DPI = 11.81 pixels per mm
  const DPI_SCALE = 11.811;
  const designW_mm = config.widthCm * 10;
  const designH_mm = config.heightCm * 10;
  const bleed_mm = config.bleedMm;
  
  // Canvas size includes bleed
  canvas.width = Math.round((designW_mm + 2 * bleed_mm) * DPI_SCALE);
  canvas.height = Math.round((designH_mm + 2 * bleed_mm) * DPI_SCALE);

  const totalRows = dataset.rows.length;
  const headerIndex: Record<string, number> = {};
  dataset.headers.forEach((h, i) => { headerIndex[h] = i; });

  // Imposition calculation
  const margin_mm = 10; // Safety margin for printer
  const stepX = designW_mm + (config.nUp ? 2 : 20); // Spacing between items
  const stepY = designH_mm + (config.nUp ? 2 : 20);
  const cols = config.nUp ? Math.floor((paperW - 2 * margin_mm) / stepX) : 1;
  const rowsPerPage = config.nUp ? Math.floor((paperH - 2 * margin_mm) / stepY) : 1;
  const itemsPerPage = cols * rowsPerPage;

  for (let i = 0; i < totalRows; i++) {
    const row = dataset.rows[i];
    const itemInPageIndex = i % itemsPerPage;
    
    if (i > 0 && itemInPageIndex === 0) {
      pdf.addPage();
    }

    const colIdx = itemInPageIndex % cols;
    const rowIdx = Math.floor(itemInPageIndex / cols);
    
    // Position on paper (center grid)
    const gridW = cols * stepX;
    const gridH = rowsPerPage * stepY;
    const startX = (paperW - gridW) / 2 + colIdx * stepX + stepX / 2 - designW_mm / 2;
    const startY = (paperH - gridH) / 2 + rowIdx * stepY + stepY / 2 - designH_mm / 2;

    // A. Render the high-res design to canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background (scaled to include bleed)
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Draw fields
    for (const field of mapping) {
      const val = String(row[headerIndex[field.column]] ?? '');
      const scaleX = canvas.width / (bgImg.naturalWidth || 1);
      const scaleY = canvas.height / (bgImg.naturalHeight || 1);
      
      const x = (field.x * scaleX);
      const y = (field.y * scaleY);
      const w = (field.width * scaleX);
      const h = (field.height * scaleY);

      if (field.type === 'qrcode') {
        try {
          // Generate QR code as data URL
          const qrDataUrl = await QRCode.toDataURL(val, {
            margin: 1,
            width: Math.min(w, h), // Keep it square
            color: {
              dark: '#000000',
              light: '#ffffff00', // Transparent background
            }
          });
          
          const qrImg = await loadImage(qrDataUrl);
          
          // Center QR code within the field bounds if needed, or just fill
          const qrSize = Math.min(w, h);
          const qrX = x + (w - qrSize) / 2;
          const qrY = y + (h - qrSize) / 2;
          
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        } catch (err) {
          console.error('QR Generation failed for:', val, err);
        }
      } else {
        // Default text rendering
        ctx.fillStyle = field.color;
        ctx.font = `bold ${Math.round(field.fontSize * scaleX)}px ${field.fontFamily}`;
        ctx.textAlign = field.align;
        ctx.textBaseline = 'middle';
        
        let drawX = x;
        if (field.align === 'center') drawX = x + w / 2;
        if (field.align === 'right') drawX = x + w;
        
        ctx.fillText(val, drawX, y + h / 2, w);
      }
    }

    // B. Add to PDF
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(
      dataUrl, 
      'JPEG', 
      startX - bleed_mm, 
      startY - bleed_mm, 
      designW_mm + 2 * bleed_mm, 
      designH_mm + 2 * bleed_mm
    );

    // C. Draw Crop Marks
    if (config.showCropMarks) {
      drawCropMarks(pdf, startX, startY, designW_mm, designH_mm, bleed_mm);
    }

    onProgress(((i + 1) / totalRows) * 100);
    
    // Tiny delay to keep UI responsive
    if (i % 5 === 0) await new Promise(r => setTimeout(r, 10));
  }

  pdf.save(`PrintX_Export_${new Date().getTime()}.pdf`);
}

function drawCropMarks(pdf: jsPDF, x: number, y: number, w: number, h: number, bleed: number) {
  pdf.setLineWidth(0.1);
  pdf.setDrawColor(0, 0, 0);
  const len = 5; // length of marks
  const gap = 2; // gap from trim line

  // Horizontal marks
  pdf.line(x - bleed - len, y, x - gap, y); // Top left
  pdf.line(x + w + gap, y, x + w + bleed + len, y); // Top right
  pdf.line(x - bleed - len, y + h, x - gap, y + h); // Bottom left
  pdf.line(x + w + gap, y + h, x + w + bleed + len, y + h); // Bottom right

  // Vertical marks
  pdf.line(x, y - bleed - len, x, y - gap); // Top left
  pdf.line(x, y + h + gap, x, y + h + bleed + len); // Bottom left
  pdf.line(x + w, y - bleed - len, x + w, y - gap); // Top right
  pdf.line(x + w, y + h + gap, x + w, y + h + bleed + len); // Bottom right
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
  });
}
