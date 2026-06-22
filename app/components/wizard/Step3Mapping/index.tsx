import { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Stage, Layer, Image as KonvaImage, Rect as KonvaRect, Transformer } from 'react-konva';
import type Konva from 'konva';
import type { ProjectData, MappingField } from '@/types/project';
import { useImageLoader } from '@/hooks/useImageLoader';
import { useStageSize } from '@/hooks/useStageSize';
import { uid } from '@/utils/uid';

import { 
  DEFAULT_FIELD_W, 
  DEFAULT_FIELD_H, 
  DEFAULT_FONT_SIZE 
} from './constants';
import { ColumnChip } from './ColumnChip';
import { FieldNode } from './FieldNode';
import { PropertiesPanel } from './PropertiesPanel';

export default function Step3Mapping({
  data,
  onUpdate,
  onNext,
  onBack,
}: {
  data: ProjectData;
  onUpdate: (data: ProjectData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const [fields, setFields] = useState<MappingField[]>(data.mapping ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragOverCanvas, setDragOverCanvas] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [showDesign, setShowDesign] = useState(data.editorSettings?.showDesign ?? true);
  const [canvasBgColor, setCanvasBgColor] = useState(data.editorSettings?.canvasBgColor ?? '#ffffff');

  // ── Refs ──
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const draggingColumn = useRef<string>('');

  // ── Image + Stage size (shared hooks) ──
  const bgImage = useImageLoader(data.design?.preview);
  const stageSize = useStageSize(containerRef, bgImage);

  // ── Attach Transformer to selected node ──
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (!selectedId) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }
    const node = stageRef.current.findOne(`#field-${selectedId}`);
    if (node) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, fields]);

  // ── Sync to parent ──
  useEffect(() => {
    onUpdate({ 
      ...data, 
      mapping: fields,
      editorSettings: { showDesign, canvasBgColor }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, showDesign, canvasBgColor]);

  const stageScale = bgImage ? stageSize.width / bgImage.naturalWidth : 1;

  // ── Drag handlers (from column panel) ──
  const handleColumnDragStart = useCallback(
    (header: string, e: React.DragEvent) => {
      draggingColumn.current = header;
      e.dataTransfer.effectAllowed = 'copy';
    },
    []
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOverCanvas(false);
      const col = draggingColumn.current;
      if (!col || !stageRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / stageScale;
      const y = (e.clientY - rect.top) / stageScale;

      const newField: MappingField = {
        id: uid(),
        column: col,
        type: 'text',
        x: Math.max(0, x - DEFAULT_FIELD_W / 2),
        y: Math.max(0, y - DEFAULT_FIELD_H / 2),
        width: DEFAULT_FIELD_W,
        height: DEFAULT_FIELD_H,
        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: 'Inter',
        align: 'left',
        verticalAlign: 'middle',
        color: '#000000',
        wrap: false,
      };
      setFields((prev) => [...prev, newField]);
      setSelectedId(newField.id);
      draggingColumn.current = '';
    },
    [stageScale]
  );

  // ── Field mutation helpers ──
  const updateField = useCallback((id: string, patch: Partial<MappingField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const deleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedId(null);
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm(t('wizard.step3.reset_confirm') || 'Hapus semua bidang yang sudah ditempatkan?')) {
      setFields([]);
      setSelectedId(null);
    }
  }, [t]);

  // ── Derived ──
  const selectedField = fields.find((f) => f.id === selectedId) ?? null;
  const usedColumns = new Set(fields.map((f) => f.column));
  const headers = data.dataset?.headers ?? [];
  const hasMappings = fields.length > 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-4xl font-heading mb-2 text-center">{t('wizard.step3.title')}</h2>
      <p className="text-secondary text-center mb-6 md:mb-8 text-xs md:text-sm px-4">
        {t('wizard.step3.desc')}
      </p>

      {/* ── Three-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-4">

        {/* ── Left: Column Panel ── */}
        <div className="w-full lg:w-56 shrink-0 flex flex-col gap-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">table_chart</span>
            {t('wizard.step3.panels.dataset_columns')}
          </div>

          {headers.length === 0 ? (
            <div className="border border-dashed border-outline-variant p-6 text-center">
              <p className="text-[10px] text-secondary italic">Tidak ada dataset ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-1.5 max-h-[300px] lg:max-h-[420px] overflow-y-auto pr-1">
              {headers.map((header) => (
                <ColumnChip
                  key={header}
                  header={header}
                  isUsed={usedColumns.has(header)}
                  isActive={activeColumn === header}
                  onDragStart={handleColumnDragStart}
                  onClick={() => setActiveColumn(prev => prev === header ? null : header)}
                />
              ))}
            </div>
          )}

          <div className="mt-2 p-3 bg-surface-container border border-outline-variant text-[9px] text-secondary leading-relaxed">
            <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
            {activeColumn 
              ? t('wizard.step3.active_hint', { column: activeColumn }) || `Pilih "${activeColumn}" aktif. Klik di kanvas untuk menempatkan.`
              : t('wizard.step3.toolbar.drag_hint')}
          </div>
        </div>

        {/* ── Center: Canvas ── */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">design_services</span>
            {t('wizard.step3.panels.design_canvas') || 'Kanvas Desain'}
            {hasMappings && (
              <div className="ml-auto flex items-center gap-3">
                <span className="text-primary">
                  {fields.length} {t('wizard.step3.fields_count') || 'bidang'}
                </span>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors font-bold"
                  title="Hapus semua bidang"
                >
                  <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                  <span>RESET</span>
                </button>
              </div>
            )}
          </div>

          <div
            className="flex flex-col border border-outline-variant overflow-hidden"
          >
            {/* Background Toolbar */}
            <div className="flex items-center gap-4 bg-surface-container px-3 py-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDesign(!showDesign)}
                  className={`flex items-center gap-1.5 px-2 py-1 text-[9px] font-bold uppercase transition-colors ${
                    showDesign ? 'bg-primary text-white' : 'bg-white text-secondary border border-outline-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {showDesign ? 'visibility' : 'visibility_off'}
                  </span>
                  {showDesign ? (t('wizard.step3.design_on') || 'Desain On') : (t('wizard.step3.design_off') || 'Desain Off')}
                </button>
              </div>
              <div className="h-4 w-px bg-outline-variant" />
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold uppercase text-secondary">{t('wizard.step3.canvas_bg') || 'BG Kanvas'}:</span>
                <div className="flex gap-1.5">
                  {[
                    { label: t('common.white') || 'Putih', value: '#ffffff' },
                    { label: t('common.gray') || 'Abu', value: '#f3f4f6' },
                    { label: t('common.black') || 'Hitam', value: '#111827' },
                    { label: 'Grid', value: 'transparent' },
                  ].map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCanvasBgColor(c.value)}
                      title={c.label}
                      className={`w-5 h-5 border transition-all ${
                        canvasBgColor === c.value ? 'border-primary ring-1 ring-primary' : 'border-outline-variant'
                      }`}
                      style={{ 
                        backgroundColor: c.value === 'transparent' ? '#fff' : c.value,
                        backgroundImage: c.value === 'transparent' ? 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 8px 8px' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              ref={containerRef}
            onDragOver={(e) => { e.preventDefault(); setDragOverCanvas(true); }}
            onDragLeave={() => setDragOverCanvas(false)}
            onDrop={handleCanvasDrop}
            onClick={(e) => {
              // Tap-to-place logic for mobile/click
              if (activeColumn) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / stageScale;
                const y = (e.clientY - rect.top) / stageScale;

                const newField: MappingField = {
                  id: uid(),
                  column: activeColumn,
                  type: 'text',
                  x: Math.max(0, x - DEFAULT_FIELD_W / 2),
                  y: Math.max(0, y - DEFAULT_FIELD_H / 2),
                  width: DEFAULT_FIELD_W,
                  height: DEFAULT_FIELD_H,
                  fontSize: DEFAULT_FONT_SIZE,
                  fontFamily: 'Inter',
                  align: 'left',
                  verticalAlign: 'middle',
                  color: '#000000',
                  wrap: false,
                };
                setFields((prev) => [...prev, newField]);
                setSelectedId(newField.id);
                setActiveColumn(null); // Clear after placement
                return;
              }

              // Deselect when clicking canvas background (not a field)
              if (e.target === e.currentTarget) setSelectedId(null);
            }}
            className={`
              relative border-2 transition-colors duration-150 overflow-hidden min-w-0
              ${dragOverCanvas ? 'border-primary bg-primary/5' : 'border-outline-variant'}
              ${activeColumn ? 'cursor-crosshair border-secondary bg-secondary/5 shadow-inner' : ''}
              ${!data.design?.preview ? 'bg-surface-container' : ''}
            `}
            style={{ minHeight: 240 }}
          >
            {stageSize.width > 0 && (
              <Stage
                ref={stageRef}
                width={stageSize.width}
                height={stageSize.height}
                onClick={(e) => {
                  if (e.target === e.target.getStage()) setSelectedId(null);
                }}
              >
                <Layer>
                  {/* Background rect */}
                  <KonvaRect
                    x={0}
                    y={0}
                    width={stageSize.width}
                    height={stageSize.height}
                    fill={canvasBgColor === 'transparent' ? '#ffffff' : canvasBgColor}
                  />
                  {canvasBgColor === 'transparent' && (
                     <KonvaRect
                      x={0}
                      y={0}
                      width={stageSize.width}
                      height={stageSize.height}
                      fillPatternImage={(() => {
                         const c = document.createElement('canvas');
                         c.width = 16; c.height = 16;
                         const ctx = c.getContext('2d')!;
                         ctx.fillStyle = '#f3f4f6';
                         ctx.fillRect(0,0,8,8); ctx.fillRect(8,8,8,8);
                         return c as unknown as HTMLImageElement;
                      })()}
                    />
                  )}

                  {/* Background design image */}
                  {bgImage && showDesign && (
                    <KonvaImage
                      image={bgImage}
                      x={0}
                      y={0}
                      width={stageSize.width}
                      height={stageSize.height}
                      listening={false}
                    />
                  )}
  
                  {/* Field nodes */}
                  {fields.map((field) => (
                    <FieldNode
                      key={field.id}
                      field={field}
                      scale={stageScale}
                      isSelected={field.id === selectedId}
                      onSelect={() => setSelectedId(field.id)}
                      onChange={(patch) => updateField(field.id, patch)}
                    />
                  ))}
  
                  {/* Transformer */}
                  <Transformer
                    ref={transformerRef}
                    keepRatio={false}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 40 || newBox.height < 20) return oldBox;
                      return newBox;
                    }}
                    borderStroke="#000"
                    borderStrokeWidth={1.5}
                    borderDash={[4, 3]}
                    anchorStroke="#000"
                    anchorFill="#fff"
                    anchorSize={8}
                    rotateEnabled={false}
                  />
                </Layer>
              </Stage>
            )}

            {!data.design?.preview && (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-secondary bg-surface-container/50">
                <span className="material-symbols-outlined text-3xl">image_not_supported</span>
                <span className="text-xs uppercase tracking-widest">{t('wizard.step3.no_design_hint') || 'Tidak ada desain dimuat'}</span>
              </div>
            )}

            {dragOverCanvas && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-primary/10">
                <div className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 shadow-lg">
                  {t('wizard.step3.drop_hint') || 'Lepaskan untuk menempatkan'}
                </div>
              </div>
            )}

            {activeColumn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-secondary/10">
                <div className="bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 shadow-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">touch_app</span>
                  {t('wizard.step3.click_hint', { column: activeColumn }) || `Klik di mana saja untuk menempatkan "${activeColumn}"`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty canvas hint */}
        {data.design?.preview && fields.length === 0 && (
          <div className="flex items-center gap-2 text-[10px] text-secondary italic mt-1">
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
            {t('wizard.step3.empty_canvas_hint') || 'Seret kolom dari panel kiri ke atas kanvas desain'}
          </div>
        )}
      </div>

      {/* ── Right: Properties Panel ── */}
      <div className="w-full lg:w-56 shrink-0 flex flex-col gap-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">tune</span>
          {t('wizard.step3.properties.title')}
        </div>

        {!selectedField ? (
          <div className="border border-dashed border-outline-variant p-6 text-center flex-1">
            <span className="material-symbols-outlined text-2xl text-secondary mb-2 block">
              touch_app
            </span>
            <p className="text-[10px] text-secondary italic">
              {t('wizard.step3.properties.empty_hint')}
            </p>
          </div>
        ) : (
          <PropertiesPanel
            field={selectedField}
            onChange={(patch) => updateField(selectedField.id, patch)}
            onDelete={() => deleteField(selectedField.id)}
          />
        )}
      </div>
    </div>

    {/* ── Nav buttons ── */}
    <div className="mt-10 flex justify-between gap-4">
      <button
        onClick={onBack}
        className="flex-1 md:flex-none py-3 px-8 border border-primary text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
      >
        {t('common.back')}
      </button>
      <button
        onClick={onNext}
        disabled={!hasMappings}
        title={!hasMappings ? t('wizard.step3.mapping_required') || 'Tambahkan minimal satu bidang ke kanvas terlebih dahulu' : ''}
        className={`flex-1 md:flex-none py-3 px-12 bg-primary text-white text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all ${
          !hasMappings ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        {t('wizard.step3.nav_next') || 'Pratinjau & Selesai'}
      </button>
    </div>
  </div>
);
}
