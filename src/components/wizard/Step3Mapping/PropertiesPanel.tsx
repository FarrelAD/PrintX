import type { MappingField } from '@/types/project';
import { FONT_OPTIONS, ALIGN_OPTIONS, VERTICAL_ALIGN_OPTIONS } from './constants';

export function PropertiesPanel({
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
      {/* Field Type Toggle */}
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block mb-1">
          Tipe Bidang
        </label>
        <div className="flex border border-outline-variant overflow-hidden">
          <button
            onClick={() => onChange({ type: 'text' })}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              (field.type || 'text') === 'text'
                ? 'bg-primary text-white'
                : 'bg-white text-secondary hover:bg-surface-container'
            }`}
          >
            Teks
          </button>
          <button
            onClick={() => onChange({ type: 'qrcode' })}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              field.type === 'qrcode'
                ? 'bg-primary text-white'
                : 'bg-white text-secondary hover:bg-surface-container'
            }`}
          >
            QR Code
          </button>
        </div>
      </div>

      {/* Column name (read-only) */}
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block mb-1">
          Kolom Terpilih
        </label>
        <div className="border border-primary bg-primary text-white px-3 py-2 text-xs font-bold uppercase tracking-widest truncate">
          {field.column}
        </div>
      </div>

      {field.type === 'qrcode' ? (
        <div className="p-3 bg-surface-container-high border border-primary/20 text-[10px] text-secondary leading-relaxed">
          <span className="material-symbols-outlined text-sm align-middle mr-1 text-primary">qr_code_2</span>
          Data akan diubah menjadi QR Code secara otomatis saat proses cetak.
        </div>
      ) : (
        <>
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

          {/* Vertical Alignment */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-secondary block mb-1">
              Rata Vertikal
            </label>
            <div className="flex border border-outline-variant overflow-hidden">
              {VERTICAL_ALIGN_OPTIONS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => onChange({ verticalAlign: a.value })}
                  title={a.value}
                  className={`flex-1 py-2 flex items-center justify-center transition-colors ${
                    field.verticalAlign === a.value
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

          {/* Wrap Text */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={!!field.wrap}
                  onChange={(e) => onChange({ wrap: e.target.checked })}
                  className="peer h-4 w-4 cursor-pointer appearance-none border border-outline-variant transition-all checked:bg-primary checked:border-primary"
                />
                <span className="material-symbols-outlined absolute text-[12px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  check
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">
                Text Wrapping
              </span>
            </label>
          </div>
        </>
      )}

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
