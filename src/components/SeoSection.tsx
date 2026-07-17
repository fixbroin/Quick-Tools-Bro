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

  // Find 4 related tools dynamically for SEO interlinking based on exact category alignment
  const relatedTools = (() => {
    const currentHref = pathname || '';
    
    // Find current tool details
    const currentTool = tools.find(t => t.href.toLowerCase().replace(/\/$/, '') === currentHref.toLowerCase().replace(/\/$/, ''));
    
    const CATEGORIES_MAP = [
      {
        name: 'PDF Tools',
        matches: ['JPG to PDF Converter', 'PDF to JPG Converter', 'Merge PDF', 'Split PDF', 'Compress PDF', 'PDF to Word Converter', 'Word to PDF Converter', 'Excel to PDF Converter', 'Presentation to PDF', 'OCR Text Extractor', 'eSign PDF', 'PDF Password Unlocker']
      },
      {
        name: 'QR Code Tools',
        matches: ['QR Code Generator', 'QR Code Scanner', 'WiFi QR Code Generator']
      },
      {
        name: 'Image Tools',
        matches: ['Image Compressor', 'Image Converter', 'Image Resizer', 'Image Background Remover', 'Image Cropper', 'Favicon Converter', 'Feature Graphic Generator', 'Passport Photo Maker', 'Blur Image', 'Watermark Maker', 'Rotate Image', 'Govt Job Photo & Signature Resizer']
      },
      {
        name: 'Video & Audio Tools',
        matches: ['Video Compressor', 'Video to MP3 Converter', 'Video to GIF Converter', 'Audio Cutter & Ringtone Maker', 'Audio Converter', 'Basic Video Editor']
      },
      {
        name: 'Business Tools',
        matches: ['Quotation Maker', 'Invoice Maker', 'Receipt Generator', 'GST Invoice Maker']
      },
      {
        name: 'Web & Utility Tools',
        matches: ['Short Link Maker', 'Unit Converter']
      },
      {
        name: 'Health & Lifestyle Calculators',
        matches: ['BMI Calculator', 'Calorie Calculator', 'Food Calorie & Nutrition Calculator', 'Love Calculator', 'Age Calculator']
      },
      {
        name: 'Financial Calculators',
        matches: ['Loan EMI Calculator', 'SIP Calculator', 'Salary Calculator', 'Income Tax Calculator', 'Sukanya Samriddhi Yojana (SSY) Calculator', 'PPF Calculator', 'EPF Calculator', 'Gratuity Calculator']
      },
      {
        name: 'Legal Document Generators',
        matches: ['Privacy Policy Generator', 'Terms & Conditions Generator', 'Refund Policy Generator', 'Return Policy Generator']
      },
      {
        name: 'Daily & Productivity',
        matches: ['Barcode Generator', 'Password Generator', 'Username Generator', 'UUID Generator', 'Random Number Generator', 'Countdown Timer', 'Stopwatch', 'Notes Notepad']
      },
      {
        name: 'Content & Marketing',
        matches: ['Email Writer', 'Resume Builder', 'Cover Letter Generator', 'AI Prompt Generator', 'Business Name Generator', 'Video Title Generator', 'YouTube Tag Generator', 'YouTube Thumbnail Downloader']
      },
      {
        name: 'Student Tools',
        matches: ['GPA Calculator', 'Percentage Calculator', 'Attendance Calculator', 'Study Pomodoro Timer']
      },
      {
        name: 'Developer Tools',
        matches: ['JSON Formatter', 'Base64 Converter', 'URL Encoder & Decoder', 'Regex Tester', 'Color Picker', 'CSS Generator', 'HTML Formatter']
      }
    ];

    let list: Tool[] = [];
    if (currentTool) {
      // Find which category this tool belongs to
      const matchedCategory = CATEGORIES_MAP.find(cat => cat.matches.includes(currentTool.name));
      if (matchedCategory) {
        // Grab all tools inside this category
        list = tools.filter(t => matchedCategory.matches.includes(t.name));
      }
    }

    // Remove the current tool from recommendations
    list = list.filter(t => t.href.toLowerCase().replace(/\/$/, '') !== currentHref.toLowerCase().replace(/\/$/, ''));

    // Fallback to fill up to 4 using other tools in the registry
    if (list.length < 4) {
      const fallbacks = tools.filter(t => 
        t.href.toLowerCase().replace(/\/$/, '') !== currentHref.toLowerCase().replace(/\/$/, '') && 
        !list.some(l => l.href.toLowerCase().replace(/\/$/, '') === t.href.toLowerCase().replace(/\/$/, ''))
      );
      list = [...list, ...fallbacks];
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
