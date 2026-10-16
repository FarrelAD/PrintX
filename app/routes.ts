import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from '@react-router/dev/routes';

export default [
  route('/', 'routes/home.tsx'),
  ...prefix('dashboard', [
    layout('layouts/DashboardLayout.tsx', [
      index('views/DashboardHome.tsx'),
      route('projects', 'views/ProjectsView.tsx'),
      route('dataset', 'views/DatasetView.tsx'),
      route('settings', 'views/SettingsView.tsx'),
      route('project/:id', 'views/ProjectWizardView.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
