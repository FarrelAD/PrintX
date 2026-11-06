import React from 'react';

export function ColumnChip({
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
        ${
          isActive
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
