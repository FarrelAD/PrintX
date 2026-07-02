import fs from 'node:fs';
import path from 'node:path';

const clientDir = path.join(process.cwd(), 'dist', 'client');
const dashboardHtml = path.join(clientDir, 'dashboard', 'index.html');
const fallbackHtml = path.join(clientDir, '404.html');

try {
  if (fs.existsSync(dashboardHtml)) {
    fs.copyFileSync(dashboardHtml, fallbackHtml);
    console.log(
      'Post-build: Successfully copied dashboard index.html to 404.html for routing fallback.',
    );
  } else {
    console.warn(
      `Post-build warning: Dashboard HTML file not found at ${dashboardHtml}`,
    );
  }

  // Generate sitemap.xml
  const siteUrl = process.env.SITE_URL || 'https://printx.pages.dev';
  const sitemapPath = path.join(clientDir, 'sitemap.xml');
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
  console.log('Post-build: Successfully generated sitemap.xml.');

  // Generate robots.txt
  const robotsPath = path.join(clientDir, 'robots.txt');
  const robotsContent = `User-agent: *
Allow: /$
Disallow: /dashboard/
Disallow: /dashboard/*
Disallow: /404

Sitemap: ${siteUrl}/sitemap.xml
`;
  fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
  console.log('Post-build: Successfully generated robots.txt.');
} catch (err) {
  console.error('Post-build error during post-processing:', err);
}
