import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import OGGenerator from '@/pages/OGGenerator';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHome from '@/views/DashboardHome';
import ProjectsView from '@/views/ProjectsView';
import DatasetView from '@/views/DatasetView';
import SettingsView from '@/views/SettingsView';
import ProjectWizardView from '@/views/ProjectWizardView';
import { PWAProvider } from '@/context/PWAContext';

export default function App() {
  return (
    <PWAProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/og" element={<OGGenerator />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ProjectsView />} />
          <Route path="dataset" element={<DatasetView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="project/:id" element={<ProjectWizardView />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </PWAProvider>
  );
}
