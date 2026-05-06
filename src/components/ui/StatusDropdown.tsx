import { useState, useRef, useEffect } from 'react';
import type { ProjectData } from '@/types/project';

export default function StatusDropdown({ 
  currentStatus, 
  onStatusChange, 
  className = '',
  direction = 'up' 
}: {
  currentStatus: ProjectData['status'];
  onStatusChange: (status: ProjectData['status']) => void;
  className?: string;
  direction?: 'up' | 'down';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const statuses: ProjectData['status'][] = ['Draf', 'Sedang Dikerjakan', 'Siap Cetak', 'Selesai'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status: ProjectData['status']) => {
    switch (status) {
      case 'Siap Cetak': return 'bg-primary text-white border-primary';
      case 'Selesai': return 'bg-black text-white border-black';
      case 'Sedang Dikerjakan': return 'bg-surface-container-high text-primary border-primary/10';
      default: return 'bg-white text-primary border-primary';
    }
  };

  const getStatusDot = (status: ProjectData['status']) => {
    switch (status) {
      case 'Siap Cetak': return 'bg-white animate-pulse';
      case 'Selesai': return 'bg-white';
      case 'Sedang Dikerjakan': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm ${getStatusColor(currentStatus)}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(currentStatus)}`} />
        {currentStatus || 'Draf'}
        <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${isOpen ? (direction === 'up' ? 'rotate-0' : 'rotate-180') : (direction === 'up' ? 'rotate-180' : 'rotate-0')}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className={`absolute ${direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-48 bg-white border border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-110 animate-in fade-in ${direction === 'up' ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'} duration-150`}>
          <div className="p-2 border-b border-outline-variant bg-surface-container-lowest">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Ubah Status</span>
          </div>
          <div className="py-1">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(status);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 transition-colors hover:bg-surface-container ${
                  currentStatus === status ? 'text-primary' : 'text-secondary'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  status === 'Siap Cetak' ? 'bg-primary animate-pulse' : 
                  status === 'Selesai' ? 'bg-black' :
                  status === 'Sedang Dikerjakan' ? 'bg-primary' :
                  'bg-secondary'
                }`} />
                {status}
                {currentStatus === status && (
                  <span className="material-symbols-outlined text-sm ml-auto">check</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
