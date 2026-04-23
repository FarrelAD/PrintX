export type ProjectType = 'id_card' | 'certificate' | 'label' | null;

export interface ProjectData {
  type: ProjectType;
  design?: {
    file: File | null;
    preview: string | null;
  };
  dataset?: {
    file: File | null;
    headers: string[];
    rows: any[];
  };
}
