import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const statuses: ProjectData['status'][] = ['draft', 'in_progress', 'ready', 'finished'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusKey = (status: ProjectData['status']): string => {
    const map: Record<string, string> = {
      'Draf': 'draft',
      'Sedang Dikerjakan': 'in_progress',
      'Siap Cetak': 'ready',
      'Selesai': 'finished'
    };
    return map[status as string] || (status as string) || 'draft';
  };

  const getStatusColor = (status: ProjectData['status']) => {
    const key = getStatusKey(status);
    switch (key) {
      case 'ready': return 'bg-primary text-white border-primary';
      case 'finished': return 'bg-black text-white border-black';
      case 'in_progress': return 'bg-surface-container-high text-primary border-primary/10';
      default: return 'bg-white text-primary border-primary';
    }
  };

  const getStatusDot = (status: ProjectData['status']) => {
    const key = getStatusKey(status);
    switch (key) {
      case 'ready': return 'bg-white animate-pulse';
      case 'finished': return 'bg-white';
      case 'in_progress': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  const currentKey = getStatusKey(currentStatus);

  return (
    <div className={`relative ${className}`} ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm ${getStatusColor(currentStatus)}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(currentStatus)}`} />
        {t(`status.${currentKey}`)}
        <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${isOpen ? (direction === 'up' ? 'rotate-0' : 'rotate-180') : (direction === 'up' ? 'rotate-180' : 'rotate-0')}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className={`absolute ${direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-48 bg-white border border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-110 animate-in fade-in ${direction === 'up' ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'} duration-150`}>
          <div className="p-2 border-b border-outline-variant bg-surface-container-lowest">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">{t('status.change_status')}</span>
          </div>
          <div className="py-1">
            {statuses.filter(s => ['draft', 'in_progress', 'ready', 'finished'].includes(s as string)).map((status) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(status);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 transition-colors hover:bg-surface-container ${
                  currentKey === status ? 'text-primary' : 'text-secondary'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  status === 'ready' ? 'bg-primary animate-pulse' : 
                  status === 'finished' ? 'bg-black' :
                  status === 'in_progress' ? 'bg-primary' :
                  'bg-secondary'
                }`} />
                {t(`status.${status}`)}
                {currentKey === status && (
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
