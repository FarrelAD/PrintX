import fs from 'node:fs';
import path from 'node:path';

const clientDir = path.join(process.cwd(), 'dist', 'client');
const dashboardHtml = path.join(clientDir, 'dashboard', 'index.html');
const fallbackHtml = path.join(clientDir, '404.html');

try {
  if (fs.existsSync(dashboardHtml)) {
    fs.copyFileSync(dashboardHtml, fallbackHtml);
    console.log('Post-build: Successfully copied dashboard index.html to 404.html for routing fallback.');
  } else {
    console.warn(`Post-build warning: Dashboard HTML file not found at ${dashboardHtml}`);
  }
} catch (err) {
  console.error('Post-build error copying file:', err);
}
