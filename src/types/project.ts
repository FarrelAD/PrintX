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
};
