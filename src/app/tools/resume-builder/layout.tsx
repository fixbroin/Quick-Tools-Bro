import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Resume Builder - Create PDF Resumes',
    description: 'Build professional, styled PDF resumes online client-side. Completely free, secure, and private.',
    keywords: ['resume builder', 'create resume online', 'free cv maker', 'pdf resume generator', 'free career tool'],
    path: '/tools/resume-builder',
});

export default function ResumeBuilderLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Resume Builder - Create PDF Resumes',
    description: 'Build professional, styled PDF resumes online client-side. Completely free, secure, and private.',
    url: `${SITE_CONFIG.url}/tools/resume-builder`,
  });
  return (
    <>
      <Script
        id="resume-builder-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
