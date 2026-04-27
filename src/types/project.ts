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
  align: 'left' | 'center' | 'right';
  color: string;
};

export type PrintConfig = {
  paperSize: 'A4' | 'A3' | 'SRA3' | 'Custom';
  orientation: 'p' | 'l';
  widthCm: number;
  heightCm: number;
  bleedMm: number;
  showCropMarks: boolean;
  nUp: boolean;
};

export type ProjectData = {
  id?: string;
  name?: string;
  updatedAt?: number;
  status?: 'Draf' | 'Siap Cetak';
  type: ProjectType;
  design?: {
    preview: string | null;
    fileName?: string;
  };
  dataset?: {
    headers: string[];
    rows: any[][];
    fileName?: string;
  };
  mapping?: MappingField[];
  printConfig?: PrintConfig;
};
