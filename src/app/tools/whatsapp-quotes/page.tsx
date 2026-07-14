
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Download, Image as ImageIcon, Type, Sparkles, Quote, Search, Palette, Move, ArrowRight, LayoutGrid, Smartphone, RotateCcw, Maximize, X, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { scrollToDownload } from '@/lib/utils';
import { QUOTES_DB } from './quotes-db';

type Category = keyof typeof QUOTES_DB;

const COLOR_PRESETS = [
  '#FFFFFF', // White
  '#000000', // Black
  '#F5F5F7', // Off-White/Light Gray
  '#3A3A3C', // Dark Gray
  '#FFD700', // Gold/Yellow
  '#FF9500', // Orange
  '#FF3B30', // Red
  '#FF2D55', // Pink
  '#AF52DE', // Purple
  '#007AFF', // Blue
  '#5AC8FA', // Sky Blue
  '#34C759'  // Green
];

const ASPECT_RATIOS = [
  { id: 'square', label: 'Square', width: 1080, height: 1080, icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'vertical', label: 'Vertical', width: 1080, height: 1920, icon: <Smartphone className="h-4 w-4" /> },
  { id: 'horizontal', label: 'Horizontal', width: 1920, height: 1080, icon: <ImageIcon className="h-4 w-4" /> }
];

const CATEGORY_META = [
  { id: 'motivation', label: 'Motivation', emoji: '🔥', desc: 'Inspiring quotes to fuel your ambition' },
  { id: 'success', label: 'Success', emoji: '🏆', desc: 'Insights on achievement and greatness' },
  { id: 'love', label: 'Love', emoji: '💖', desc: 'Heartfelt quotes about romance and affection' },
  { id: 'life', label: 'Life', emoji: '🌍', desc: 'Observations on living and the human journey' },
  { id: 'wisdom', label: 'Wisdom', emoji: '🧠', desc: 'Deep reflections and timeless insights' }
];

