import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online AI Prompt Generator - Create Better Prompts',
    description: 'Optimize your AI prompts for ChatGPT, Claude, or Midjourney client-side. Completely free.',
    keywords: ['ai prompt generator', 'chatgpt prompt creator', 'optimize prompt', 'prompt engineering helper', 'free developer tool'],
    path: '/tools/prompt-generator',
});

export default function PromptGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online AI Prompt Generator - Create Better Prompts',
    description: 'Optimize your AI prompts for ChatGPT, Claude, or Midjourney client-side. Completely free.',
    url: `${SITE_CONFIG.url}/tools/prompt-generator`,
  });
  return (
    <>
      <Script
        id="prompt-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
