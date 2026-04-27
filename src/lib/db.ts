import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ProjectData } from '../types/project';

interface PrintXDB extends DBSchema {
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

export async function saveProject(project: ProjectData) {
  const db = await getDB();
  const id = project.id || crypto.randomUUID();
  const updatedProject = {
    ...project,
    id,
    updatedAt: Date.now(),
    status: project.status || 'Draf',
  };
  await db.put('projects', updatedProject);
  return updatedProject;
}

export async function getProject(id: string) {
  const db = await getDB();
  return db.get('projects', id);
}

export async function getAllProjects() {
  const db = await getDB();
  return db.getAllFromIndex('projects', 'by-date');
}

export async function deleteProject(id: string) {
  const db = await getDB();
  await db.delete('projects', id);
}