export default function WhatsAppQuotesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('motivation');
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isQuotesDialogOpen, setIsQuotesDialogOpen] = useState(false);
  const [quoteSearchQuery, setQuoteSearchQuery] = useState('');
  const [isFullscreenPreviewOpen, setIsFullscreenPreviewOpen] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState(QUOTES_DB.motivation[0]);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [overlayPos, setOverlayPos] = useState({ x: 200, y: 200 });
  const [overlayScale, setOverlayScale] = useState(30);
  const [fontSize, setFontSize] = useState(60);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState<'center' | 'left' | 'right'>('center');
  const [aspectRatio, setAspectRatio] = useState('square');
  const [canvasDim, setCanvasDim] = useState({ w: 1080, h: 1080 });
  const [textPos, setTextPos] = useState({ x: 540, y: 540 });
  const [overlayOpacity, setOverlayOpacity] = useState(40);
  const [isDragging, setIsDragging] = useState<'text' | 'overlay' | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const overlayImgRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  const handleRatioChange = (ratio: any) => {
      setAspectRatio(ratio.id);
      setCanvasDim({ w: ratio.width, h: ratio.height });
      setTextPos({ x: ratio.width / 2, y: ratio.height / 2 });
      setOverlayPos({ x: ratio.width / 4, y: ratio.height / 4 });
      if (ratio.id === 'vertical') setFontSize(80);
      else setFontSize(60);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBgImage(URL.createObjectURL(file));
  };

  const handleOverlayFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const url = URL.createObjectURL(file);
        setOverlayImage(url);
        const img = new Image();
        img.src = url;
        img.onload = () => {
            overlayImgRef.current = img;
            drawCanvas();
        };
    }
  };

  const removeOverlay = () => {
      setOverlayImage(null);
      overlayImgRef.current = null;
      toast({ title: "Overlay Removed" });
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let testY = y;
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, testY);
        line = words[n] + ' ';
        testY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, testY);
  };

  const drawCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgImage) {
      const img = new Image();
      img.src = bgImage;
      await new Promise((resolve) => {
        img.onload = () => {
          const aspect = img.width / img.height;
          let drawW = canvas.width;
          let drawH = canvas.width / aspect;
          if (drawH < canvas.height) { drawH = canvas.height; drawW = canvas.height * aspect; }
          ctx.drawImage(img, (canvas.width - drawW)/2, (canvas.height - drawH)/2, drawW, drawH);
          resolve(null);
        };
      });
    } else {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#1e293b'); grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = `rgba(0,0,0,${overlayOpacity/100})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (overlayImgRef.current && overlayImage) {
        ctx.save();
        const img = overlayImgRef.current;
        const aspect = img.width / img.height;
        const drawW = canvas.width * (overlayScale / 100);
        const drawH = drawW / aspect;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.drawImage(img, overlayPos.x - drawW/2, overlayPos.y - drawH/2, drawW, drawH);
        ctx.restore();
    }

    ctx.fillStyle = fontColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    wrapText(ctx, `"${activeQuote}"`, textPos.x, textPos.y, canvas.width - 100, fontSize * 1.2);
  }, [activeQuote, bgImage, overlayImage, overlayPos, overlayScale, fontSize, fontColor, textAlign, textPos, overlayOpacity]);

  useEffect(() => { 
    drawCanvas(); 
  }, [drawCanvas, bgImage, overlayImage]);

  const getPointerPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scale = canvas.width / rect.width;
    return { x: (clientX - rect.left) * scale, y: (clientY - rect.top) * scale };
  };

  const handlePointerStart = (e: any) => {
    const { x, y } = getPointerPos(e);
    
    // Check if clicking overlay image
    if (overlayImgRef.current && overlayImage) {
        const aspect = overlayImgRef.current.width / overlayImgRef.current.height;
        const drawW = canvasDim.w * (overlayScale / 100);
        const drawH = drawW / aspect;
        if (x >= overlayPos.x - drawW/2 && x <= overlayPos.x + drawW/2 && y >= overlayPos.y - drawH/2 && y <= overlayPos.y + drawH/2) {
            setIsDragging('overlay');
            setDragOffset({ x: x - overlayPos.x, y: y - overlayPos.y });
            return;
        }
    }

    // Default to text dragging
    setIsDragging('text');
    setDragOffset({ x: x - textPos.x, y: y - textPos.y });
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    const { x, y } = getPointerPos(e);
    
    if (isDragging === 'text') {
        setTextPos({ x: x - dragOffset.x, y: y - dragOffset.y });
    } else if (isDragging === 'overlay') {
        setOverlayPos({ x: x - dragOffset.x, y: y - dragOffset.y });
    }
    
    if (e.cancelable) e.preventDefault();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `quote-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  return (<>
      <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Item A: Live Preview (Desktop Left Top, Mobile Top - Sticky on Mobile) */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm pb-4 pt-2 shadow-sm border-b md:relative md:top-auto md:z-auto md:bg-transparent md:pb-0 md:pt-0 md:shadow-none md:border-none lg:col-span-8 lg:row-span-1 order-1 lg:order-1 space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Move className="h-4 w-4" /> Drag Text to Position</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-primary/10 text-primary px-3 py-1 rounded-full border">LIVE PREVIEW</span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border-primary/20 hover:bg-primary/5 transition-all"
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (canvas) {
                    setPreviewDataUrl(canvas.toDataURL('image/png'));
                    setIsFullscreenPreviewOpen(true);
                  }
                }}
              >
                <Maximize className="h-3.5 w-3.5 mr-1" /> Fullscreen
              </Button>
            </div>
          </div>
          <div className="relative group rounded-[2.5rem] border-[8px] md:border-[12px] border-muted shadow-2xl bg-muted/20 overflow-hidden cursor-move mx-auto transition-all duration-500 max-h-[180px] md:max-h-none" style={{ aspectRatio: `${canvasDim.w} / ${canvasDim.h}`, maxWidth: canvasDim.w > canvasDim.h ? '100%' : (canvasDim.w === canvasDim.h ? '450px' : '340px') }}>
            <canvas ref={canvasRef} width={canvasDim.w} height={canvasDim.h} onMouseDown={handlePointerStart} onMouseMove={handlePointerMove} onMouseUp={() => setIsDragging(null)} onMouseLeave={() => setIsDragging(null)} onTouchStart={handlePointerStart} onTouchMove={handlePointerMove} onTouchEnd={() => setIsDragging(null)} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.01] touch-none" />
          </div>
        </div>

        {/* Item B: Studio Controls (Desktop Right, Mobile Middle) */}
        <div className="lg:col-span-4 lg:row-span-2 order-2 lg:order-2 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 text-xl italic font-black"><Palette className="h-5 w-5 text-primary" /> STUDIO CONTROLS</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-primary">1. Content</Label>
                
                {/* Category Dialog Picker */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Select Category</Label>
                  <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-11 rounded-xl text-sm font-semibold border-primary/10 hover:bg-primary/5 transition-all">
                        <span className="flex items-center gap-2">
                          {selectedCategory === 'motivation' && '🔥 Motivation'}
                          {selectedCategory === 'success' && '🏆 Success'}
                          {selectedCategory === 'love' && '💖 Love'}
                          {selectedCategory === 'life' && '🌍 Life'}
                          {selectedCategory === 'wisdom' && '🧠 Wisdom'}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50 shrink-0 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-[92vw] rounded-2xl p-6 gap-4 overflow-hidden flex flex-col z-50">
                      <DialogHeader className="border-b pb-2">
                        <DialogTitle className="text-lg font-black italic tracking-wide text-left uppercase">Choose a Category</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-3 mt-2 max-h-[350px] overflow-y-auto pr-1">
                        {CATEGORY_META.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id as Category);
                              setActiveQuote(QUOTES_DB[cat.id as Category][0]);
                              setIsCategoryDialogOpen(false);
                              toast({ title: `Category Switched: ${cat.label}`, description: `Loaded quotes from ${cat.label}.` });
                            }}
                            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                              selectedCategory === cat.id
                                ? 'bg-primary/5 border-primary text-primary font-bold'
                                : 'hover:bg-muted border-border text-foreground'
                            }`}
                          >
                            <span className="text-2xl">{cat.emoji}</span>
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold">{cat.label}</p>
                              <p className="text-xs text-muted-foreground">{cat.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Browse Quotes Pop-up Dialog */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Select Quote Template</Label>
                  <Dialog open={isQuotesDialogOpen} onOpenChange={(open) => {
                    setIsQuotesDialogOpen(open);
                    if (!open) setQuoteSearchQuery('');
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-11 rounded-xl text-sm font-semibold border-primary/10 hover:bg-primary/5 transition-all text-indigo-500 hover:text-indigo-600">
                        <span className="flex items-center gap-2">
                          <Quote className="h-4 w-4 shrink-0" /> Browse Category Quotes
                        </span>
                        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl w-[92vw] rounded-2xl p-6 flex flex-col h-[80vh] z-50 gap-4">
                      <DialogHeader className="border-b pb-2">
                        <DialogTitle className="text-lg font-black italic tracking-wide text-left uppercase">
                          Browse {selectedCategory.toUpperCase()} Quotes
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-2 flex-1 flex flex-col min-h-0">
                        <div className="relative w-full">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search quotes in this category..."
                            value={quoteSearchQuery}
                            onChange={(e) => setQuoteSearchQuery(e.target.value)}
                            className="pl-9 rounded-xl border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 h-10"
                          />
                          {quoteSearchQuery && (
                            <button
                              onClick={() => setQuoteSearchQuery('')}
                              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0 custom-scrollbar">
                          {QUOTES_DB[selectedCategory]
                            .filter(q => q.toLowerCase().includes(quoteSearchQuery.toLowerCase()))
                            .map((q, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setActiveQuote(q);
                                  setIsQuotesDialogOpen(false);
                                  setQuoteSearchQuery('');
                                  toast({ title: "Quote Applied!" });
                                }}
                                className="w-full p-4 rounded-xl border text-left bg-card hover:bg-primary/5 border-border hover:border-primary/30 transition-all block"
                              >
                                <p className="text-sm font-medium italic leading-relaxed">"{q}"</p>
                              </button>
                            ))}
                          {QUOTES_DB[selectedCategory].filter(q => q.toLowerCase().includes(quoteSearchQuery.toLowerCase())).length === 0 && (
                            <p className="text-center py-8 text-xs text-muted-foreground">No matching quotes found.</p>
                          )}
                        </div>
                        
                        {/* Search Statistics Footer */}
                        <div className="border-t pt-3 flex justify-between items-center text-xs mt-2 shrink-0">
                          <span className="text-muted-foreground">
                            Showing {QUOTES_DB[selectedCategory].filter(q => q.toLowerCase().includes(quoteSearchQuery.toLowerCase())).length} of {QUOTES_DB[selectedCategory].length} templates
                          </span>
                          {quoteSearchQuery && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setQuoteSearchQuery('')}
                              className="text-primary hover:text-primary/80 font-bold h-auto p-0"
                            >
                              Clear Search
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Quote Text Editor</Label>
                  <textarea className="w-full min-h-[100px] p-3 text-sm rounded-xl border bg-muted/30 outline-none" value={activeQuote} onChange={(e) => setActiveQuote(e.target.value)} />
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-xs font-black uppercase tracking-widest text-primary">2. Format & Size</Label>
                <div className="grid grid-cols-3 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                        <Button key={ratio.id} variant={aspectRatio === ratio.id ? 'default' : 'outline'} size="sm" className="flex flex-col h-auto py-2 gap-1 rounded-xl" onClick={() => handleRatioChange(ratio)}>
                            {ratio.icon} <span className="text-[8px] uppercase font-bold">{ratio.label}</span>
                        </Button>
                    ))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-xs font-black uppercase tracking-widest text-primary">3. Visuals</Label>
                <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold flex justify-between italic">1. Main Background <ImageIcon className="h-3 w-3" /></Label>
                    <Input type="file" accept="image/*" onChange={handleFileChange} className="rounded-xl cursor-pointer" />
                </div>
                
                <div className="space-y-3 pt-4 border-t border-dashed">
                    <Label className="text-[10px] uppercase font-bold flex justify-between italic text-indigo-500">2. Secondary Overlay (Logo/Sticker) <Sparkles className="h-3 w-3" /></Label>
                    <div className="flex gap-2">
                        <Input type="file" accept="image/*" onChange={handleOverlayFileChange} className="rounded-xl cursor-pointer flex-1" />
                        {overlayImage && <Button variant="destructive" size="icon" onClick={removeOverlay} className="rounded-xl h-10 w-10 shrink-0"><RotateCcw className="h-4 w-4" /></Button>}
                    </div>
                    {overlayImage && (
                        <div className="space-y-2 pt-2">
                            <Label className="text-[10px] uppercase font-bold flex justify-between">Overlay Scale <span>{overlayScale}%</span></Label>
                            <Slider value={[overlayScale]} onValueChange={([v]) => setOverlayScale(v)} min={5} max={100} />
                        </div>
                    )}
                </div>

                <div className="space-y-3 pt-4 border-t">
                    <Label className="text-[10px] uppercase font-bold flex justify-between italic">3. Typography Size <span>{fontSize}px</span></Label>
                    <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={20} max={150} />
                </div>
                <div className="space-y-3 pt-4 border-t">
                    <Label className="text-[10px] uppercase font-bold flex justify-between italic">4. Typography Color <span>{fontColor}</span></Label>
                    <div className="flex flex-wrap gap-1.5 py-1">
                        {COLOR_PRESETS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFontColor(color)}
                                className={`h-6 w-6 rounded-full border transition-all ${
                                    fontColor.toLowerCase() === color.toLowerCase()
                                        ? 'ring-2 ring-primary ring-offset-1 scale-110 border-primary'
                                        : 'hover:scale-105 border-muted-foreground/20'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                        {/* Custom trigger button */}
                        <button
                            type="button"
                            onClick={() => colorInputRef.current?.click()}
                            className="h-6 w-6 rounded-full border bg-muted flex items-center justify-center hover:scale-110 transition-all border-dashed border-primary/30"
                            title="Custom Color Picker"
                        >
                            <Palette className="h-3.5 w-3.5 text-primary" />
                        </button>
                        {/* Hidden native input */}
                        <input
                            type="color"
                            ref={colorInputRef}
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            className="sr-only"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="HEX Code (e.g. #FFFFFF)"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            className="h-8 rounded-xl text-[10px] font-mono border-primary/10"
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                    <Label className="text-[10px] uppercase font-bold flex justify-between italic">5. Background Overlay Opacity <span>{overlayOpacity}%</span></Label>
                    <Slider value={[overlayOpacity]} onValueChange={([v]) => setOverlayOpacity(v)} min={0} max={100} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 flex flex-col gap-3">
                <Button id="download-section" className="w-full h-14 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/20" onClick={handleDownload}>DOWNLOAD PHOTO <Download className="ml-2 h-5 w-5" /></Button>
            </CardFooter>
          </Card>
        </div>

        {/* Item C: Explore Quotes (Desktop Left Bottom, Mobile Bottom) */}
        <div className="lg:col-span-8 lg:row-span-1 order-3 lg:order-3 space-y-4">
          <div className="flex items-center gap-2 text-primary font-black italic"><Search className="h-5 w-5" /> EXPLORE QUOTES</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {QUOTES_DB[selectedCategory].map((q, i) => (
                  <button key={i} onClick={() => { setActiveQuote(q); scrollToDownload(); }} className="p-6 text-left rounded-3xl border bg-card/50 hover:bg-primary/5 transition-all group relative overflow-hidden">
                      <Quote className="absolute -top-2 -right-2 h-12 w-12 text-primary/5" />
                      <p className="text-sm font-medium italic leading-relaxed">"{q}"</p>
                      <div className="mt-4 flex items-center text-[10px] font-black uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity">Apply <ArrowRight className="ml-1 h-3 w-3" /></div>
                  </button>
              ))}
          </div>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our WhatsApp Quotes?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our WhatsApp Quotes is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Find and share quotes for WhatsApp.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the WhatsApp Quotes tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the WhatsApp Quotes tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this WhatsApp Quotes upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use WhatsApp Quotes on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Fullscreen Preview Dialog */}
      <Dialog open={isFullscreenPreviewOpen} onOpenChange={setIsFullscreenPreviewOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-xl rounded-3xl p-6 flex flex-col items-center justify-center">
          <DialogHeader className="w-full text-center">
            <DialogTitle className="text-lg font-black italic text-primary uppercase tracking-wider">Fullscreen Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4 w-full flex items-center justify-center p-2 bg-muted/20 rounded-2xl border border-dashed">
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Quote Fullscreen Preview"
                className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-xl"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            )}
          </div>
          <div className="mt-6 flex gap-3 w-full">
            <Button variant="outline" className="flex-1 rounded-xl font-bold font-mono text-xs uppercase" onClick={() => setIsFullscreenPreviewOpen(false)}>
              Close
            </Button>
            <Button className="flex-1 rounded-xl font-bold font-mono text-xs uppercase shadow-lg shadow-primary/20" onClick={() => {
              handleDownload();
              setIsFullscreenPreviewOpen(false);
            }}>
              Download <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>);
}
