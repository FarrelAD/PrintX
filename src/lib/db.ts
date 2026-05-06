import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ProjectData } from '@/types/project';

type PrintXDB = DBSchema & {
  projects: {
    key: string;
    value: ProjectData;
    indexes: { 'by-date': number };
  };
}

const DB_NAME = 'printx_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PrintXDB>>;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<PrintXDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const projectStore = db.createObjectStore('projects', {
          keyPath: 'id',
        });
        projectStore.createIndex('by-date', 'updatedAt');
      },
    });
  }
  return dbPromise;
}

const STATUS_MAP: Record<string, string> = {
  'Draf': 'draft',
  'Sedang Dikerjakan': 'in_progress',
  'Siap Cetak': 'ready',
  'Selesai': 'finished'
};

function migrateProject(project: ProjectData): ProjectData {
  if (!project) return project;
  if (project.status && STATUS_MAP[project.status]) {
    return { ...project, status: STATUS_MAP[project.status] as any };
  }
  return project;
}

export async function saveProject(project: ProjectData) {
  const db = await getDB();
  const id = project.id || crypto.randomUUID();
  const updatedProject = {
    ...project,
    id,
    updatedAt: Date.now(),
    status: (project.status && STATUS_MAP[project.status] ? STATUS_MAP[project.status] : project.status) || 'draft',
  };
  await db.put('projects', updatedProject as ProjectData);
  return updatedProject as ProjectData;
}

export async function getProject(id: string) {
  const db = await getDB();
  const project = await db.get('projects', id);
  return project ? migrateProject(project) : undefined;
}

export async function getAllProjects() {
  const db = await getDB();
  const projects = await db.getAllFromIndex('projects', 'by-date');
  return projects.map(migrateProject);
}

export async function deleteProject(id: string) {
  const db = await getDB();
  await db.delete('projects', id);
}
