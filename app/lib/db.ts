import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ProjectData } from '@/types/project';

type PrintXDB = DBSchema & {
  projects: {
    key: string;
    value: ProjectData;
    indexes: { 'by-date': number };
  };
};

const DB_NAME = 'printx_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PrintXDB>> | null = null;
let persistenceRequested = false;

export async function requestPersistentStorage(): Promise<boolean> {
  if (persistenceRequested) return false;
  persistenceRequested = true;
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.storage &&
      typeof navigator.storage.persist === 'function'
    ) {
      const isPersisted = await navigator.storage.persisted?.();
      if (isPersisted) return true;
      return await navigator.storage.persist();
    }
  } catch {
    // Ignore storage persistence errors in unsupported environments
  }
  return false;
}

export function getDB(): Promise<IDBPDatabase<PrintXDB>> {
  if (!dbPromise) {
    void requestPersistentStorage();
    dbPromise = openDB<PrintXDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', {
            keyPath: 'id',
          });
          projectStore.createIndex('by-date', 'updatedAt');
        }
      },
      terminated() {
        dbPromise = null;
      },
    }).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

export async function resetDBConnection(): Promise<void> {
  if (dbPromise) {
    try {
      const db = await dbPromise;
      db.close();
    } catch {
      // Ignore close errors
    }
    dbPromise = null;
  }
}

const STATUS_MAP: Record<string, NonNullable<ProjectData['status']>> = {
  Draf: 'draft',
  'Sedang Dikerjakan': 'in_progress',
  'Siap Cetak': 'ready',
  Selesai: 'finished',
  draft: 'draft',
  in_progress: 'in_progress',
  ready: 'ready',
  finished: 'finished',
};

export function normalizeStatus(
  status?: ProjectData['status'],
): 'draft' | 'in_progress' | 'ready' | 'finished' {
  if (status && STATUS_MAP[status]) {
    return STATUS_MAP[status] as 'draft' | 'in_progress' | 'ready' | 'finished';
  }
  return 'draft';
}

export function migrateProject(project: ProjectData): ProjectData {
  if (!project) return project;
  return {
    ...project,
    status: normalizeStatus(project.status),
    updatedAt:
      typeof project.updatedAt === 'number' ? project.updatedAt : Date.now(),
  };
}

export function getInitialWizardStep(project?: ProjectData | null): number {
  if (!project || !project.type) {
    return 1;
  }
  if (project.mapping && project.mapping.length > 0) {
    return 4;
  }
  if (project.design?.preview && project.dataset?.rows?.length) {
    return 3;
  }
  return 2;
}

export async function saveProject(project: ProjectData): Promise<ProjectData> {
  const db = await getDB();
  const id = project.id || crypto.randomUUID();
  const existing = project.id
    ? await db.get('projects', project.id)
    : undefined;

  const updatedProject: ProjectData = {
    ...(existing || {}),
    ...project,
    id,
    updatedAt: Date.now(),
    status: normalizeStatus(project.status ?? existing?.status),
  };

  await db.put('projects', updatedProject);
  return updatedProject;
}

export async function getProject(id: string): Promise<ProjectData | undefined> {
  if (!id) return undefined;
  const db = await getDB();
  const project = await db.get('projects', id);
  return project ? migrateProject(project) : undefined;
}

export async function getAllProjects(): Promise<ProjectData[]> {
  const db = await getDB();
  const projects = await db.getAll('projects');
  return projects
    .filter((p): p is ProjectData => Boolean(p && typeof p === 'object'))
    .map(migrateProject)
    .sort((a, b) => (a.updatedAt ?? 0) - (b.updatedAt ?? 0));
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('projects', id);
}

export async function clearAllProjects(): Promise<void> {
  const db = await getDB();
  await db.clear('projects');
}
