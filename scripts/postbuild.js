import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const distDir = path.join(process.cwd(), 'dist');
const clientDir = path.join(distDir, 'client');
const dashboardHtml = path.join(clientDir, 'dashboard', 'index.html');
const fallbackHtml = path.join(clientDir, '404.html');

function computeFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

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
  const siteUrl = process.env.SITE_URL || 'https://printx.farrelad.com';
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

  // Relocate and patch PWA Service Worker (sw.js & workbox-*.js) into dist/client
  const rootFiles = fs.existsSync(distDir) ? fs.readdirSync(distDir) : [];
  for (const file of rootFiles) {
    if (file === 'sw.js' || /^workbox-.*\.js$/.test(file)) {
      const srcPath = path.join(distDir, file);
      const destPath = path.join(clientDir, file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        fs.unlinkSync(srcPath);
      }
    }
  }

  const clientSwPath = path.join(clientDir, 'sw.js');
  if (fs.existsSync(clientSwPath)) {
    let swContent = fs.readFileSync(clientSwPath, 'utf-8');

    // 1. Remove any server/ build entries from precache manifest
    swContent = swContent.replace(
      /\{url:"server\/[^"]+",revision:"[^"]+"\},?/g,
      '',
    );

    // 2. Normalize client/assets/... paths to assets/... relative to dist/client
    swContent = swContent.replace(/url:"client\/assets\//g, 'url:"assets/');

    // 3. Ensure prerendered HTML shells (index.html, dashboard/index.html, 404.html) are precached for offline navigation
    const htmlEntries = [];
    for (const relHtml of ['index.html', 'dashboard/index.html', '404.html']) {
      const fullHtmlPath = path.join(clientDir, relHtml);
      if (
        fs.existsSync(fullHtmlPath) &&
        !swContent.includes(`url:"${relHtml}"`)
      ) {
        htmlEntries.push(
          `{url:"${relHtml}",revision:"${computeFileHash(fullHtmlPath)}"}`,
        );
      }
    }

    if (htmlEntries.length > 0) {
      swContent = swContent.replace(
        'precacheAndRoute([',
        `precacheAndRoute([${htmlEntries.join(',')},`,
      );
    }

    // 4. Clean up any trailing comma before closing bracket in precacheAndRoute
    swContent = swContent.replace(/,\s*\]/g, ']');

    fs.writeFileSync(clientSwPath, swContent, 'utf-8');
    console.log(
      'Post-build: Successfully relocated and patched PWA sw.js in dist/client.',
    );
  }
} catch (err) {
  console.error('Post-build error during post-processing:', err);
  process.exit(1);
}
