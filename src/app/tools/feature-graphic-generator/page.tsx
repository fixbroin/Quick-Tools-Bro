
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const FONT_FAMILIES = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro', 'Slabo 27px', 'Raleway', 'PT Sans', 'Merriweather',
  'Noto Sans', 'Poppins', 'Ubuntu', 'Playfair Display', 'Lora', 'Nunito', 'Fira Sans', 'Quicksand', 'Work Sans', 'Dosis',
  'Indie Flower', 'Pacifico', 'Shadows Into Light', 'Caveat', 'Amatic SC', 'Permanent Marker', 'Bangers', 'Lobster', 'Anton',
  'Yanone Kaffeesatz', 'Arvo', 'Zilla Slab', 'Barlow', 'Titillium Web', 'Josefin Sans', 'Comfortaa', 'Righteous', 'Fredoka One',
  'Exo 2', 'Teko', 'M PLUS Rounded 1c', 'Crimson Text', 'Cabin', 'Varela Round', 'Acme', 'Archivo', 'Asap', 'Bree Serif',
  'Cormorant Garamond', 'Dancing Script', 'Domine', 'EB Garamond', 'IBM Plex Sans', 'Inconsolata', 'Karla', 'Libre Baskerville',
  'Libre Franklin', 'Maven Pro', 'Mukta', 'Overpass', 'Oxygen', 'Patua One', 'Play', 'Questrial', 'Rajdhani', 'Rubik',
  'Signika', 'Source Code Pro', 'Spectral', 'Taviraj', 'Trirong', 'Unna', 'Vollkorn', 'Alegreya', 'BioRhyme', 'Chivo',
  'Crete Round', 'Hind', 'Kanit', 'Khand', 'Manrope', 'Merriweather Sans', 'Noticia Text', 'Nunito Sans', 'PT Serif', 'Quattrocento',
  'Rokkitt', 'Saira', 'Sarabun', 'Sawarabi Mincho', 'Tinos', 'Bitter', 'Cardo', 'Cinzel', 'Heebo', 'Inter', 'Old Standard TT',
  'Space Grotesk', 'Arial', 'Verdana', 'Georgia', 'monospace'
];

