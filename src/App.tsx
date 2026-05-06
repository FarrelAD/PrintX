import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LandingPage from '@/pages/LandingPage';
import OGGenerator from '@/pages/OGGenerator';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHome from '@/views/DashboardHome';
import ProjectsView from '@/views/ProjectsView';
import DatasetView from '@/views/DatasetView';
import SettingsView from '@/views/SettingsView';
import ProjectWizardView from '@/views/ProjectWizardView';
import { PWAProvider } from '@/context/PWAContext';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App() {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
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
          
          {/* Catch-all route to prevent white screen on routing errors */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
              <h1 className="text-4xl font-heading mb-4">{t('common.error.page_not_found')}</h1>
              <p className="text-secondary mb-8">{t('common.error.page_not_found_desc')}</p>
              <button 
                onClick={() => window.location.href = import.meta.env.BASE_URL}
                className="bg-primary text-white px-8 py-3 uppercase tracking-widest font-bold"
              >
                {t('common.error.back_to_home')}
              </button>
              <div className="mt-12 text-[10px] text-secondary font-mono">
                Debug Info: {window.location.pathname} | Base: {import.meta.env.BASE_URL}
              </div>
            </div>
          } />
        </Routes>
        </BrowserRouter>
      </PWAProvider>
    </ErrorBoundary>
  );
}
