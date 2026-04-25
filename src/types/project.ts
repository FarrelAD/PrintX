export type ProjectType = 'id_card' | 'certificate' | 'label' | null;

export type MappingField = {
  id: string;
  column: string;
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
  type: ProjectType;
  design?: {
    file: File | null;
    preview: string | null;
  };
  dataset?: {
    file: File | null;
    headers: string[];
    rows: any[][];
  };
  mapping?: MappingField[];
  printConfig?: PrintConfig;
};
