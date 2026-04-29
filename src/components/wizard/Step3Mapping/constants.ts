import type { MappingField } from '@/types/project';

export const FONT_OPTIONS = [
  { label: 'Inter (Sans-serif)', value: 'Inter' },
  { label: 'Newsreader (Serif)', value: 'Newsreader' },
  { label: 'Playfair Display (Elegan)', value: 'Playfair Display' },
  { label: 'Bebas Neue (Display)', value: 'Bebas Neue' },
  { label: 'Source Code Pro (Monospace)', value: 'Source Code Pro' },
  { label: 'Georgia (Serif)', value: 'Georgia' },
  { label: 'Arial (Sans-serif)', value: 'Arial' },
  { label: 'Courier New (Monospace)', value: 'Courier New' },
];

export const ALIGN_OPTIONS: { value: MappingField['align']; icon: string }[] = [
  { value: 'left', icon: 'format_align_left' },
  { value: 'center', icon: 'format_align_center' },
  { value: 'right', icon: 'format_align_right' },
];

export const DEFAULT_FIELD_W = 180;
export const DEFAULT_FIELD_H = 40;
export const DEFAULT_FONT_SIZE = 16;
