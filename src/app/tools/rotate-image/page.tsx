'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Image as ImageIcon, X, Zap, ShieldCheck, RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';

export default function RotateImagePage() {
  const [image, setImage] = useState<File | null>(null);
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

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
      setRotation(0);
      setFlipH(false);
      setFlipV(false);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => setImgObj(img);
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

    // Check orientation: if rotated 90 or 270, swap dimensions
    const isSwapped = rotation === 90 || rotation === 270;
    canvas.width = isSwapped ? imgObj.height : imgObj.width;
    canvas.height = isSwapped ? imgObj.width : imgObj.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Translate context to center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply flip scaling
    const scaleX = flipH ? -1 : 1;
    const scaleY = flipV ? -1 : 1;
    ctx.scale(scaleX, scaleY);

    // Draw the image centered
    ctx.drawImage(imgObj, -imgObj.width / 2, -imgObj.height / 2);
    ctx.restore();
  }, [imgObj, rotation, flipH, flipV]);

  const rotateCw = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const rotateCcw = () => {
    setRotation(prev => (prev - 90 + 360) % 360);
  };

  const toggleFlipH = () => {
    setFlipH(prev => !prev);
  };

  const toggleFlipV = () => {
    setFlipV(prev => !prev);
  };

  const handleProcess = () => {
    if (!canvasRef.current) return;
    setIsLoading(true);
    try {
      const dataUrl = canvasRef.current.toDataURL(image?.type || 'image/jpeg', 0.95);
      setResultUrl(dataUrl);
      toast({ title: "Image Rotated/Flipped Successfully!" });
      scrollToDownload();
    } catch (err) {
      console.error(err);
      toast({ title: "Processing failed", description: "Failed to render final output image.", variant: "destructive" });
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
                <RotateCw className="h-6 w-6 text-primary" /> ROTATE IMAGE
              </CardTitle>
              <CardDescription>Rotate 90, 180, or 270 degrees, or mirror images horizontally/vertically.</CardDescription>
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

                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" onClick={rotateCcw} className="rounded-xl flex flex-col items-center py-6 h-auto">
                      <RotateCcw className="h-5 w-5 mb-1" />
                      <span className="text-[10px] uppercase font-bold">90° Left</span>
                    </Button>
                    <Button variant="outline" onClick={rotateCw} className="rounded-xl flex flex-col items-center py-6 h-auto">
                      <RotateCw className="h-5 w-5 mb-1" />
                      <span className="text-[10px] uppercase font-bold">90° Right</span>
                    </Button>
                    <Button variant="outline" onClick={toggleFlipH} className={`rounded-xl flex flex-col items-center py-6 h-auto ${flipH ? 'border-primary bg-primary/5 text-primary' : ''}`}>
                      <FlipHorizontal className="h-5 w-5 mb-1" />
                      <span className="text-[10px] uppercase font-bold">Flip Horiz</span>
                    </Button>
                    <Button variant="outline" onClick={toggleFlipV} className={`rounded-xl flex flex-col items-center py-6 h-auto ${flipV ? 'border-primary bg-primary/5 text-primary' : ''}`}>
                      <FlipVertical className="h-5 w-5 mb-1" />
                      <span className="text-[10px] uppercase font-bold">Flip Vert</span>
                    </Button>
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
                  RENDER & EXPORT
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
                  <h3 className="text-xl font-black italic tracking-tight">ROTATION APPLIED</h3>
                  <a href={resultUrl} download={`rotated-${image?.name}`} className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD IMAGE
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <ImageIcon className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Sizing & Render</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Rotate Image?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Rotate Image is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Rotate 90deg or flip your images horizontally.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Rotate Image tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Rotate Image tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Rotate Image upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Rotate Image on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
