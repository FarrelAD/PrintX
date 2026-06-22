import type { Config } from '@react-router/dev/config';

export default {
  buildDirectory: 'dist',
  ssr: false,
  // Pre-render the landing page paths and the dashboard client shell at build time
  async prerender() {
    return ['/', '/dashboard'];
  },
} satisfies Config;
