'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, ScanLine, X, Zap, ShieldCheck } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';

// Code 39 character mapping (1 = bar, 0 = space)
// Narrow = 1, Wide = 2
// Represented here as patterns: N=narrow bar, W=wide bar, n=narrow space, w=wide space
const code39Map: Record<string, string> = {
  '0': 'NnNwWnWnN', '1': 'WnNwNnNnW', '2': 'NnWwNnNnW', '3': 'WnWwNnNnN',
  '4': 'NnNwWnNnW', '5': 'WnNwWnNnN', '6': 'NnWwWnNnN', '7': 'NnNwNnWnW',
  '8': 'WnNwNnWnN', '9': 'NnWwNnWnN', 'A': 'WnNnNwNnW', 'B': 'NnWnNwNnW',
  'C': 'WnWnNwNnN', 'D': 'NnNnWwNnW', 'E': 'WnNnWwNnN', 'F': 'NnWnWwNnN',
  'G': 'NnNnNwWnW', 'H': 'WnNnNwWnN', 'I': 'NnWnNwWnN', 'J': 'NnNnWwWnN',
  'K': 'WnNnNnNwW', 'L': 'NnWnNnNwW', 'M': 'WnWnNnNwN', 'N': 'NnNnWnNwW',
  'O': 'WnNnWnNwN', 'P': 'NnWnWnNwN', 'Q': 'NnNnNnWwW', 'R': 'WnNnNnWwN',
  'S': 'NnWnNnWwN', 'T': 'NnNnWnWwN', 'U': 'WwNnNnNnW', 'V': 'NwWnNnNnW',
  'W': 'WwWnNnNnN', 'X': 'NwNnWnNnW', 'Y': 'WwNnWnNnN', 'Z': 'NwWnWnNnN',
  '-': 'NwNnNnWnW', '.': 'WwNnNnWnN', ' ': 'NwWnNnWnN', '*': 'NwNnWnWnN'
};

export default function BarcodeGeneratorPage() {
  const [text, setText] = useState<string>('BRO123');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    const rawValue = text.toUpperCase().trim();
    if (!rawValue) {
      toast({ title: "Empty text", description: "Please enter text to encode.", variant: "destructive" });
      return;
    }

    // Check for invalid characters
    for (let i = 0; i < rawValue.length; i++) {
      if (!code39Map[rawValue[i]]) {
        toast({
          title: "Invalid Characters",
          description: `Character "${rawValue[i]}" is not supported in Code 39. Only A-Z, 0-9, spaces, and - . $ / + % * are allowed.`,
          variant: "destructive"
        });
        return;
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Build the full pattern (starts and ends with '*')
    const fullValue = `*${rawValue}*`;
    
    // Narrow element = 2px, Wide element = 5px
    const narrowWidth = 2;
    const wideWidth = 5;
    
    // Calculate total width of barcode
    let totalWidth = 0;
    for (let charIndex = 0; charIndex < fullValue.length; charIndex++) {
      const char = fullValue[charIndex];
      const pattern = code39Map[char];
      for (let j = 0; j < pattern.length; j++) {
        const p = pattern[j];
        if (p === 'N' || p === 'n') totalWidth += narrowWidth;
        else totalWidth += wideWidth;
      }
      // Narrow inter-character gap
      totalWidth += narrowWidth;
    }

    // Setup canvas dimension
    const padding = 20;
    canvas.width = totalWidth + padding * 2;
    canvas.height = 100 + padding * 2;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw barcode
    let currentX = padding;
    ctx.fillStyle = '#000000';

    for (let charIndex = 0; charIndex < fullValue.length; charIndex++) {
      const char = fullValue[charIndex];
      const pattern = code39Map[char];
      for (let j = 0; j < pattern.length; j++) {
        const p = pattern[j];
        const isBar = j % 2 === 0; // patterns start with bar, then space, alternating
        const width = (p === 'N' || p === 'n') ? narrowWidth : wideWidth;

        if (isBar) {
          ctx.fillRect(currentX, padding, width, 80);
        }
        currentX += width;
      }
      // Draw inter-character gap (white space)
      currentX += narrowWidth;
    }

    // Draw text label below barcode
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(rawValue, canvas.width / 2, canvas.height - 5);

    setResultUrl(canvas.toDataURL('image/png'));
    toast({ title: "Barcode Generated successfully!" });
    scrollToDownload();
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  return (<>
      <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <ScanLine className="h-6 w-6 text-primary" /> BARCODE GENERATOR
              </CardTitle>
              <CardDescription>Generate Code 39 standard barcodes client-side and export them instantly.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text" className="text-xs font-bold uppercase tracking-wider">Barcode Value (Alphanumeric)</Label>
                  <Input
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value.toUpperCase())}
                    placeholder="e.g. BRO123"
                    className="rounded-xl"
                  />
                  <p className="text-[10px] text-muted-foreground">Supports uppercase letters, numbers, spaces, periods, and hyphens.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
              <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleGenerate}>
                <Zap className="mr-2 h-5 w-5" /> GENERATE BARCODE
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Download Area</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-10 min-h-[300px]">
              <canvas ref={canvasRef} className="hidden" />
              {resultUrl ? (
                <div id="download-section" className="space-y-6 w-full animate-in fade-in zoom-in duration-500 text-center">
                  <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                    <ShieldCheck className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black italic tracking-tight">BARCODE CREATED</h3>
                  <div className="border rounded-2xl p-4 bg-white flex items-center justify-center shadow-inner">
                    <img src={resultUrl} alt="Generated Barcode" className="max-w-full" />
                  </div>
                  <a href={resultUrl} download={`barcode-${text}.png`} className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD BARCODE PNG
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <ScanLine className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Generator</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Barcode Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Barcode Generator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Create Code 39 barcodes and download PNGs.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Barcode Generator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Barcode Generator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Barcode Generator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Barcode Generator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
