export type ProjectType = 'id_card' | 'certificate' | 'label' | null;

export type MappingField = {
  id: string;
  column: string;
  type?: 'text' | 'qrcode';
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight?: 'normal' | 'bold';
  align: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  color: string;
  wrap?: boolean;
};

export type PrintConfig = {
  paperSize: 'A4' | 'A3' | 'SRA3' | 'Custom';
  orientation: 'p' | 'l';
  widthCm: number;
  heightCm: number;
  bleedMm: number;
  showCropMarks: boolean;
  nUp: boolean;
  gapHorizontalMm: number;
  gapVerticalMm: number;
};

export type ProjectData = {
  id?: string;
  name?: string;
  updatedAt?: number;
  status?: 'draft' | 'in_progress' | 'ready' | 'finished' | 'Draf' | 'Sedang Dikerjakan' | 'Siap Cetak' | 'Selesai';
  type: ProjectType;
  design?: {
    preview: string | null;
    fileName?: string;
  };
  dataset?: {
    headers: string[];
    rows: (string | number | boolean | null)[][];
    fileName?: string;
  };
  mapping?: MappingField[];
  printConfig?: PrintConfig;
  editorSettings?: {
    showDesign: boolean;
    canvasBgColor: string;
  };
};
