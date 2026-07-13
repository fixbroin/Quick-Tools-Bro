'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Braces, Download, Code } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function HTMLFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleFormat = (indentSize: number = 2) => {
    if (!input.trim()) return;
    try {
      let formatted = '';
      const reg = /(<[^>]+>)/g;
      
      // Clean comments and collapses whitespace
      const cleanedInput = input.replace(/\s+/g, ' ');
      const elements = cleanedInput.split(reg);
      let indent = 0;
      
      elements.forEach((el) => {
        const element = el.trim();
        if (!element) return;
        
        // Closing tag
        if (element.match(/^<\/\w/)) {
          indent = Math.max(0, indent - 1);
        }
        
        formatted += ' '.repeat(indent * indentSize) + element + '\n';
        
        // Opening tag, excluding self-closing or void elements (br, img, hr, input, meta, link, etc.)
        if (element.match(/^<\w[^>]*[^\/]>$/) && !element.match(/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
          indent++;
        }
      });

      setOutput(formatted.trim());
      toast({ title: 'HTML Formatted!' });
    } catch (err: any) {
      toast({ title: 'Formatting Failed', description: 'Could not parse HTML code.', variant: 'destructive' });
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const minified = input
        .replace(/>\s+</g, '><') // Remove whitespace between elements
        .replace(/\s+/g, ' ') // Collapse multiple whitespace
        .trim();
      setOutput(minified);
      toast({ title: 'HTML Minified!' });
    } catch (err: any) {
      toast({ title: 'Minification Failed', description: 'Could not minify HTML code.', variant: 'destructive' });
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: 'Copied to Clipboard!' });
  };

  const downloadHtml = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `formatted-${Date.now()}.html`;
    a.click();
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-xl">
                <Code className="h-5 w-5 text-primary" /> HTML CODE INPUT
              </CardTitle>
              <CardDescription>Paste raw, unformatted HTML markup to format or minify.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <Textarea
                placeholder='<div class="card"><h1>Title</h1><p>Description</p></div>'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 min-h-[350px] font-mono text-xs rounded-xl p-4 bg-background border"
              />
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 border-t flex gap-3">
              <Button onClick={() => handleFormat(2)} className="flex-1 rounded-xl font-bold">Pretty Print</Button>
              <Button onClick={handleMinify} variant="outline" className="flex-1 rounded-xl font-bold">Minify</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Output */}
        <div className="lg:col-span-6">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b flex flex-row justify-between items-center p-4">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Output Markup</CardTitle>
              {output && (
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={handleCopy} className="h-8 w-8 rounded-lg"><Copy className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={downloadHtml} className="h-8 w-8 rounded-lg"><Download className="h-4 w-4" /></Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-4 flex flex-col min-h-[350px]">
              {output ? (
                <Textarea
                  readOnly
                  value={output}
                  className="flex-1 min-h-[350px] font-mono text-xs rounded-xl p-4 bg-muted/10 border resize-none"
                />
              ) : (
                <div className="text-center space-y-3 opacity-40 my-auto">
                  <Braces className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Output</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our HTML Formatter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our HTML Formatter is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Format, validate, or minify HTML markup.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the HTML Formatter tool on UseBro.</li>
                        <li>Input your parameters or upload the required file in the field controls.</li>
                        <li>Wait for the tool to process the details dynamically in your browser.</li>
                        <li>Click download, save, or copy the final outputs to your device.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the HTML Formatter tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this HTML Formatter upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use HTML Formatter on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
