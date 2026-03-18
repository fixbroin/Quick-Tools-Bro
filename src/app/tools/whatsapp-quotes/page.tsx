
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Download, Image as ImageIcon, Type, Sparkles, Quote, Search, Palette, Move, ArrowRight, LayoutGrid, Smartphone, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scrollToDownload } from '@/lib/utils';

const QUOTES_DB = {
  motivation: [
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Don't watch the clock; do what it does. Keep going.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn’t just find you. You have to go out and get it.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It’s going to be hard, but hard does not mean impossible.",
    "Don’t wait for opportunity. Create it.",
    "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.",
    "The key to success is to focus on goals, not obstacles.",
    "Dream it. Believe it. Build it."
  ],
  success: [
    "Success is not final; failure is not fatal: it is the courage to continue that counts.",
    "Play by the rules, but be ferocious.",
    "Business opportunities are like buses, there's always another one coming.",
    "Success usually comes to those who are too busy to be looking for it.",
    "The way to get started is to quit talking and begin doing.",
    "If you really look closely, most overnight successes took a long time.",
    "The secret of success is to do the common thing uncommonly well.",
    "I find that the harder I work, the more luck I seem to have.",
    "Opportunities don't happen. You create them.",
    "Successful people do what unsuccessful people are not willing to do.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "The starting point of all achievement is desire.",
    "Everything you've ever wanted is on the other side of fear.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "What seems to us as bitter trials are often blessings in disguise.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "Don't be afraid to give up the good to go for the great.",
    "I never dreamed about success, I worked for it.",
    "Success is how high you bounce when you hit bottom.",
    "Action is the foundational key to all success."
  ],
  love: [
    "To love and be loved is to feel the sun from both sides.",
    "The best thing to hold onto in life is each other.",
    "You are my today and all of my tomorrows.",
    "Love is not about how many days, months, or years you have been together.",
    "Where there is love there is life.",
    "If I know what love is, it is because of you.",
    "My soul and your soul are forever tangled.",
    "Love all, trust a few, do wrong to none.",
    "Life without love is like a tree without blossoms or fruit.",
    "The greatest healing therapy is friendship and love.",
    "Love is when the other person's happiness is more important than your own.",
    "You don't marry someone you can live with—you marry someone you cannot live without.",
    "In all the world, there is no heart for me like yours.",
    "I saw that you were perfect, and so I loved you.",
    "Being deeply loved by someone gives you strength.",
    "There is only one happiness in this life, to love and be loved.",
    "Love is a canvas furnished by nature and embroidered by imagination.",
    "We love because it's the only true adventure.",
    "To the world you may be one person, but to one person you are the world.",
    "Love is composed of a single soul inhabiting two bodies."
  ],
  life: [
    "Life is what happens when you're busy making other plans.",
    "Get busy living or get busy dying.",
    "You only live once, but if you do it right, once is enough.",
    "The purpose of our lives is to be happy.",
    "Life is a long lesson in humility.",
    "In three words I can sum up everything I've learned about life: it goes on.",
    "Life is really simple, but we insist on making it complicated.",
    "The unexamined life is not worth living.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "Your time is limited, so don't waste it living someone else's life.",
    "Good friends, good books, and a sleepy conscience: this is the ideal life.",
    "Life is either a daring adventure or nothing at all.",
    "Keep smiling, because life is a beautiful thing.",
    "Life is made of ever so many partings welded together.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "The way I see it, if you want the rainbow, you gotta put up with the rain.",
    "Life is short, and it is here to be lived.",
    "Turn your wounds into wisdom.",
    "Life isn't about finding yourself. Life is about creating yourself.",
    "Live in the sunshine, swim the sea, drink the wild air."
  ],
  wisdom: [
    "The only true wisdom is in knowing you know nothing.",
    "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
    "Silence is a source of great strength.",
    "Knowing yourself is the beginning of all wisdom.",
    "Count your age by friends, not years. Count your life by smiles, not tears.",
    "The journey of a thousand miles begins with one step.",
    "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
    "Wisdom begins in wonder.",
    "By three methods we may learn wisdom: First, by reflection; Second, by imitation; Third by experience.",
    "The simple things are also the most extraordinary things.",
    "A wise man adapts himself to circumstances, as water shapes itself to the vessel that contains it.",
    "Patience is the companion of wisdom.",
    "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.",
    "Turn your obstacles into opportunities and your problems into possibilities.",
    "He who knows all the answers has not been asked all the questions.",
    "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
    "A fool is known by his speech and a wise man by his silence.",
    "The art of being wise is the art of knowing what to overlook.",
    "Never mistake knowledge for wisdom. One helps you make a living; the other helps you make a life.",
    "Wisdom is the reward you get for a lifetime of listening when you would have rather talked."
  ]
};

type Category = keyof typeof QUOTES_DB;

const ASPECT_RATIOS = [
  { id: 'square', label: 'Square', width: 1080, height: 1080, icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'vertical', label: 'Vertical', width: 1080, height: 1920, icon: <Smartphone className="h-4 w-4" /> },
  { id: 'horizontal', label: 'Horizontal', width: 1920, height: 1080, icon: <ImageIcon className="h-4 w-4" /> }
];

export default function WhatsAppQuotesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('motivation');
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

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 text-xl italic font-black"><Palette className="h-5 w-5 text-primary" /> STUDIO CONTROLS</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-primary">1. Content</Label>
                <Select value={selectedCategory} onValueChange={(v:any) => setSelectedCategory(v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="motivation">🔥 Motivation</SelectItem>
                        <SelectItem value="success">🏆 Success</SelectItem>
                        <SelectItem value="love">💖 Love</SelectItem>
                        <SelectItem value="life">🌍 Life</SelectItem>
                        <SelectItem value="wisdom">🧠 Wisdom</SelectItem>
                    </SelectContent>
                </Select>
                <textarea className="w-full min-h-[100px] p-3 text-sm rounded-xl border bg-muted/30 outline-none" value={activeQuote} onChange={(e) => setActiveQuote(e.target.value)} />
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
                <div className="grid grid-cols-2 gap-4">
                    <Input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="h-10 rounded-xl p-1" />
                    <Slider value={[overlayOpacity]} onValueChange={([v]) => setOverlayOpacity(v)} min={0} max={100} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 flex flex-col gap-3">
                <Button id="download-section" className="w-full h-14 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/20" onClick={handleDownload}>DOWNLOAD PHOTO <Download className="ml-2 h-5 w-5" /></Button>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Move className="h-4 w-4" /> Drag Text to Position</h3>
            <span className="text-[10px] font-mono bg-primary/10 text-primary px-3 py-1 rounded-full border">LIVE PREVIEW</span>
          </div>
          <div className="relative group rounded-[2.5rem] border-[12px] border-muted shadow-2xl bg-muted/20 overflow-hidden cursor-move mx-auto transition-all duration-500" style={{ aspectRatio: `${canvasDim.w} / ${canvasDim.h}`, maxWidth: canvasDim.w > canvasDim.h ? '100%' : '450px' }}>
            <canvas ref={canvasRef} width={canvasDim.w} height={canvasDim.h} onMouseDown={handlePointerStart} onMouseMove={handlePointerMove} onMouseUp={() => setIsDragging(null)} onMouseLeave={() => setIsDragging(null)} onTouchStart={handlePointerStart} onTouchMove={handlePointerMove} onTouchEnd={() => setIsDragging(null)} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.01] touch-none" />
          </div>
          <div className="space-y-4 pt-8">
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
    </div>
  );
}
