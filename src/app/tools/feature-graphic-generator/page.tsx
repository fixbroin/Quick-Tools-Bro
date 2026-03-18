
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, AlignLeft, AlignCenter, AlignRight, Type, Image as ImageIcon, Maximize, Palette, Sparkles, MousePointer2, Layout, LayoutGrid, Zap, Move, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { scrollToDownload } from '@/lib/utils';

const FONT_FAMILIES = [
  'Inter', 'Roboto', 'Montserrat', 'Playfair Display', 'Space Grotesk', 'Poppins', 'Oswald', 'Caveat', 'Bangers', 'Arial'
];

interface ElementPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function FeatureGraphicGeneratorPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('Elevate Your App');
  const [description, setDescription] = useState('Build stunning assets in seconds with precision tools.');
  const [bgColor1, setBgColor1] = useState('#6366f1');
  const [bgColor2, setBgColor2] = useState('#a855f7');
  const [bgType, setBgType] = useState<'solid' | 'gradient'>('gradient');
  const [bgPattern, setBgTypePattern] = useState<'none' | 'dots' | 'noise'>('dots');
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [titleFontSize, setTitleFontSize] = useState(80);
  const [descriptionFontSize, setDescriptionFontSize] = useState(32);
  
  // Interactive Positions
  const [logoPos, setLogoPos] = useState<ElementPosition>({ x: 412, y: 80, width: 200, height: 200 });
  const [titlePos, setTitlePos] = useState<ElementPosition>({ x: 512, y: 320, width: 800, height: 100 });
  const [descPos, setDescPos] = useState<ElementPosition>({ x: 512, y: 410, width: 700, height: 60 });

  const [titleAlign, setTitleAlign] = useState<'center' | 'left' | 'right'>('center');
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [textShadow, setTextShadow] = useState(15);

  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  // Load fonts
  useEffect(() => {
    const fontName = fontFamily.split(',')[0].replace(/"/g, '').trim();
    const url = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;700&display=swap`;
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, [fontFamily]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      const img = new Image();
      img.src = url;
      img.onload = () => {
          logoImgRef.current = img;
          const aspect = img.width / img.height;
          setLogoPos(prev => ({ ...prev, width: 200 * aspect, height: 200 }));
      };
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background
    if (bgType === 'solid') {
      ctx.fillStyle = bgColor1;
    } else {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, bgColor1);
      grad.addColorStop(1, bgColor2);
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Patterns
    if (bgPattern === 'dots') {
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        for(let i=0; i<canvas.width; i+=30) {
            for(let j=0; j<canvas.height; j+=30) {
                ctx.beginPath(); ctx.arc(i, j, 1.5, 0, Math.PI*2); ctx.fill();
            }
        }
    } else if (bgPattern === 'noise') {
        for(let i=0; i<1000; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.05})`;
            ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 2, 2);
        }
    }

    // 3. Logo
    if (logoImgRef.current) {
      ctx.save();
      ctx.globalAlpha = logoOpacity / 100;
      ctx.shadowBlur = 30;
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.drawImage(logoImgRef.current, logoPos.x, logoPos.y, logoPos.width, logoPos.height);
      
      // Highlight on hover/drag
      if (isDragging === 'logo' || hoveredElement === 'logo') {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 4;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(logoPos.x - 5, logoPos.y - 5, logoPos.width + 10, logoPos.height + 10);
      }
      ctx.restore();
    }

    // 4. Text Setup
    ctx.textBaseline = 'middle';
    ctx.fillStyle = fontColor;
    
    if (textShadow > 0) {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = textShadow;
        ctx.shadowOffsetY = 5;
    }

    const fontName = fontFamily.split(',')[0].replace(/"/g, '');

    // Title
    ctx.textAlign = titleAlign;
    ctx.font = `bold ${titleFontSize}px "${fontName}"`;
    
    // Calculate maxWidth to prevent bleeding off canvas
    let titleMaxWidth = 900;
    if (titleAlign === 'left') titleMaxWidth = Math.max(200, canvas.width - titlePos.x - 40);
    else if (titleAlign === 'right') titleMaxWidth = Math.max(200, titlePos.x - 40);
    else titleMaxWidth = Math.min(titlePos.x, canvas.width - titlePos.x) * 2 - 40;

    wrapText(ctx, title, titlePos.x, titlePos.y, titleMaxWidth, titleFontSize * 1.1);
    
    if (isDragging === 'title' || hoveredElement === 'title') {
        ctx.save();
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.setLineDash([5,5]);
        let boxX = titlePos.x - titleMaxWidth/2;
        if (titleAlign === 'left') boxX = titlePos.x;
        else if (titleAlign === 'right') boxX = titlePos.x - titleMaxWidth;
        // Use font size to determine box height
        const boxHeight = titleFontSize * 1.2;
        ctx.strokeRect(boxX, titlePos.y - boxHeight/2, titleMaxWidth, boxHeight);
        ctx.restore();
    }

    // Description
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.textAlign = titleAlign;
    ctx.font = `${descriptionFontSize}px "${fontName}"`;
    
    let descMaxWidth = 800;
    if (titleAlign === 'left') descMaxWidth = Math.max(200, canvas.width - descPos.x - 40);
    else if (titleAlign === 'right') descMaxWidth = Math.max(200, descPos.x - 40);
    else descMaxWidth = Math.min(descPos.x, canvas.width - descPos.x) * 2 - 40;

    wrapText(ctx, description, descPos.x, descPos.y, descMaxWidth, descriptionFontSize * 1.3);
    
    if (isDragging === 'desc' || hoveredElement === 'desc') {
        ctx.save();
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.setLineDash([5,5]);
        let boxX = descPos.x - descMaxWidth/2;
        if (titleAlign === 'left') boxX = descPos.x;
        else if (titleAlign === 'right') boxX = descPos.x - descMaxWidth;
        const boxHeight = descriptionFontSize * 1.4;
        ctx.strokeRect(boxX, descPos.y - boxHeight/2, descMaxWidth, boxHeight);
        ctx.restore();
    }

  }, [bgColor1, bgColor2, bgType, bgPattern, title, description, fontColor, fontFamily, titleFontSize, descriptionFontSize, logoPos, titlePos, descPos, titleAlign, logoOpacity, textShadow, isDragging, hoveredElement]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  // Drag & Drop Logic (Unified for Mouse and Touch)
  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getPointerPos(e);
    
    if (x >= logoPos.x && x <= logoPos.x + logoPos.width && y >= logoPos.y && y <= logoPos.y + logoPos.height) {
        setIsDragging('logo');
        setDragOffset({ x: x - logoPos.x, y: y - logoPos.y });
        return;
    }
    if (Math.abs(y - titlePos.y) < 50) {
        setIsDragging('title');
        setDragOffset({ x: x - titlePos.x, y: y - titlePos.y });
        return;
    }
    if (Math.abs(y - descPos.y) < 30) {
        setIsDragging('desc');
        setDragOffset({ x: x - descPos.x, y: y - descPos.y });
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getPointerPos(e);
    
    // Hover effects (mouse only)
    if (!('touches' in e)) {
        if (x >= logoPos.x && x <= logoPos.x + logoPos.width && y >= logoPos.y && y <= logoPos.y + logoPos.height) setHoveredElement('logo');
        else if (Math.abs(y - titlePos.y) < 50) setHoveredElement('title');
        else if (Math.abs(y - descPos.y) < 30) setHoveredElement('desc');
        else setHoveredElement(null);
    }

    if (!isDragging) return;
    // Prevent scrolling when dragging on touch devices
    if ('touches' in e) {
        if (e.cancelable) e.preventDefault();
    }

    if (isDragging === 'logo') setLogoPos(p => ({ ...p, x: x - dragOffset.x, y: y - dragOffset.y }));
    if (isDragging === 'title') setTitlePos(p => ({ ...p, x: x - dragOffset.x, y: y - dragOffset.y }));
    if (isDragging === 'desc') setDescPos(p => ({ ...p, x: x - dragOffset.x, y: y - dragOffset.y }));
  };

  // Templates
  const applyTemplate = (type: number) => {
      if (type === 1) { // Vibrant Store
          setBgColor1('#ff4e50'); setBgColor2('#f9d423'); setBgType('gradient'); setBgTypePattern('dots');
          setFontColor('#ffffff'); setFontFamily('Space Grotesk');
          setLogoPos({ x: 412, y: 60, width: 200, height: 200 });
          setTitlePos({ x: 512, y: 320, width: 800, height: 100 });
          setDescPos({ x: 512, y: 410, width: 700, height: 60 });
          setTitleAlign('center');
      } else if (type === 2) { // Dark Professional (Sleek)
          setBgColor1('#0f172a'); setBgColor2('#1e293b'); setBgType('gradient'); setBgTypePattern('noise');
          setFontColor('#38bdf8'); setFontFamily('Inter');
          setLogoPos({ x: 60, y: 125, width: 250, height: 250 }); // Moved further left (100 -> 60)
          setTitlePos({ x: 480, y: 180, width: 500, height: 100 }); // Moved right and up
          setDescPos({ x: 480, y: 340, width: 500, height: 60 }); // Increased gap (300 -> 340)
          setTitleAlign('left');
          setTitleFontSize(85);
          setDescriptionFontSize(34);
      } else if (type === 3) { // Minimal Soft
          setBgColor1('#f8fafc'); setBgType('solid'); setBgTypePattern('none');
          setFontColor('#1e293b'); setFontFamily('Playfair Display');
          setLogoPos({ x: 462, y: 50, width: 100, height: 100 });
          setTitlePos({ x: 512, y: 250, width: 800, height: 100 });
          setDescPos({ x: 512, y: 330, width: 700, height: 60 });
          setTitleAlign('center');
      } else if (type === 4) { // Gaming Pulse
          setBgColor1('#000000'); setBgColor2('#dc2626'); setBgType('gradient'); setBgTypePattern('dots');
          setFontColor('#ffffff'); setFontFamily('Bangers');
          setLogoPos({ x: 412, y: 40, width: 220, height: 220 });
          setTitlePos({ x: 512, y: 330, width: 800, height: 120 });
          setDescPos({ x: 512, y: 430, width: 700, height: 60 });
          setTitleAlign('center');
          setTitleFontSize(110);
          setDescriptionFontSize(40);
          setTextShadow(30);
      } else if (type === 5) { // Organic Eco
          setBgColor1('#065f46'); setBgColor2('#064e3b'); setBgType('gradient'); setBgTypePattern('noise');
          setFontColor('#ecfdf5'); setFontFamily('Montserrat');
          setLogoPos({ x: 80, y: 150, width: 200, height: 200 }); // Moved further left (150 -> 80)
          setTitlePos({ x: 480, y: 180, width: 500, height: 100 }); // Moved right and up
          setDescPos({ x: 480, y: 340, width: 500, height: 60 }); // Increased gap (310 -> 340)
          setTitleAlign('left');
          setTitleFontSize(75);
          setDescriptionFontSize(32);
          setTextShadow(10);
      }
      toast({ title: `Magic Template applied!` });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `feature-graphic-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  return (
    <div className="space-y-6">
    <Card className="border-primary/20 shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="bg-primary/5 border-b border-primary/10 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <CardTitle className="font-headline text-3xl flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                    Interactive Studio Designer
                </CardTitle>
                <CardDescription className="text-lg">Drag elements freely. Choose templates. Export in 4K quality.</CardDescription>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Magic Layouts</Label>
                <div className="flex flex-wrap justify-center gap-2 bg-background/80 p-2 rounded-2xl border shadow-xl">
                    <Button variant="outline" size="sm" onClick={() => applyTemplate(1)} className="rounded-xl border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all"><Zap className="h-4 w-4 mr-1 text-orange-500 group-hover:text-white"/> Vibrant</Button>
                    <Button variant="outline" size="sm" onClick={() => applyTemplate(2)} className="rounded-xl border-blue-500/20 hover:bg-slate-900 hover:text-white transition-all"><Layout className="h-4 w-4 mr-1 text-blue-500"/> Sleek</Button>
                    <Button variant="outline" size="sm" onClick={() => applyTemplate(3)} className="rounded-xl border-slate-500/20 hover:bg-slate-100 hover:text-black transition-all"><Target className="h-4 w-4 mr-1 text-slate-500"/> Minimal</Button>
                    <Button variant="outline" size="sm" onClick={() => applyTemplate(4)} className="rounded-xl border-red-500/20 hover:bg-red-600 hover:text-white transition-all"><Sparkles className="h-4 w-4 mr-1 text-red-500"/> Gaming</Button>
                    <Button variant="outline" size="sm" onClick={() => applyTemplate(5)} className="rounded-xl border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all"><Palette className="h-4 w-4 mr-1 text-emerald-500"/> Organic</Button>
                </div>
            </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* 🛠 Column 1: Controls */}
            <div className="lg:col-span-3 space-y-8 lg:border-r lg:pr-6 border-t lg:border-t-0 pt-8 lg:pt-0 order-2 lg:order-1">
                <section className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2 bg-primary/5 p-2 rounded-lg">
                        <ImageIcon className="h-4 w-4" /> Asset Controls
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Company Logo</Label>
                            <Input type="file" accept="image/*" onChange={handleFileChange} className="rounded-xl cursor-pointer bg-muted/30" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs flex justify-between">Scale <span>{Math.round(logoPos.width)}px</span></Label>
                            <Slider value={[logoPos.width]} onValueChange={([v]) => setLogoPos(p => ({...p, width: v, height: v / (logoImgRef.current ? logoImgRef.current.width/logoImgRef.current.height : 1)}))} min={50} max={600} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs flex justify-between">Opacity <span>{logoOpacity}%</span></Label>
                            <Slider value={[logoOpacity]} onValueChange={([v]) => setLogoOpacity(v)} min={0} max={100} />
                        </div>
                    </div>
                </section>

                <section className="space-y-4 pt-6 border-t">
                    <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2 bg-primary/5 p-2 rounded-lg">
                        <Palette className="h-4 w-4" /> Canvas Style
                    </h3>
                    <div className="space-y-4">
                        <RadioGroup value={bgType} onValueChange={(v) => setBgType(v as any)} className="flex gap-4">
                            <div className="flex-1 flex items-center space-x-2 bg-muted/50 p-2 px-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                                <RadioGroupItem value="solid" id="solid"/>
                                <Label htmlFor="solid" className="cursor-pointer text-xs">Solid</Label>
                            </div>
                            <div className="flex-1 flex items-center space-x-2 bg-muted/50 p-2 px-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                                <RadioGroupItem value="gradient" id="gradient"/>
                                <Label htmlFor="gradient" className="cursor-pointer text-xs">Gradient</Label>
                            </div>
                        </RadioGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <Input type="color" value={bgColor1} onChange={(e) => setBgColor1(e.target.value)} className="h-12 w-full rounded-xl p-1 border-2 border-primary/10 shadow-sm" />
                            {bgType === 'gradient' && <Input type="color" value={bgColor2} onChange={(e) => setBgColor2(e.target.value)} className="h-12 w-full rounded-xl p-1 border-2 border-primary/10 shadow-sm" />}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Overlay Texture</Label>
                            <Select value={bgPattern} onValueChange={(v:any) => setBgTypePattern(v)}>
                                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Smooth Finish</SelectItem>
                                    <SelectItem value="dots">Subtle Tech Dots</SelectItem>
                                    <SelectItem value="noise">Premium Grain</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>
            </div>

            {/* 🖥 Column 2: Live Canvas */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                <div className="flex items-center justify-between bg-primary/10 p-2 px-4 rounded-full border border-primary/20">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-tighter">
                        <MousePointer2 className="h-3 w-3" /> Drag Elements Directly Below
                    </div>
                    <span className="hidden sm:inline-block text-[10px] font-mono bg-background px-3 py-1 rounded-full border shadow-sm">1024 x 500 NATIVE RENDER</span>
                </div>
                
                <div className="relative group rounded-xl md:rounded-[2rem] border-[4px] md:border-[12px] border-muted shadow-2xl bg-muted/20 overflow-hidden cursor-move aspect-[1024/500]">
                    <canvas 
                        ref={canvasRef}
                        onMouseDown={handleStart}
                        onMouseMove={handleMove}
                        onMouseUp={() => setIsDragging(null)}
                        onMouseLeave={() => { setIsDragging(null); setHoveredElement(null); }}
                        onTouchStart={handleStart}
                        onTouchMove={handleMove}
                        onTouchEnd={() => setIsDragging(null)}
                        width={1024} 
                        height={500}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.005] touch-none"
                    />
                    {isDragging && (
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none animate-pulse border-4 border-primary/30 rounded-2xl" />
                    )}
                    {isDragging && (
                        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-primary/95 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black shadow-2xl backdrop-blur-md border border-white/20 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
                            <Move className="h-3 w-3 animate-bounce" /> Repositioning {isDragging}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4 transition-all hover:bg-indigo-500/10">
                        <div className="bg-indigo-500/20 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-inner"><Zap className="h-5 md:h-6 w-5 md:w-6 text-indigo-500" /></div>
                        <div>
                            <h4 className="text-sm font-black italic tracking-tight uppercase">Fast Workflow</h4>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Drag anything freely</p>
                        </div>
                    </div>
                    <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4 transition-all hover:bg-emerald-500/10">
                        <div className="bg-emerald-500/20 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-inner"><Sparkles className="h-5 md:h-6 w-5 md:w-6 text-emerald-500" /></div>
                        <div>
                            <h4 className="text-sm font-black italic tracking-tight uppercase">Studio Quality</h4>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Pro 4K PNG export</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✍️ Column 3: Typography & Export */}
            <div className="lg:col-span-3 space-y-8 lg:border-l lg:pl-6 border-t lg:border-t-0 pt-8 lg:pt-0 order-3 lg:order-3">
                <section className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2 bg-primary/5 p-2 rounded-lg">
                        <Type className="h-4 w-4" /> Text Designer
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Main App Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl font-bold border-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Secondary Description</Label>
                            <Input value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl text-xs bg-muted/20" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Font Portfolio</Label>
                            <Select value={fontFamily} onValueChange={setFontFamily}>
                                <SelectTrigger className="rounded-xl border-primary/20 shadow-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="max-h-[300px] rounded-xl">
                                    {FONT_FAMILIES.map(f => <SelectItem key={f} value={f} style={{fontFamily: f}}>{f}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] flex justify-between">Title Size <span>{titleFontSize}px</span></Label>
                            <Slider value={[titleFontSize]} onValueChange={([v]) => setTitleFontSize(v)} min={20} max={200} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] flex justify-between">Desc Size <span>{descriptionFontSize}px</span></Label>
                            <Slider value={[descriptionFontSize]} onValueChange={([v]) => setDescriptionFontSize(v)} min={10} max={100} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[10px]">Title Color</Label>
                                <Input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="h-10 rounded-xl" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">Shadow Blur</Label>
                                <Slider value={[textShadow]} onValueChange={([v]) => setTextShadow(v)} min={0} max={50} className="pt-4" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4 pt-6 border-t">
                    <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2 bg-primary/5 p-2 rounded-lg">
                        <AlignLeft className="h-4 w-4" /> Alignment
                    </h3>
                    <div className="flex gap-2">
                        <Button variant={titleAlign === 'left' ? 'default' : 'outline'} className="flex-1 rounded-xl h-12 shadow-sm" onClick={() => setTitleAlign('left')}><AlignLeft className="h-5 w-5"/></Button>
                        <Button variant={titleAlign === 'center' ? 'default' : 'outline'} className="flex-1 rounded-xl h-12 shadow-sm" onClick={() => setTitleAlign('center')}><AlignCenter className="h-5 w-5"/></Button>
                        <Button variant={titleAlign === 'right' ? 'default' : 'outline'} className="flex-1 rounded-xl h-12 shadow-sm" onClick={() => setTitleAlign('right')}><AlignRight className="h-5 w-5"/></Button>
                    </div>
                </section>

                <Button id="download-section" className="w-full h-16 md:h-20 text-lg md:text-xl font-black italic rounded-[1.25rem] md:rounded-[1.5rem] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all bg-gradient-to-r from-primary to-indigo-600 border-t border-white/20 group" onClick={handleDownload}>
                    EXPORT PNG <Download className="ml-2 h-6 md:h-7 w-6 md:w-7 group-hover:animate-bounce" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>

    {/* Professional Guide */}
    <section className="mt-20 space-y-12 pb-20">
        <div className="text-center space-y-4">
            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-primary/20">The Design Suite</span>
            <h2 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">ADVANCED STUDIO FEATURES</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Create Play Store feature graphics that convert. Optimized for Google's 2024 mobile specifications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group bg-card border border-border/50 p-10 rounded-[3rem] space-y-6 hover:border-primary/30 transition-all hover:shadow-2xl">
                <div className="h-16 w-16 bg-indigo-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 group-hover:rotate-6 transition-transform"><MousePointer2 className="h-8 w-8" /></div>
                <h3 className="text-2xl font-black italic tracking-tight">FLUID DRAG</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">The entire canvas is interactive. Pick up any element and find the perfect visual balance without touching a single input field.</p>
            </div>
            <div className="group bg-card border border-border/50 p-10 rounded-[3rem] space-y-6 hover:border-orange-500/30 transition-all hover:shadow-2xl">
                <div className="h-16 w-16 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-500/40 group-hover:scale-110 transition-transform"><Zap className="h-8 w-8" /></div>
                <h3 className="text-2xl font-black italic tracking-tight">MAGIC TEMPLATES</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Professionally curated layout presets. One click instantly updates colors, typography, and positions for a high-converting listing.</p>
            </div>
            <div className="group bg-card border border-border/50 p-10 rounded-[3rem] space-y-6 hover:border-emerald-500/30 transition-all hover:shadow-2xl">
                <div className="h-16 w-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/40 group-hover:-rotate-6 transition-transform"><Maximize className="h-8 w-8" /></div>
                <h3 className="text-2xl font-black italic tracking-tight">4K RENDERING</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Engineered for 1024x500 native resolution. High-bitrate PNG export ensures your assets look crisp on every Android device.</p>
            </div>
        </div>
    </section>
    </div>
  );
}