async function loadFont(fontFamily: string) {
  const fontName = fontFamily.split(',')[0].replace(/"/g, '').trim();
  if (['Arial', 'Verdana', 'Georgia', 'monospace'].includes(fontName) || document.fonts.check(`1em ${fontName}`)) {
    return;
  }
  
  const url = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;700&display=swap`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to load font stylesheet.');
    }
    const css = await response.text();
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    
    await document.fonts.load(`1em ${fontName}`);

  } catch(error) {
    console.error(`Failed to load font: ${fontName}`, error);
  }
}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let textY = y;
    const originalAlign = context.textAlign;

    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        let lineX = x;
        if (originalAlign === 'center') {
            lineX = x + (maxWidth / 2);
        } else if (originalAlign === 'right') {
            lineX = x + maxWidth;
        }
        context.fillText(line, lineX, textY);
        line = words[n] + ' ';
        textY += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    let lineX = x;
    if (originalAlign === 'center') {
        lineX = x + (maxWidth / 2);
    } else if (originalAlign === 'right') {
        lineX = x + maxWidth;
    }
    context.fillText(line, lineX, textY);
}

export default function FeatureGraphicGeneratorPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('My Awesome App');
  const [description, setDescription] = useState('A short, catchy description of the app.');
  const [bgColor1, setBgColor1] = useState('#ffffff');
  const [bgColor2, setBgColor2] = useState('#e0e0e0');
  const [bgType, setBgType] = useState<'solid' | 'gradient'>('solid');
  const [fontColor, setFontColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]);
  const [titleFontSize, setTitleFontSize] = useState(72);
  const [descriptionFontSize, setDescriptionFontSize] = useState(48);
  const [canvasWidth, setCanvasWidth] = useState(1024);
  const [canvasHeight, setCanvasHeight] = useState(500);
  
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 });
  const [titlePosition, setTitlePosition] = useState({ x: 400, y: 200 });
  const [descriptionPosition, setDescriptionPosition] = useState({ x: 400, y: 300 });

  const [titleAlign, setTitleAlign] = useState<'left' | 'center' | 'right'>('left');
  const [descriptionAlign, setDescriptionAlign] = useState<'left' | 'center' | 'right'>('left');

  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: 'Please upload an image.', variant: 'destructive' });
        return;
      }
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const drawCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    await loadFont(fontFamily);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (bgType === 'solid') {
      ctx.fillStyle = bgColor1;
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, bgColor1);
      gradient.addColorStop(1, bgColor2);
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const drawContent = (logoImg: HTMLImageElement | null) => {
        // Clear canvas for redraw
        if (bgType === 'solid') {
          ctx.fillStyle = bgColor1;
        } else {
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, bgColor1);
          gradient.addColorStop(1, bgColor2);
          ctx.fillStyle = gradient;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Logo
        if (logoImg) {
            const logoMaxSize = 200;
            const aspectRatio = logoImg.width / logoImg.height;
            let logoWidth = logoMaxSize;
            let logoHeight = logoMaxSize;

            if (logoImg.width > logoImg.height) {
                logoHeight = logoMaxSize / aspectRatio;
            } else {
                logoWidth = logoMaxSize * aspectRatio;
            }
            ctx.drawImage(logoImg, logoPosition.x, logoPosition.y, logoWidth, logoHeight);
        }

        // Text
        ctx.fillStyle = fontColor;
        
        // Title
        ctx.font = `bold ${titleFontSize}px "${fontFamily.split(',')[0].replace(/"/g, '')}"`;
        ctx.textAlign = titleAlign;
        ctx.textBaseline = 'top';
        const titleMaxWidth = canvas.width - titlePosition.x - 20;
        wrapText(ctx, title, titlePosition.x, titlePosition.y, titleMaxWidth, titleFontSize);

        // Description
        ctx.font = `${descriptionFontSize}px "${fontFamily.split(',')[0].replace(/"/g, '')}"`;
        ctx.textAlign = descriptionAlign;
        ctx.textBaseline = 'top';
        const lineHeight = descriptionFontSize * 1.2;
        const textMaxWidth = canvas.width - descriptionPosition.x - 20;
        wrapText(ctx, description, descriptionPosition.x, descriptionPosition.y, textMaxWidth, lineHeight);
    };

    if (logoUrl) {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => {
        drawContent(img);
      };
      img.onerror = () => {
        drawContent(null);
      }
    } else {
        drawContent(null);
    }
  }, [bgColor1, bgColor2, bgType, title, description, logoUrl, fontColor, fontFamily, titleFontSize, descriptionFontSize, canvasWidth, canvasHeight, logoPosition, titlePosition, descriptionPosition, titleAlign, descriptionAlign]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }
    drawCanvas();
  }, [drawCanvas, canvasWidth, canvasHeight]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
