'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Image as ImageIcon, X, ZoomIn, ZoomOut, RefreshCw, Zap, ShieldCheck, Minus, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { scrollToDownload } from '@/lib/utils';

interface SizePreset {
  name: string;
  widthMm: number;
  heightMm: number;
}

const SIZE_PRESETS: SizePreset[] = [
  { name: 'India / UK / EU Passport (35x45mm)', widthMm: 35, heightMm: 45 },
  { name: 'US Visa / Passport (2" x 2" / 51x51mm)', widthMm: 51, heightMm: 51 },
  { name: 'Pan Card / OCI (35x35mm)', widthMm: 35, heightMm: 35 },
  { name: 'Stamp Size (20x25mm)', widthMm: 20, heightMm: 25 },
];

export default function PassportPhotoMakerPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('0');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [zoom, setZoom] = useState<number>(1);
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [a4SheetUrl, setA4SheetUrl] = useState<string | null>(null);
  const [sheetPhotosCount, setSheetPhotosCount] = useState<number>(8);
  const [a4PhotosCount, setA4PhotosCount] = useState<number>(30);

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
      setSheetUrl(null);
      setA4SheetUrl(null);
      setZoom(1);
      setPosX(0);
      setPosY(0);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => setImgObj(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Redraw preview canvas
  useEffect(() => {
    if (!imgObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const preset = SIZE_PRESETS[parseInt(selectedSize, 10)];
    
    // Scale canvas pixels for high-quality printing (300 DPI)
    // 1 mm = 11.81 pixels at 300 DPI (approx 11.81 for screen preview)
    const scaleFactor = 12; 
    canvas.width = preset.widthMm * scaleFactor;
    canvas.height = preset.heightMm * scaleFactor;

    // Fill background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the user image
    const imgWidth = imgObj.width;
    const imgHeight = imgObj.height;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Center scaled image
    const drawWidth = canvasWidth * zoom;
    const drawHeight = (imgHeight / imgWidth) * drawWidth;
    const x = (canvasWidth - drawWidth) / 2 + posX * scaleFactor;
    const y = (canvasHeight - drawHeight) / 2 + posY * scaleFactor;

    ctx.drawImage(imgObj, x, y, drawWidth, drawHeight);
  }, [imgObj, selectedSize, bgColor, zoom, posX, posY]);

  const handleGenerate = () => {
    if (!canvasRef.current) return;
    setIsLoading(true);

    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setResultUrl(dataUrl);

      // 1. Generate 4x6 grid sheet (152.4 x 101.6 mm)
      const preset = SIZE_PRESETS[parseInt(selectedSize, 10)];
      const sheetCanvas = document.createElement('canvas');
      const sCtx = sheetCanvas.getContext('2d');
      if (sCtx) {
        const scaleFactor = 12;
        sheetCanvas.width = 152.4 * scaleFactor;
        sheetCanvas.height = 101.6 * scaleFactor;

        sCtx.fillStyle = '#ffffff';
        sCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const gap = 10;

        const cols = Math.floor((sheetCanvas.width + gap) / (imgWidth + gap)) || 1;
        const rows = Math.floor((sheetCanvas.height + gap) / (imgHeight + gap)) || 1;

        const gridWidth = cols * imgWidth + (cols - 1) * gap;
        const gridHeight = rows * imgHeight + (rows - 1) * gap;
        const marginX = (sheetCanvas.width - gridWidth) / 2;
        const marginY = (sheetCanvas.height - gridHeight) / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = marginX + c * (imgWidth + gap);
            const y = marginY + r * (imgHeight + gap);

            sCtx.strokeStyle = '#e2e8f0';
            sCtx.lineWidth = 2;
            sCtx.strokeRect(x, y, imgWidth, imgHeight);
            
            sCtx.drawImage(canvas, x, y, imgWidth, imgHeight);
          }
        }

        setSheetPhotosCount(cols * rows);
        setSheetUrl(sheetCanvas.toDataURL('image/jpeg', 0.95));
      }

      // 2. Generate A4 grid sheet (210 x 297 mm)
      const a4Canvas = document.createElement('canvas');
      const a4Ctx = a4Canvas.getContext('2d');
      if (a4Ctx) {
        const scaleFactor = 12;
        a4Canvas.width = 210 * scaleFactor;
        a4Canvas.height = 297 * scaleFactor;

        a4Ctx.fillStyle = '#ffffff';
        a4Ctx.fillRect(0, 0, a4Canvas.width, a4Canvas.height);

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const gap = 12;

        const cols = Math.floor((a4Canvas.width + gap) / (imgWidth + gap)) || 1;
        const rows = Math.floor((a4Canvas.height + gap) / (imgHeight + gap)) || 1;

        const gridWidth = cols * imgWidth + (cols - 1) * gap;
        const gridHeight = rows * imgHeight + (rows - 1) * gap;
        const marginX = (a4Canvas.width - gridWidth) / 2;
        const marginY = (a4Canvas.height - gridHeight) / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = marginX + c * (imgWidth + gap);
            const y = marginY + r * (imgHeight + gap);

            a4Ctx.strokeStyle = '#e2e8f0';
            a4Ctx.lineWidth = 2;
            a4Ctx.strokeRect(x, y, imgWidth, imgHeight);
            
            a4Ctx.drawImage(canvas, x, y, imgWidth, imgHeight);
          }
        }

        setA4PhotosCount(cols * rows);
        setA4SheetUrl(a4Canvas.toDataURL('image/jpeg', 0.95));
      }

      toast({ title: "Passport Photo Generated!" });
      scrollToDownload();
    } catch (err) {
      console.error(err);
      toast({ title: "Generation failed", description: "Could not render final image.", variant: "destructive" });
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
                <ImageIcon className="h-6 w-6 text-primary" /> PASSPORT PHOTO MAKER
              </CardTitle>
              <CardDescription>Upload a headshot to crop, adjust sizing presets, customize backdrops, and download high-quality printing sheets.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Photo Size Specification</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SIZE_PRESETS.map((p, idx) => (
                        <SelectItem key={idx} value={String(idx)}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Background Color</Label>
                  <Select value={bgColor} onValueChange={setBgColor}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#ffffff">Pure White</SelectItem>
                      <SelectItem value="#29ABE2">Light Blue</SelectItem>
                      <SelectItem value="#3b5998">Dark Blue</SelectItem>
                      <SelectItem value="#f1f5f9">Light Grey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
                    <Button size="icon" variant="ghost" onClick={() => { setImage(null); setImgObj(null); setResultUrl(null); setSheetUrl(null); setA4SheetUrl(null); }} className="h-7 w-7 text-destructive"><X className="h-4 w-4" /></Button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Interactive Preview Canvas */}
                    <div className="border rounded-2xl overflow-hidden shadow-sm bg-muted/5 flex items-center justify-center p-4">
                      <canvas
                        ref={canvasRef}
                        className="max-h-[220px] max-w-[220px] border shadow-md object-contain bg-white"
                      />
                    </div>

                    {/* Canvas Controls */}
                    <div className="flex-1 w-full space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <span>Zoom</span>
                          <span>{zoom.toFixed(2)}x</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg shrink-0"
                            onClick={() => setZoom(Math.max(0.5, Math.round((zoom - 0.05) * 100) / 100))}
                            title="Zoom Out"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Slider
                            value={[zoom]}
                            onValueChange={(val) => setZoom(val[0])}
                            min={0.5}
                            max={3.0}
                            step={0.01}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg shrink-0"
                            onClick={() => setZoom(Math.min(3.0, Math.round((zoom + 0.05) * 100) / 100))}
                            title="Zoom In"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <span>Horizontal Position</span>
                          <span>{posX.toFixed(1)}px</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg shrink-0"
                            onClick={() => setPosX(Math.max(-100, Math.round((posX - 1) * 2) / 2))}
                            title="Move Left"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Slider
                            value={[posX]}
                            onValueChange={(val) => setPosX(val[0])}
                            min={-100}
                            max={100}
                            step={0.5}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg shrink-0"
                            onClick={() => setPosX(Math.min(100, Math.round((posX + 1) * 2) / 2))}
                            title="Move Right"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <span>Vertical Position</span>
                          <span>{posY.toFixed(1)}px</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg shrink-0"
                            onClick={() => setPosY(Math.max(-100, Math.round((posY - 1) * 2) / 2))}
                            title="Move Up"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Slider
                            value={[posY]}
                            onValueChange={(val) => setPosY(val[0])}
                            min={-100}
                            max={100}
                            step={0.5}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg shrink-0"
                            onClick={() => setPosY(Math.min(100, Math.round((posY + 1) * 2) / 2))}
                            title="Move Down"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            {image && (
              <CardFooter className="bg-muted/30 p-6 border-t">
                <Button className="w-full h-14 rounded-2xl font-black italic text-sm sm:text-base md:text-lg px-2 sm:px-4 shadow-lg shadow-primary/20 whitespace-normal leading-tight flex items-center justify-center gap-2" onClick={handleGenerate} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin shrink-0" /> : <Zap className="h-5 w-5 shrink-0" />}
                  <span>GENERATE PASSPORT PHOTOS</span>
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
                  <h3 className="text-xl font-black italic tracking-tight">PHOTOS CREATED</h3>
                  
                  <div className="flex flex-col gap-3 w-full">
                    <a href={resultUrl} download="passport-photo-single.jpg" className="w-full">
                      <Button className="w-full h-12 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/95 text-white">
                        <Download className="mr-2 h-4 w-4" /> DOWNLOAD SINGLE PHOTO
                      </Button>
                    </a>

                    {sheetUrl && (
                      <a href={sheetUrl} download="passport-photo-sheet-4x6.jpg" className="w-full">
                        <Button className="w-full h-12 rounded-xl text-xs sm:text-sm font-bold bg-green-600 hover:bg-green-700 text-white">
                          <Download className="mr-2 h-4 w-4" /> DOWNLOAD 4X6" SHEET ({sheetPhotosCount} PCS)
                        </Button>
                      </a>
                    )}

                    {a4SheetUrl && (
                      <a href={a4SheetUrl} download="passport-photo-sheet-a4.jpg" className="w-full">
                        <Button className="w-full h-12 rounded-xl text-xs sm:text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white">
                          <Download className="mr-2 h-4 w-4" /> DOWNLOAD A4 SHEET ({a4PhotosCount} PCS)
                        </Button>
                      </a>
                    )}
                  </div>
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
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Passport Photo Maker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Passport Photo Maker is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Crop and resize photos to official passport sizes.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Passport Photo Maker tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Passport Photo Maker tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Passport Photo Maker upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Passport Photo Maker on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
