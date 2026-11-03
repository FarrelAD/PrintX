import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveProject,
  getProject,
  getAllProjects,
  deleteProject,
  clearAllProjects,
  resetDBConnection,
  getInitialWizardStep,
  normalizeStatus,
} from '../app/lib/db';
import type { ProjectData } from '../app/types/project';

describe('Local Storage (IndexedDB) & Project Lifecycle', () => {
  beforeEach(async () => {
    await resetDBConnection();
    await clearAllProjects();
  });

  it('should create a new project with a generated UUID and retrieve all fields intact', async () => {
    const newProject: ProjectData = {
      name: 'ID Card Karyawan 2026',
      type: 'id_card',
      design: {
        fileName: 'template-id.png',
        preview:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      },
      dataset: {
        fileName: 'karyawan.xlsx',
        headers: ['Nama', 'NIP', 'Divisi'],
        rows: [
          ['Budi Santoso', '1001', 'Engineering'],
          ['Siti Aminah', '1002', 'Design'],
        ],
      },
      mapping: [
        {
          id: 'field-1',
          column: 'Nama',
          type: 'text',
          x: 50,
          y: 120,
          width: 200,
          height: 40,
          fontSize: 18,
          fontFamily: 'Inter',
          align: 'center',
          verticalAlign: 'middle',
          color: '#000000',
        },
      ],
      printConfig: {
        paperSize: 'A4',
        orientation: 'p',
        widthCm: 8.5,
        heightCm: 5.5,
        bleedMm: 3,
        showCropMarks: true,
        nUp: true,
        gapHorizontalMm: 2,
        gapVerticalMm: 2,
      },
      editorSettings: {
        showDesign: true,
        canvasBgColor: '#ffffff',
      },
    };

    const saved = await saveProject(newProject);
    expect(saved.id).toBeDefined();
    expect(typeof saved.id).toBe('string');
    expect(saved.status).toBe('draft');
    expect(typeof saved.updatedAt).toBe('number');

    const loaded = await getProject(saved.id!);
    expect(loaded).toBeDefined();
    expect(loaded?.id).toBe(saved.id);
    expect(loaded?.name).toBe('ID Card Karyawan 2026');
    expect(loaded?.type).toBe('id_card');
    expect(loaded?.design?.fileName).toBe('template-id.png');
    expect(loaded?.dataset?.rows).toHaveLength(2);
    expect(loaded?.mapping).toHaveLength(1);
    expect(loaded?.mapping?.[0].column).toBe('Nama');
    expect(loaded?.printConfig?.paperSize).toBe('A4');
  });

  it('should preserve existing fields when updating a project across wizard steps', async () => {
    // Step 0: User creates named project from Dashboard modal
    const created = await saveProject({
      name: 'Sertifikat Seminar',
      type: null,
      status: 'draft',
    });
    expect(created.id).toBeDefined();
    expect(created.type).toBeNull();

    // Step 1: User selects category
    const afterStep1 = await saveProject({
      ...created,
      type: 'certificate',
    });
    expect(afterStep1.id).toBe(created.id);
    expect(afterStep1.name).toBe('Sertifikat Seminar');
    expect(afterStep1.type).toBe('certificate');

    // Step 2: User uploads assets
    const afterStep2 = await saveProject({
      id: created.id,
      type: 'certificate',
      design: { preview: 'data:image/png;base64,AAA', fileName: 'cert.png' },
      dataset: {
        headers: ['Peserta'],
        rows: [['Andi']],
        fileName: 'peserta.csv',
      },
    });
    // Name must be preserved from existing record in IndexedDB
    expect(afterStep2.name).toBe('Sertifikat Seminar');
    expect(afterStep2.design?.fileName).toBe('cert.png');
    expect(afterStep2.dataset?.rows).toHaveLength(1);

    const reopened = await getProject(created.id!);
    expect(reopened?.name).toBe('Sertifikat Seminar');
    expect(reopened?.type).toBe('certificate');
    expect(reopened?.dataset?.fileName).toBe('peserta.csv');
  });

  it('should compute the right initial wizard step when opening new or existing projects', () => {
    // Brand new project or named project without category -> Step 1 (Category)
    expect(getInitialWizardStep(null)).toBe(1);
    expect(getInitialWizardStep({ name: 'Named Draft', type: null })).toBe(1);

    // Category chosen, no assets yet -> Step 2 (Assets)
    expect(
      getInitialWizardStep({
        id: 'p1',
        name: 'Draft',
        type: 'id_card',
      }),
    ).toBe(2);

    // Assets uploaded, no mapping yet -> Step 3 (Mapping)
    expect(
      getInitialWizardStep({
        id: 'p2',
        name: 'With Assets',
        type: 'id_card',
        design: { preview: 'data:image/png;base64,AAA' },
        dataset: { headers: ['Name'], rows: [['Alice']] },
      }),
    ).toBe(3);

    // Mappings configured -> Step 4 (Result Preview)
    expect(
      getInitialWizardStep({
        id: 'p3',
        name: 'Mapped Project',
        type: 'id_card',
        design: { preview: 'data:image/png;base64,AAA' },
        dataset: { headers: ['Name'], rows: [['Alice']] },
        mapping: [
          {
            id: 'f1',
            column: 'Name',
            x: 10,
            y: 10,
            width: 100,
            height: 20,
            fontSize: 14,
            fontFamily: 'Inter',
            align: 'left',
            verticalAlign: 'top',
            color: '#000',
          },
        ],
      }),
    ).toBe(4);
  });

  it('should migrate legacy Indonesian status values to canonical status keys', async () => {
    expect(normalizeStatus('Draf')).toBe('draft');
    expect(normalizeStatus('Sedang Dikerjakan')).toBe('in_progress');
    expect(normalizeStatus('Siap Cetak')).toBe('ready');
    expect(normalizeStatus('Selesai')).toBe('finished');

    const saved = await saveProject({
      name: 'Legacy Status Project',
      type: 'label',
      status: 'Siap Cetak',
    });
    expect(saved.status).toBe('ready');

    const loaded = await getProject(saved.id!);
    expect(loaded?.status).toBe('ready');
  });

  it('should list all projects ordered by updatedAt and support deletion and clearing', async () => {
    const p1 = await saveProject({ name: 'Project A', type: 'id_card' });
    await new Promise((r) => setTimeout(r, 10));
    const p2 = await saveProject({ name: 'Project B', type: 'certificate' });

    const all = await getAllProjects();
    expect(all).toHaveLength(2);
    expect(all[0].id).toBe(p1.id);
    expect(all[1].id).toBe(p2.id);

    await deleteProject(p1.id!);
    const afterDelete = await getAllProjects();
    expect(afterDelete).toHaveLength(1);
    expect(afterDelete[0].id).toBe(p2.id);

    await clearAllProjects();
    const afterClear = await getAllProjects();
    expect(afterClear).toHaveLength(0);
  });
});
