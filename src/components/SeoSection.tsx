'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSeoEntry } from '@/lib/seo-catalog';
import { tools, Tool } from '@/lib/tools';
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

  // Find 4 related tools dynamically for SEO interlinking
  const relatedTools = (() => {
    const currentHref = pathname || '';
    const isPdf = currentHref.includes('pdf') || currentHref.includes('ocr') || currentHref.includes('esign') || currentHref.includes('unlocker');
    const isImage = currentHref.includes('image') || currentHref.includes('compressor') || currentHref.includes('converter') || currentHref.includes('cropper') || currentHref.includes('resizer') || currentHref.includes('favicon') || currentHref.includes('graphic') || currentHref.includes('blur') || currentHref.includes('watermark') || currentHref.includes('rotate') || currentHref.includes('passport');
    const isCalc = currentHref.includes('calculator') || currentHref.includes('loan') || currentHref.includes('emi') || currentHref.includes('tax') || currentHref.includes('gpa') || currentHref.includes('percentage') || currentHref.includes('attendance');
    const isGen = currentHref.includes('generator') || currentHref.includes('uuid') || currentHref.includes('barcode') || currentHref.includes('random') || currentHref.includes('short-link') || currentHref.includes('notes');

    let list: Tool[] = [];
    if (isPdf) {
      list = tools.filter(t => t.href.includes('pdf') || t.href.includes('ocr') || t.href.includes('esign') || t.href.includes('unlocker'));
    } else if (isImage) {
      list = tools.filter(t => t.href.includes('image') || t.href.includes('compressor') || t.href.includes('converter') || t.href.includes('cropper') || t.href.includes('resizer') || t.href.includes('passport') || t.href.includes('watermark') || t.href.includes('rotate') || t.href.includes('blur'));
    } else if (isCalc) {
      list = tools.filter(t => t.href.includes('calculator') || t.href.includes('loan') || t.href.includes('emi') || t.href.includes('tax') || t.href.includes('gpa') || t.href.includes('percentage') || t.href.includes('attendance'));
    } else if (isGen) {
      list = tools.filter(t => t.href.includes('generator') || t.href.includes('uuid') || t.href.includes('barcode') || t.href.includes('random') || t.href.includes('short-link') || t.href.includes('notes'));
    }

    // Remove current tool
    list = list.filter(t => t.href !== currentHref);

    // Fallback to fill up to 4
    if (list.length < 4) {
      const fallbacks = tools.filter(t => t.href !== currentHref && !list.some(l => l.href === t.href));
      list = [...list, ...fallbacks].slice(0, 4);
    }

    return list.slice(0, 4);
  })();

  const renderRelatedTools = () => {
    if (relatedTools.length === 0) return null;
    return (
      <div className="space-y-4 border-t pt-8 border-primary/10">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Related Tools You May Need</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedTools.map((tool) => {
            const Icon = tool.Icon;
            return (
              <a
                key={tool.href}
                href={tool.href}
                className="group flex flex-col gap-2 rounded-xl border border-primary/5 bg-card/50 p-4 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-xs group-hover:text-primary transition-colors truncate">{tool.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  // If the page already has custom descriptive text & FAQs, only inject schema + Related Tools
  if (hasExistingFaq) {
    return (
      <div className="mt-12 space-y-8 max-w-4xl mx-auto border-t pt-8 border-primary/10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {renderRelatedTools()}
      </div>
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

      {/* Dynamic Interlinking Section */}
      {renderRelatedTools()}
    </div>
  );
}
