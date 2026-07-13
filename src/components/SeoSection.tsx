'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSeoEntry } from '@/lib/seo-catalog';
import { tools } from '@/lib/tools';
import { HelpCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export function SeoSection() {
  const pathname = usePathname();
  
  // Find matching tool in the master list to extract title/desc fallbacks
  const currentTool = tools.find(t => t.href === pathname);
  const seo = getSeoEntry(pathname, currentTool?.title, currentTool?.description);

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [hasExistingFaq, setHasExistingFaq] = useState<boolean>(false);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  useEffect(() => {
    // Check if the page already has a hardcoded FAQ or Guide section
    const headers = Array.from(document.querySelectorAll('h2, h3, h4'));
    const matches = headers.some(h => {
      const text = h.textContent?.toLowerCase() || '';
      return text.includes('frequently asked questions') || text.includes('why use our');
    });
    setHasExistingFaq(matches);
  }, [pathname]);

  // Generate Google Search FAQPage JSON-LD schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': seo.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  // If the page already has custom descriptive text & FAQs, only inject schema (no duplicate visual cards)
  if (hasExistingFaq) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    );
  }

  return (
    <div className="mt-12 space-y-8 max-w-4xl mx-auto border-t pt-8 border-primary/10">
      {/* Injected JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step-by-Step User Guide */}
        <div className="bg-card border border-primary/5 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            {seo.guideTitle}
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-xs text-muted-foreground">
            {seo.steps.map((step, idx) => (
              <li key={idx} className="pl-1">
                <span className="font-semibold text-foreground leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Frequently Asked Questions Accordion */}
        <div className="bg-card border border-primary/5 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-foreground">
            <HelpCircle className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-3">
            {seo.faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="border border-primary/5 rounded-xl overflow-hidden bg-background/50">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left font-bold text-xs flex justify-between items-center hover:bg-primary/5 transition-colors gap-4"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-primary/5 animate-in slide-in-from-top-1 duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
