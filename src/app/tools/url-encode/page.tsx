'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw, Braces, ArrowRightLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function URLEncodePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
        toast({ title: 'URL Encoded!' });
      } else {
        setOutput(decodeURIComponent(input));
        toast({ title: 'URL Decoded!' });
      }
    } catch (err: any) {
      toast({ title: 'Conversion Failed', description: 'Malformed URL encoding detected.', variant: 'destructive' });
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: 'Copied to Clipboard!' });
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <div className="md:col-span-6 space-y-4">
          <Card className="shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-xl">
                <Braces className="h-5 w-5 text-primary" /> URL ENCODER / DECODER
              </CardTitle>
              <CardDescription>Encode or decode special character strings for safe URL queries.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  variant={mode === 'encode' ? 'default' : 'outline'}
                  onClick={() => { setMode('encode'); setInput(''); setOutput(''); }}
                  className="flex-1 rounded-xl font-bold"
                >
                  Encode String
                </Button>
                <Button
                  type="button"
                  variant={mode === 'decode' ? 'default' : 'outline'}
                  onClick={() => { setMode('decode'); setInput(''); setOutput(''); }}
                  className="flex-1 rounded-xl font-bold"
                >
                  Decode String
                </Button>
              </div>
              <Textarea
                placeholder={mode === 'encode' ? 'Type standard text (e.g. hello world & browser)...' : 'Paste encoded URL string (e.g. hello%20world%20%26%20browser)...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[250px] font-mono text-sm rounded-xl p-4 bg-background border"
              />
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 border-t">
              <Button onClick={handleConvert} className="w-full h-12 rounded-xl font-bold">
                <ArrowRightLeft className="mr-2 h-4 w-4" /> PROCESS
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-6">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b flex flex-row justify-between items-center p-4">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Output Result</CardTitle>
              {output && (
                <Button size="icon" variant="ghost" onClick={handleCopy} className="h-8 w-8 rounded-lg"><Copy className="h-4 w-4" /></Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-4 flex flex-col min-h-[300px]">
              {output ? (
                <Textarea
                  readOnly
                  value={output}
                  className="flex-1 min-h-[250px] font-mono text-sm rounded-xl p-4 bg-muted/10 border resize-none"
                />
              ) : (
                <div className="text-center space-y-3 opacity-40 my-auto">
                  <Braces className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Conversion</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our URL Encoder & Decoder?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our URL Encoder & Decoder is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Encode or decode URL query strings safely.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the URL Encoder & Decoder tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the URL Encoder & Decoder tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this URL Encoder & Decoder upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use URL Encoder & Decoder on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
