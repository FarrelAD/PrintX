import { useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect, Transformer, Group } from 'react-konva';
import type Konva from 'konva';
import type { ProjectData, MappingField } from '../../types/project';

// ─── Constants ───────────────────────────────────────────────────────────────

const FONT_OPTIONS = [
  { label: 'Inter (Sans-serif)', value: 'Inter' },
  { label: 'Newsreader (Serif)', value: 'Newsreader' },
  { label: 'Playfair Display (Elegan)', value: 'Playfair Display' },
  { label: 'Bebas Neue (Display)', value: 'Bebas Neue' },
  { label: 'Source Code Pro (Monospace)', value: 'Source Code Pro' },
  { label: 'Georgia (Serif)', value: 'Georgia' },
  { label: 'Arial (Sans-serif)', value: 'Arial' },
  { label: 'Courier New (Monospace)', value: 'Courier New' },
];

const ALIGN_OPTIONS: { value: MappingField['align']; icon: string }[] = [
  { value: 'left', icon: 'format_align_left' },
  { value: 'center', icon: 'format_align_center' },
  { value: 'right', icon: 'format_align_right' },
];

const DEFAULT_FIELD_W = 180;
const DEFAULT_FIELD_H = 40;
const DEFAULT_FONT_SIZE = 16;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ColumnChip({
  header,
  isUsed,
  isActive,
  onDragStart,
  onClick,
}: {
  header: string;
  isUsed: boolean;
  isActive?: boolean;
  onDragStart: (header: string, e: React.DragEvent) => void;
  onClick: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(header, e)}
      onClick={onClick}
      className={`
        flex items-center justify-between gap-2 px-4 py-3 md:py-2.5
        border-2 text-[10px] md:text-xs font-bold uppercase tracking-widest
        cursor-grab active:cursor-grabbing select-none
        transition-all duration-200
        ${isActive
          ? 'border-secondary bg-secondary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] scale-95'
          : isUsed
            ? 'border-primary bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
            : 'border-primary bg-white hover:bg-surface-container hover:shadow-[4px_4px_0px_0px_var(--color-primary)]'
        }
      `}
    >
      <span className="truncate">{header}</span>
      <span className="material-symbols-outlined text-sm shrink-0">
        {isUsed ? 'check_circle' : 'drag_indicator'}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
  // ── State ──
  const [fields, setFields] = useState<MappingField[]>(data.mapping ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [dragOverCanvas, setDragOverCanvas] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  // ── Refs ──
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const draggingColumn = useRef<string>('');

  // ── Load background image ──
  useEffect(() => {
    if (!data.design?.preview) return;
    const img = new Image();
    img.src = data.design.preview;
    img.onload = () => setBgImage(img);
  }, [data.design?.preview]);

  // ── Compute stage size from container ──
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      if (!bgImage) {
        setStageSize({ width: w, height: Math.round(w * 0.6) });
        return;
      }
      const ratio = bgImage.naturalHeight / bgImage.naturalWidth;
      setStageSize({ width: w, height: Math.round(w * ratio) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [bgImage]);

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
    onUpdate({ ...data, mapping: fields });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

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
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newField: MappingField = {
        id: uid(),
        column: col,
        x: Math.max(0, x - DEFAULT_FIELD_W / 2),
        y: Math.max(0, y - DEFAULT_FIELD_H / 2),
        width: DEFAULT_FIELD_W,
        height: DEFAULT_FIELD_H,
        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: 'Inter',
        align: 'left',
        color: '#000000',
      };
      setFields((prev) => [...prev, newField]);
      setSelectedId(newField.id);
      draggingColumn.current = '';
    },
    []
  );

  // ── Field mutation helpers ──
  const updateField = useCallback((id: string, patch: Partial<MappingField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const deleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedId(null);
  }, []);

  // ── Derived ──
  const selectedField = fields.find((f) => f.id === selectedId) ?? null;
  const usedColumns = new Set(fields.map((f) => f.column));
  const headers = data.dataset?.headers ?? [];
  const hasMappings = fields.length > 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-4xl font-heading mb-2 text-center">Pemetaan Data</h2>
      <p className="text-secondary text-center mb-6 md:mb-8 text-xs md:text-sm px-4">
        Seret kolom dari panel kiri ke atas desain untuk menempatkan bidang data.
      </p>

      {/* ── Three-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-4">

        {/* ── Left: Column Panel ── */}
        <div className="w-full lg:w-56 shrink-0 flex flex-col gap-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">table_chart</span>
            Kolom Dataset
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
              ? `Pilih "${activeColumn}" aktif. Klik di kanvas untuk menempatkan.`
              : 'Seret kolom ke area kanvas atau klik untuk memilih (mobile).'}
          </div>
        </div>

        {/* ── Center: Canvas ── */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">design_services</span>
            Kanvas Desain
            {hasMappings && (
              <span className="ml-auto text-primary">
                {fields.length} bidang
              </span>
            )}
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
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const newField: MappingField = {
                  id: uid(),
                  column: activeColumn,
                  x: Math.max(0, x - DEFAULT_FIELD_W / 2),
                  y: Math.max(0, y - DEFAULT_FIELD_H / 2),
                  width: DEFAULT_FIELD_W,
                  height: DEFAULT_FIELD_H,
                  fontSize: DEFAULT_FONT_SIZE,
                  fontFamily: 'Inter',
                  align: 'left',
                  color: '#000000',
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
                  {/* Background design image */}
                  {bgImage && (
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
                <span className="text-xs uppercase tracking-widest">Tidak ada desain dimuat</span>
              </div>
            )}

            {dragOverCanvas && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-primary/10">
                <div className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 shadow-lg">
                  Lepaskan untuk menempatkan
                </div>
              </div>
            )}

            {activeColumn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-secondary/10">
                <div className="bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 shadow-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">touch_app</span>
                  Klik di mana saja untuk menempatkan "{activeColumn}"
                </div>
              </div>
            )}
          </div>

          {/* Empty canvas hint */}
          {data.design?.preview && fields.length === 0 && (
            <div className="flex items-center gap-2 text-[10px] text-secondary italic mt-1">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
              Seret kolom dari panel kiri ke atas kanvas desain
            </div>
          )}
        </div>

        {/* ── Right: Properties Panel ── */}
        <div className="w-full lg:w-56 shrink-0 flex flex-col gap-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">tune</span>
            Properti Bidang
          </div>

          {!selectedField ? (
            <div className="border border-dashed border-outline-variant p-6 text-center flex-1">
              <span className="material-symbols-outlined text-2xl text-secondary mb-2 block">
                touch_app
              </span>
              <p className="text-[10px] text-secondary italic">
                Klik bidang di kanvas untuk mengeditnya
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
          Kembali
        </button>
        <button
          onClick={onNext}
          disabled={!hasMappings}
          title={!hasMappings ? 'Tambahkan minimal satu bidang ke kanvas terlebih dahulu' : ''}
          className={`flex-1 md:flex-none py-3 px-12 bg-primary text-white text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all ${
            !hasMappings ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          Pratinjau &amp; Selesai
        </button>
      </div>
    </div>
  );
}

// ─── FieldNode ────────────────────────────────────────────────────────────────

function FieldNode({
  field,
  isSelected,
  onSelect,
  onChange,
}: {
  field: MappingField;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<MappingField>) => void;
}) {
  const groupRef = useRef<Konva.Group>(null);

  // Sync size back after transformer resize
  const handleTransformEnd = () => {
    const node = groupRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      x: node.x(),
      y: node.y(),
      width: Math.max(40, node.width() * scaleX),
      height: Math.max(20, node.height() * scaleY),
    });
  };

  const label = `{{${field.column}}}`;

  return (
    <Group
      ref={groupRef}
      id={`field-${field.id}`}
      x={field.x}
      y={field.y}
      width={field.width}
      height={field.height}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e: { target: Konva.Node }) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={handleTransformEnd}
    >
      {/* Background rect */}
      <Rect
        x={0}
        y={0}
        width={field.width}
        height={field.height}
        fill={isSelected ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'}
        stroke={isSelected ? '#000000' : 'rgba(0,0,0,0.3)'}
        strokeWidth={isSelected ? 1.5 : 1}
        dash={isSelected ? undefined : [4, 3]}
      />
      {/* Label text */}
      <Text
        x={4}
        y={4}
        width={field.width - 8}
        height={field.height - 8}
        text={label}
        fontSize={field.fontSize}
        fontFamily={field.fontFamily}
        fill={field.color}
        align={field.align}
        verticalAlign="middle"
        ellipsis
        wrap="none"
        listening={false}
      />
    </Group>
  );
}

// ─── PropertiesPanel ─────────────────────────────────────────────────────────

function PropertiesPanel({
  field,
  onChange,
  onDelete,
}: {
  field: MappingField;
  onChange: (patch: Partial<MappingField>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Column name (read-only) */}
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block mb-1">
          Kolom Terpilih
        </label>
        <div className="border border-primary bg-primary text-white px-3 py-2 text-xs font-bold uppercase tracking-widest truncate">
          {field.column}
        </div>
      </div>

      {/* Font family */}
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block mb-1">
          Font
        </label>
        <select
          value={field.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
          className="w-full border border-outline-variant bg-white px-2 py-2 text-xs focus:outline-none focus:border-primary"
          style={{ fontFamily: field.fontFamily }}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font size */}
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block mb-1">
          Ukuran Font — {field.fontSize}px
        </label>
        <input
          type="range"
          min={8}
          max={72}
          value={field.fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[9px] text-secondary mt-0.5">
          <span>8</span><span>72</span>
        </div>
      </div>

      {/* Alignment */}
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block mb-1">
          Rata Teks
        </label>
        <div className="flex border border-outline-variant overflow-hidden">
          {ALIGN_OPTIONS.map((a) => (
            <button
              key={a.value}
              onClick={() => onChange({ align: a.value })}
              title={a.value}
              className={`flex-1 py-2 flex items-center justify-center transition-colors ${
                field.align === a.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-secondary hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{a.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block mb-1">
          Warna Teks
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={field.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="w-10 h-9 border border-outline-variant cursor-pointer bg-white p-0.5"
          />
          <span className="text-xs font-mono text-secondary">{field.color.toUpperCase()}</span>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="mt-2 w-full py-2 border border-outline-variant text-[10px] font-bold uppercase tracking-widest text-secondary hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
        Hapus Bidang
      </button>
    </div>
  );
}
