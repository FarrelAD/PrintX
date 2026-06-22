import { useState, useEffect } from 'react';

export default function NameModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  initialValue = '',
  placeholder = 'Masukkan nama...',
  confirmLabel = 'Lanjutkan'
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  title: string;
  initialValue?: string;
  placeholder?: string;
  confirmLabel?: string;
}) {
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setName(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white border-2 border-primary p-8 md:p-12 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h3 className="text-3xl md:text-4xl font-heading mb-6 uppercase tracking-tighter leading-none">
          {title}
        </h3>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-2">Nama Proyek</label>
            <input 
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) onConfirm(name);
                if (e.key === 'Escape') onClose();
              }}
              placeholder={placeholder}
              className="w-full bg-white border border-primary p-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              onClick={() => name.trim() && onConfirm(name)}
              disabled={!name.trim()}
              className="flex-1 bg-primary text-white py-4 px-8 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {confirmLabel}
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-white border border-primary text-primary py-4 px-8 text-xs font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
