'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Image as ImageIcon, X, Zap, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { scrollToDownload } from '@/lib/utils';

export default function WatermarkPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [wmText, setWmText] = useState<string>('UseBro');
  const [wmLogo, setWmLogo] = useState<File | null>(null);
  const [logoObj, setLogoObj] = useState<HTMLImageElement | null>(null);

  const [opacity, setOpacity] = useState<number>(30); // 0-100
  const [size, setSize] = useState<number>(32); // Font size / logo scale %
  const [position, setPosition] = useState<string>('center');
  
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid format', description: 'Please select a valid image file.', variant: 'destructive' });
        return;
      }
      setImage(file);
      setResultUrl(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => setImgObj(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid format', description: 'Please select a valid logo image.', variant: 'destructive' });
        return;
      }
      setWmLogo(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => setLogoObj(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!imgObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = imgObj.width;
    canvas.height = imgObj.height;

    // Draw main image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgObj, 0, 0, canvas.width, canvas.height);

    // Configure transparency/opacity
    ctx.save();
    ctx.globalAlpha = opacity / 100;

    if (watermarkType === 'text') {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = size / 10;
      ctx.font = `bold ${size}px Arial`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      const measure = ctx.measureText(wmText);
      const w = measure.width;

      if (position === 'center') {
        ctx.strokeText(wmText, canvas.width / 2, canvas.height / 2);
        ctx.fillText(wmText, canvas.width / 2, canvas.height / 2);
      } else if (position === 'bottom-right') {
        ctx.strokeText(wmText, canvas.width - w/2 - 20, canvas.height - 30);
        ctx.fillText(wmText, canvas.width - w/2 - 20, canvas.height - 30);
      } else if (position === 'top-left') {
        ctx.strokeText(wmText, w/2 + 20, 40);
        ctx.fillText(wmText, w/2 + 20, 40);
      } else if (position === 'tiled') {
        // Draw grid
        const stepX = w + 100;
        const stepY = size + 100;
        for (let x = 50; x < canvas.width; x += stepX) {
          for (let y = 50; y < canvas.height; y += stepY) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-Math.PI / 6);
            ctx.strokeText(wmText, 0, 0);
            ctx.fillText(wmText, 0, 0);
            ctx.restore();
          }
        }
      }
    } else if (watermarkType === 'image' && logoObj) {
      // Draw image logo
      const aspect = logoObj.height / logoObj.width;
      // Size slider maps to width in pixels (e.g. 50px to 400px)
      const wmWidth = (size / 100) * canvas.width * 0.3; // scale up to 30% of canvas width
      const wmHeight = wmWidth * aspect;

      if (position === 'center') {
        ctx.drawImage(logoObj, (canvas.width - wmWidth) / 2, (canvas.height - wmHeight) / 2, wmWidth, wmHeight);
      } else if (position === 'bottom-right') {
        ctx.drawImage(logoObj, canvas.width - wmWidth - 20, canvas.height - wmHeight - 20, wmWidth, wmHeight);
      } else if (position === 'top-left') {
        ctx.drawImage(logoObj, 20, 20, wmWidth, wmHeight);
      } else if (position === 'tiled') {
        const stepX = wmWidth + 100;
        const stepY = wmHeight + 100;
        for (let x = 20; x < canvas.width; x += stepX) {
          for (let y = 20; y < canvas.height; y += stepY) {
            ctx.drawImage(logoObj, x, y, wmWidth, wmHeight);
          }
        }
      }
    }
    ctx.restore();
  }, [imgObj, watermarkType, wmText, logoObj, opacity, size, position]);

  const handleProcess = () => {
    if (!canvasRef.current) return;
    setIsLoading(true);
    try {
      const dataUrl = canvasRef.current.toDataURL(image?.type || 'image/jpeg', 0.95);
      setResultUrl(dataUrl);
      toast({ title: "Watermark Applied!" });
      scrollToDownload();
    } catch (err) {
      console.error(err);
      toast({ title: "Watermark failed", description: "Failed to render final watermarked image.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (<>
      <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <ImageIcon className="h-6 w-6 text-primary" /> WATERMARK MAKER
              </CardTitle>
              <CardDescription>Censor or trademark copyright images with customizable overlays client-side.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {!image ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-primary/20 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold uppercase italic">Click to upload Photo</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-2xl">
                    <span className="text-xs font-bold truncate max-w-xs">{image.name}</span>
                    <Button size="icon" variant="ghost" onClick={() => { setImage(null); setImgObj(null); setResultUrl(null); }} className="h-7 w-7 text-destructive"><X className="h-4 w-4" /></Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider block">Watermark Type</Label>
                      <Select value={watermarkType} onValueChange={(val: any) => setWatermarkType(val)}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Custom Text</SelectItem>
                          <SelectItem value="image">Custom Logo/Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider block">Watermark Position</Label>
                      <Select value={position} onValueChange={setPosition}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="tiled">Tiled Grid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {watermarkType === 'text' ? (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">Watermark Text</Label>
                      <Input value={wmText} onChange={(e) => setWmText(e.target.value)} className="rounded-xl" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider">Upload Logo (PNG/JPG)</Label>
                      <Input type="file" accept="image/*" onChange={handleLogoChange} className="rounded-xl cursor-pointer" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Opacity</span>
                        <span>{opacity}%</span>
                      </div>
                      <Slider value={[opacity]} onValueChange={(val) => setOpacity(val[0])} min={5} max={100} step={5} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Watermark Size</span>
                        <span>{size}px</span>
                      </div>
                      <Slider value={[size]} onValueChange={(val) => setSize(val[0])} min={10} max={150} step={2} />
                    </div>
                  </div>

                  <div className="border rounded-2xl overflow-hidden bg-muted/5 flex items-center justify-center p-4">
                    <canvas ref={canvasRef} className="max-h-[300px] max-w-full border object-contain shadow-sm bg-white" />
                  </div>
                </div>
              )}
            </CardContent>
            {image && (
              <CardFooter className="bg-muted/30 p-6 border-t">
                <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleProcess} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                  APPLY WATERMARK
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Download Area</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-10 min-h-[300px]">
              {resultUrl ? (
                <div id="download-section" className="space-y-6 w-full animate-in fade-in zoom-in duration-500 text-center">
                  <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                    <ShieldCheck className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black italic tracking-tight">WATERMARK APPLIED</h3>
                  <a href={resultUrl} download={`watermarked-${image?.name}`} className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD PROTECTED IMAGE
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <ImageIcon className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Watermark Setup</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Watermark Maker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Watermark Maker is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Protect your creative images with custom overlays.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Watermark Maker tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Watermark Maker tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Watermark Maker upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Watermark Maker on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