a.href = url;
      a.download = 'feature-graphic.png';
      a.click();
    }
  };

  const handleMove = (element: 'logo' | 'title' | 'description', direction: 'up' | 'down' | 'left' | 'right') => {
      const step = 10;
      const moveFunctions = {
          logo: setLogoPosition,
          title: setTitlePosition,
          description: setDescriptionPosition
      };
      
      const setPosition = moveFunctions[element];

      setPosition(prev => {
          switch(direction) {
              case 'up': return { ...prev, y: prev.y - step };
              case 'down': return { ...prev, y: prev.y + step };
              case 'left': return { ...prev, x: prev.x - step };
              case 'right': return { ...prev, x: prev.x + step };
              default: return prev;
          }
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Play Store Feature Graphic Generator</CardTitle>
        <CardDescription>Create a feature graphic for your app listing with custom styles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="logo-upload">Upload Logo</Label>
                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title-input">Title</Label>
                    <Input id="title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description-input">Description</Label>
                    <Input id="description-input" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Background Type</Label>
                  <RadioGroup value={bgType} onValueChange={(v) => setBgType(v as 'solid' | 'gradient')} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="solid" id="solid"/>
                          <Label htmlFor="solid">Solid</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="gradient" id="gradient"/>
                          <Label htmlFor="gradient">Gradient</Label>
                      </div>
                  </RadioGroup>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bg-color1">
                          {bgType === 'solid' ? 'Background' : 'Color 1'}
                        </Label>
                        <Input id="bg-color1" type="color" value={bgColor1} onChange={(e) => setBgColor1(e.target.value)} className="h-10"/>
                    </div>
                    {bgType === 'gradient' && (
                      <div className="space-y-2">
                          <Label htmlFor="bg-color2">Color 2</Label>
                          <Input id="bg-color2" type="color" value={bgColor2} onChange={(e) => setBgColor2(e.target.value)} className="h-10"/>
                      </div>
                    )}
                     <div className="space-y-2">
                        <Label htmlFor="font-color">Font Color</Label>
                        <Input id="font-color" type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="h-10"/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger id="font-family">
                            <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                            {FONT_FAMILIES.map(font => (
                                <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font.split(',')[0].replace(/"/g, '')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title-font-size">Title Size</Label>
                        <Input id="title-font-size" type="number" value={titleFontSize} onChange={(e) => setTitleFontSize(Number(e.target.value))} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="desc-font-size">Desc Size</Label>
                        <Input id="desc-font-size" type="number" value={descriptionFontSize} onChange={(e) => setDescriptionFontSize(Number(e.target.value))} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="canvas-width">Width (px)</Label>
                        <Input id="canvas-width" type="number" value={canvasWidth} onChange={(e) => setCanvasWidth(Number(e.target.value))} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="canvas-height">Height (px)</Label>
                        <Input id="canvas-height" type="number" value={canvasHeight} onChange={(e) => setCanvasHeight(Number(e.target.value))} />
                    </div>
                </div>
            </div>
            <div className="md:col-span-2 space-y-4">
                <div>
                    <Label>Preview</Label>
                    <div className="rounded-md border p-2 w-full aspect-[1024/500] bg-muted flex items-center justify-center">
                        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain"></canvas>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
                    <div className="space-y-2">
                        <Label className="text-center block">Move Logo</Label>
                        <div className="flex justify-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => handleMove('logo', 'up')}><ArrowUp/></Button>
                            <Button size="icon" variant="outline" onClick={() => handleMove('logo', 'down')}><ArrowDown/></Button>
                            <Button size="icon" variant="outline" onClick={() => handleMove('logo', 'left')}><ArrowLeft/></Button>
                            <Button size="icon" variant="outline" onClick={() => handleMove('logo', 'right')}><ArrowRight/></Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-center block">Title</Label>
                        <div className="flex justify-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => handleMove('title', 'up')}><ArrowUp/></Button>
                            <Button size="icon" variant="outline" onClick={() => handleMove('title', 'down')}><ArrowDown/></Button>
                            <Button size="icon" variant="outline" onClick={() => handleMove('title', 'left')}><ArrowLeft/></Button>
                            <Button size="icon" variant="outline" onClick={() => handleMove('title', 'right')}><ArrowRight/></Button>
                        </div>
                         <div className="flex justify-center gap-2">
                            <Button size="icon" variant={titleAlign === 'left' ? 'secondary' : 'outline'} onClick={() => setTitleAlign('left')}><AlignLeft/></Button>
                            <Button size="icon" variant={titleAlign === 'center' ? 'secondary' : 'outline'} onClick={() => setTitleAlign('center')}><AlignCenter/></Button>
                            <Button size="icon" variant={titleAlign === 'right' ? 'secondary' : 'outline'} onClick={() => setTitleAlign('right')}><AlignRight/></Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-center block">Description</Label>
                        <div className="flex justify-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => handleMove('description', 'up')}><ArrowUp/></Button>
                            <Button size="icon" variant="outline" onClick={() => handleMove('description', 'down')}><ArrowDown/></Button>
                            <Button size="icon" variant="outline" onClick={() => handleMove('description', 'left')}><ArrowLeft/></Button>
                            <Button size="icon" variant="outline" onClick={() => handleMove('description', 'right')}><ArrowRight/></Button>
                        </div>
                        <div className="flex justify-center gap-2">
                            <Button size="icon" variant={descriptionAlign === 'left' ? 'secondary' : 'outline'} onClick={() => setDescriptionAlign('left')}><AlignLeft/></Button>
                            <Button size="icon" variant={descriptionAlign === 'center' ? 'secondary' : 'outline'} onClick={() => setDescriptionAlign('center')}><AlignCenter/></Button>
                            <Button size="icon" variant={descriptionAlign === 'right' ? 'secondary' : 'outline'} onClick={() => setDescriptionAlign('right')}><AlignRight/></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </CardContent>
      <CardFooter>
          <Button onClick={handleDownload} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download Graphic
          </Button>
      </CardFooter>
    </Card>
  );
}
