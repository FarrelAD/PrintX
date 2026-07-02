import { Routes, Route } from 'react-router';
import type { MetaFunction } from 'react-router';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHome from '@/views/DashboardHome';
import ProjectsView from '@/views/ProjectsView';
import DatasetView from '@/views/DatasetView';
import SettingsView from '@/views/SettingsView';
import ProjectWizardView from '@/views/ProjectWizardView';

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard | PrintX' },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
};

// React Router v7: loader that runs ONLY in the browser
export async function clientLoader() {
  return {};
}

// React Router v7: rendered on server during build-time (safe skeleton)
export function HydrateFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center p-8">
      <div className="flex flex-col items-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary mb-4">
          autorenew
        </span>
        <div className="font-heading text-lg tracking-widest uppercase">
          Memuat Dashboard...
        </div>
      </div>
    </div>
  );
}

// React Router v7: rendered ONLY on client browser
export default function DashboardRoute() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="projects" element={<ProjectsView />} />
        <Route path="dataset" element={<DatasetView />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="project/:id" element={<ProjectWizardView />} />
      </Route>
    </Routes>
  );
}
