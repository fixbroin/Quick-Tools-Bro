'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw, Download, Braces } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function UUIDGeneratorPage() {
  const [quantity, setQuantity] = useState<number>(10);
  const [useUppercase, setUseUppercase] = useState(false);
  const [useHyphens, setUseHyphens] = useState(true);
  const [uuidList, setUuidList] = useState<string[]>([]);
  
  const { toast } = useToast();

  const generateUUIDv4 = () => {
    // Cryptographically secure random UUID
    let uuid = '';
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      uuid = window.crypto.randomUUID();
    } else {
      // Fallback
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    if (!useHyphens) {
      uuid = uuid.replace(/-/g, '');
    }
    if (useUppercase) {
      uuid = uuid.toUpperCase();
    }
    return uuid;
  };

  const handleGenerate = () => {
    const list = [];
    for (let i = 0; i < quantity; i++) {
      list.push(generateUUIDv4());
    }
    setUuidList(list);
  };

  useEffect(() => {
    handleGenerate();
  }, [quantity, useUppercase, useHyphens]);

  const handleCopy = () => {
    if (uuidList.length === 0) return;
    navigator.clipboard.writeText(uuidList.join('\n'));
    toast({ title: 'Copied to Clipboard!', description: `Copied ${uuidList.length} UUIDs.` });
  };

  const handleDownload = () => {
    if (uuidList.length === 0) return;
    const blob = new Blob([uuidList.join('\n')], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `uuids-${Date.now()}.txt`;
    a.click();
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Braces className="h-6 w-6 text-primary" /> UUID GENERATOR
              </CardTitle>
              <CardDescription>Generate RFC 4122 version 4 UUIDs (Universally Unique Identifiers) in bulk.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Generate Quantity</span>
                    <span>{quantity}</span>
                  </div>
                  <Slider value={[quantity]} onValueChange={(val) => setQuantity(val[0])} min={1} max={50} step={1} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="uppercase" className="text-sm font-semibold cursor-pointer">Uppercase Letters</Label>
                  <Switch id="uppercase" checked={useUppercase} onCheckedChange={setUseUppercase} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hyphens" className="text-sm font-semibold cursor-pointer">Include Hyphens (-)</Label>
                  <Switch id="hyphens" checked={useHyphens} onCheckedChange={setUseHyphens} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
              <Button className="w-full h-12 rounded-xl font-bold" onClick={handleGenerate}>
                <RefreshCw className="mr-2 h-4 w-4" /> RE-GENERATE
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b flex flex-row justify-between items-center px-6">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Output UUIDs</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 rounded-lg"><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
                <Button size="sm" variant="outline" onClick={handleDownload} className="h-8 rounded-lg"><Download className="h-3.5 w-3.5 mr-1" /> Download</Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col">
              <Textarea
                readOnly
                value={uuidList.join('\n')}
                className="flex-1 min-h-[300px] font-mono text-sm rounded-xl p-4 bg-muted/10 border resize-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our UUID Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our UUID Generator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Generate secure version 4 UUID tokens in bulk.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the UUID Generator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the UUID Generator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this UUID Generator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use UUID Generator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
