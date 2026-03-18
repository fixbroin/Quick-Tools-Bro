
import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { tools } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const staticSitemap: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${SITE_CONFIG.url}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }));

  const toolsSitemap: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${SITE_CONFIG.url}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticSitemap, ...toolsSitemap];
}
