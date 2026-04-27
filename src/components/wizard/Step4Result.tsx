import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect, Group } from 'react-konva';
import QRCode from 'qrcode';
import type { ProjectData } from '../../types/project';

// ── Helpers ──────────────────────────────────────────────────────────────────

function useLoadedImage(src?: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) { setImg(null); return; }
    const el = new Image();
    el.src = src;
    el.onload = () => setImg(el);
  }, [src]);
  return img;
}

// ── QRNode ──────────────────────────────────────────────────────────────────

function QRNode({
  value,
  x,
  y,
  width,
  height,
}: {
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const [qrImg, setQrImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(value, {
      margin: 1,
      width: 128, // Low res for preview
      color: {
        dark: '#000000',
        light: '#ffffff00',
      }
    }).then(url => {
      if (!isMounted) return;
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (isMounted) setQrImg(img);
      };
    }).catch(err => console.error('QR Preview failed', err));

    return () => { isMounted = false; };
  }, [value]);

  const size = Math.min(width, height);
  const qrX = x + (width - size) / 2;
  const qrY = y + (height - size) / 2;

  if (!qrImg) {
    return (
      <Group x={x} y={y}>
        <Rect
          width={width}
          height={height}
          fill="#f3f4f6"
          stroke="#d1d5db"
          strokeWidth={1}
        />
        <Text
          width={width}
          height={height}
          text="..."
          align="center"
          verticalAlign="middle"
        />
      </Group>
    );
  }

  return (
    <KonvaImage
      image={qrImg}
      x={qrX}
      y={qrY}
      width={size}
      height={size}
      listening={false}
    />
  );
}

// ── RowPreview ────────────────────────────────────────────────────────────────

function RowPreview({
  rowIndex,
  width = 280,
  data,
  bgImage,
}: {
  rowIndex: number;
  width?: number;
  data: ProjectData;
  bgImage: HTMLImageElement | null;
}) {
  const { design, dataset, mapping } = data;
  if (!design?.preview || !dataset || !mapping) return null;

  const naturalW = bgImage?.naturalWidth ?? 1;
  const naturalH = bgImage?.naturalHeight ?? 1;
  const ratio = naturalH / naturalW;
  const previewH = Math.round(width * ratio);

  const scaleX = width / naturalW;
  const scaleY = previewH / naturalH;

  const row = dataset.rows[rowIndex] ?? [];
  const headerIndex: Record<string, number> = {};
  dataset.headers.forEach((h, i) => { headerIndex[h] = i; });

  return (
    <div className="flex flex-col gap-1 items-center">
      <div
        className="border border-outline-variant overflow-hidden bg-surface-container-low"
        style={{ width: width, height: previewH }}
      >
        <Stage width={width} height={previewH} listening={false}>
          <Layer>
            {bgImage && (
              <KonvaImage
                image={bgImage}
                x={0}
                y={0}
                width={width}
                height={previewH}
                listening={false}
              />
            )}
            {mapping.map((field) => {
              const colIdx = headerIndex[field.column] ?? -1;
              const value = colIdx >= 0 && row[colIdx] !== undefined
                ? String(row[colIdx])
                : `[${field.column}]`;

              if (field.type === 'qrcode') {
                return (
                  <QRNode
                    key={field.id}
                    value={value}
                    x={field.x * scaleX}
                    y={field.y * scaleY}
                    width={field.width * scaleX}
                    height={field.height * scaleY}
                  />
                );
              }

              return (
                <Text
                  key={field.id}
                  x={field.x * scaleX}
                  y={field.y * scaleY}
                  width={field.width * scaleX}
                  height={field.height * scaleY}
                  text={value}
                  fontSize={Math.round(field.fontSize * Math.min(scaleX, scaleY))}
                  fontFamily={field.fontFamily}
                  fill={field.color}
                  align={field.align}
                  verticalAlign="middle"
                  ellipsis
                  wrap="none"
                  listening={false}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
        Data #{rowIndex + 1}
      </span>
    </div>
  );
}

// ── Step4Result ───────────────────────────────────────────────────────────────

export default function Step4Result({
  data,
  onBack,
  onComplete,
}: {
  data: ProjectData;
  onBack: () => void;
  onComplete: () => void;
}) {
  const bgImage = useLoadedImage(data.design?.preview);
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

// ── Stat ─────────────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">{label}</span>
      <span className="text-sm md:text-base font-heading">{value}</span>
    </div>
  );
}
