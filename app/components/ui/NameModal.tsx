import { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

export default function NameModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  initialValue = '',
  placeholder = 'Masukkan nama...',
  confirmLabel = 'Lanjutkan',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  title: string;
  initialValue?: string;
  placeholder?: string;
  confirmLabel?: string;
}) {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const [name, setName] = useState(initialValue);

  if (isOpen !== prevIsOpen || initialValue !== prevInitialValue) {
    setPrevIsOpen(isOpen);
    setPrevInitialValue(initialValue);
    if (isOpen) {
      setName(initialValue);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <Input
          label="Nama Proyek"
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) onConfirm(name);
            if (e.key === 'Escape') onClose();
          }}
          placeholder={placeholder}
          className="p-4 font-bold"
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => name.trim() && onConfirm(name)}
            disabled={!name.trim()}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onClose}
          >
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  );
}
