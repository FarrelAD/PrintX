import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from '@react-router/dev/routes';

export default [
  route('/', 'routes/home/index.tsx'),
  ...prefix('dashboard', [
    layout('layouts/DashboardLayout.tsx', [
      index('routes/dashboard/index.tsx'),
      route('projects', 'routes/dashboard/projects/index.tsx'),
      route('dataset', 'routes/dashboard/dataset/index.tsx'),
      route('settings', 'routes/dashboard/settings/index.tsx'),
      route('project/:id', 'routes/dashboard/project/index.tsx'),
    ]),
  ]),
  route('dev/og-generator', 'routes/dev/og-generator/index.tsx'),
] satisfies RouteConfig;
