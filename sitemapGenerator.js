
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const staticPages = [
  '/',
  '/contact',
  '/privacy',
  '/terms',
];

// Dynamically scan the tools directory for pages
const toolsDir = path.join(__dirname, 'src', 'app', 'tools');
const toolPages = [];

if (fs.existsSync(toolsDir)) {
  const folders = fs.readdirSync(toolsDir);
  folders.forEach((folder) => {
    const pagePath = path.join(toolsDir, folder, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      toolPages.push(`/tools/${folder}`);
    }
  });
}

const pages = [...staticPages, ...toolPages];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      const path = page === '/' ? '' : page;
      return `
    <url>
        <loc>${`${siteUrl}${path}`}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

fs.writeFileSync(path.resolve(__dirname, 'public', 'sitemap.xml'), sitemap);

console.log('Sitemap generated successfully!');
