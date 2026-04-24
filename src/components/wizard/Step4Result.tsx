import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
import type { ProjectData } from '../../types/project';

// ── Constants ────────────────────────────────────────────────────────────────

const PREVIEW_WIDTH = 280;
const MAX_PREVIEW_ROWS = 6;

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

// ── RowPreview ────────────────────────────────────────────────────────────────

function RowPreview({
  rowIndex,
  data,
  bgImage,
}: {
  rowIndex: number;
  data: ProjectData;
  bgImage: HTMLImageElement | null;
}) {
  const { design, dataset, mapping } = data;
  if (!design?.preview || !dataset || !mapping) return null;

  const naturalW = bgImage?.naturalWidth ?? 1;
  const naturalH = bgImage?.naturalHeight ?? 1;
  const ratio = naturalH / naturalW;
  const previewH = Math.round(PREVIEW_WIDTH * ratio);

  const scaleX = PREVIEW_WIDTH / naturalW;
  const scaleY = previewH / naturalH;

  const row = dataset.rows[rowIndex] ?? [];
  const headerIndex: Record<string, number> = {};
  dataset.headers.forEach((h, i) => { headerIndex[h] = i; });

  return (
    <div className="flex flex-col gap-1 items-center">
      <div
        className="border border-outline-variant overflow-hidden"
        style={{ width: PREVIEW_WIDTH, height: previewH }}
      >
        <Stage width={PREVIEW_WIDTH} height={previewH} listening={false}>
          <Layer>
            {bgImage && (
              <KonvaImage
                image={bgImage}
                x={0}
                y={0}
                width={PREVIEW_WIDTH}
                height={previewH}
                listening={false}
              />
            )}
            {mapping.map((field) => {
              const colIdx = headerIndex[field.column] ?? -1;
              const value = colIdx >= 0 && row[colIdx] !== undefined
                ? String(row[colIdx])
                : `[${field.column}]`;

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
  const previewCount = Math.min(totalRows, MAX_PREVIEW_ROWS);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasMappings = mappedFields > 0 && totalRows > 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-4xl font-heading mb-2 text-center">Konfirmasi Akhir</h2>
      <p className="text-secondary text-center mb-6 md:mb-8 text-xs md:text-sm px-4">
        Pratinjau hasil pemetaan data Anda sebelum proses cetak massal dimulai.
      </p>

      {/* Preview grid */}
      <div className="border border-primary bg-white p-4 md:p-6 mb-6">
        <div className="flex justify-between items-end mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">
              Pratinjau Output
            </p>
            <p className="text-lg font-heading mt-0.5">
              {previewCount} dari {totalRows} dokumen
            </p>
          </div>
          {previewCount < totalRows && (
            <p className="text-[10px] text-secondary italic">
              +{totalRows - previewCount} dokumen lainnya
            </p>
          )}
        </div>

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
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2"
          >
            {Array.from({ length: previewCount }, (_, i) => (
              <div key={i} className="shrink-0">
                <RowPreview
                  rowIndex={i}
                  data={data}
                  bgImage={bgImage}
                />
              </div>
            ))}
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
