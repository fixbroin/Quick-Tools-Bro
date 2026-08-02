'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const DynamicManifest = () => {
  const pathname = usePathname();

  useEffect(() => {
    let manifestPath = '/manifest.json'; // Default
    
    if (pathname && pathname.startsWith('/tools/')) {
      const segments = pathname.split('/');
      const toolId = segments[segments.length - 1] || segments[segments.length - 2];
      if (toolId) {
        manifestPath = `/api/manifest/${toolId}`;
      }
    }

    // Find the existing manifest link
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;

    if (manifestLink) {
      // If the path is already correct, do nothing
      if (manifestLink.getAttribute('href') === manifestPath) return;
      
      // Update the existing link
      manifestLink.setAttribute('href', manifestPath);
    } else {
      // If it doesn't exist, create it
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = manifestPath;
      document.head.appendChild(link);
    }
    
    console.log(`PWA: Manifest switched to ${manifestPath} for path ${pathname}`);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default DynamicManifest;
