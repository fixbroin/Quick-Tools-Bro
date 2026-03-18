
'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { Loader2, Download, Upload, Image as ImageIcon, Type, Smile, Zap, Square, Circle, Smartphone } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { scrollToDownload } from '@/lib/utils';

const SIZES = [
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon.ico', size: 48 }, // Special case, will be handled
];

const FONT_FAMILIES = [
  'Arial', 'Verdana', 'Georgia', 'monospace', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro', 'Raleway', 'PT Sans', 'Merriweather', 'Poppins', 'Ubuntu', 'Playfair Display', 'Lora', 'Nunito', 'Fira Sans', 'Quicksand', 'Work Sans', 'Dosis', 'Inter', 'Space Grotesk'
];

type ImageShape = 'as-is' | 'square' | 'circle' | 'rounded';

export default function FaviconGeneratorPage() {
  const [activeTab, setActiveTab] = useState('image');
  const [source, setSource] = useState<File | string | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New state for text customization
  const [textInput, setTextInput] = useState("FB");
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(512); // Increased for quality
  const [fontWeight, setFontWeight] = useState<'bold' | 'normal'>('bold');

  // New state for image shape and scaling
  const [imageShape, setImageShape] = useState<ImageShape>('as-is');
  const [imageScale, setImageScale] = useState(100);
  const [emojiScale, setEmojiScale] = useState(80);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundShape, setBackgroundShape] = useState<'square' | 'circle' | 'rounded'>('square');
  const [useBackground, setUseBackground] = useState(false);

  const resetState = () => {
    setSource(null);
    setSourcePreview(null);
    setGeneratedFiles({});
    setImageScale(100);
    setEmojiScale(80);
    setUseBackground(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetState();
  }
  
  const drawPreview = useCallback(async () => {
    const canvasSize = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Helper to draw background
    const drawBackground = () => {
        if (!useBackground) return;
        ctx.fillStyle = backgroundColor;
        if (backgroundShape === 'circle') {
          ctx.beginPath(); ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2); ctx.fill();
        } else if (backgroundShape === 'rounded') {
           const cornerRadius = canvasSize * 0.125;
           ctx.beginPath();
           ctx.moveTo(cornerRadius, 0); ctx.lineTo(canvasSize - cornerRadius, 0);
           ctx.quadraticCurveTo(canvasSize, 0, canvasSize, cornerRadius);
           ctx.lineTo(canvasSize, canvasSize - cornerRadius);
           ctx.quadraticCurveTo(canvasSize, canvasSize, canvasSize - cornerRadius, canvasSize);
           ctx.lineTo(cornerRadius, canvasSize); ctx.quadraticCurveTo(0, canvasSize, 0, canvasSize - cornerRadius);
           ctx.lineTo(0, cornerRadius); ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
           ctx.closePath(); ctx.fill();
        } else {
          ctx.fillRect(0, 0, canvasSize, canvasSize);
        }
    };

    // Helper to clip content to shape
    const applyClipping = () => {
        if (!useBackground && backgroundShape === 'square') return; 
        if (backgroundShape === 'circle') {
            ctx.beginPath(); ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2, true); ctx.clip();
        } else if (backgroundShape === 'rounded') {
            const r = canvasSize * 0.125;
            ctx.beginPath(); ctx.moveTo(r, 0); ctx.lineTo(canvasSize - r, 0);
            ctx.quadraticCurveTo(canvasSize, 0, canvasSize, r); ctx.lineTo(canvasSize, canvasSize - r);
            ctx.quadraticCurveTo(canvasSize, canvasSize, canvasSize - r, canvasSize);
            ctx.lineTo(r, canvasSize); ctx.quadraticCurveTo(0, canvasSize, 0, canvasSize - r);
            ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0); ctx.closePath(); ctx.clip();
        }
    };

    drawBackground();

    if (activeTab === 'text') {
        if (!useBackground) {
            ctx.save();
            applyClipping();
        }
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const yOffset = fontSize * 0.1;
        ctx.fillText(textInput, canvasSize / 2, canvasSize / 2 + yOffset);
        if (!useBackground) ctx.restore();
        setSourcePreview(canvas.toDataURL());
    } 
    else if (activeTab === 'emoji' && typeof source === 'string' && source.length > 0) {
        ctx.save();
        applyClipping();
        ctx.font = `${canvasSize * (emojiScale / 100)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(source, canvasSize / 2, canvasSize / 2);
        ctx.restore();
        setSourcePreview(canvas.toDataURL());
    }
    else if (activeTab === 'image' && source instanceof File) {
        const img = new window.Image();
        img.src = URL.createObjectURL(source);
        await new Promise(resolve => img.onload = resolve);
        
        ctx.imageSmoothingQuality = "high";
        ctx.save();
        applyClipping();

        const scaledSize = canvasSize * (imageScale / 100);
        const offset = (canvasSize - scaledSize) / 2;
        ctx.drawImage(img, offset, offset, scaledSize, scaledSize);
        
        ctx.restore();
        setSourcePreview(canvas.toDataURL());
        URL.revokeObjectURL(img.src);
    }
  }, [activeTab, source, textInput, fontColor, backgroundColor, fontFamily, fontSize, fontWeight, backgroundShape, useBackground, emojiScale, imageScale, imageShape]);
  
  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file type", description: "Please upload an image.", variant: "destructive" });
        return;
      }
      setSource(file);
      setGeneratedFiles({});
    }
  };
  
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
    setSource(e.target.value);
  }

  const handleEmojiChange = (emoji: string) => {
    setSource(emoji);
    setGeneratedFiles({});
  }

  const generateFavicons = useCallback(async () => {
    if (!source || !sourcePreview) {
      toast({ title: 'No source selected', description: 'Please provide an image, text, or emoji.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setGeneratedFiles({});

    try {
      const image = new window.Image();
      image.src = sourcePreview;
      await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
      });

      const generated: Record<string, string> = {};
      for (const s of SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = s.size;
        canvas.height = s.size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(image, 0, 0, s.size, s.size);
          generated[s.name] = canvas.toDataURL('image/png');
        }
      }
      setGeneratedFiles(generated);
      scrollToDownload();
    } catch (error) {
      console.error(error);
      toast({ title: "Generation Failed", description: "Could not generate favicons.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [source, sourcePreview, toast]);

  const downloadZip = async () => {
    const zip = new JSZip();

    for (const fileName in generatedFiles) {
      const dataUrl = generatedFiles[fileName];
      
      if (fileName.endsWith('.ico')) {
          const image = new window.Image();
          image.src = dataUrl;
          await new Promise(resolve => image.onload = resolve);
          
          const canvas = document.createElement('canvas');
          const size = 48; // ICO size
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          ctx.drawImage(image, 0, 0, size, size);
          const imageData = ctx.getImageData(0, 0, size, size).data;

          const buffer = new ArrayBuffer(22 + size * size * 4);
          const view = new DataView(buffer);
          view.setUint16(0, 0, true); 
          view.setUint16(2, 1, true); 
          view.setUint16(4, 1, true); 
          view.setUint8(6, size); 
          view.setUint8(7, size); 
          view.setUint8(8, 0); 
          view.setUint8(9, 0); 
          view.setUint16(10, 1, true); 
          view.setUint16(12, 32, true); 
          view.setUint32(14, 40 + size * size * 4, true); 
          view.setUint32(18, 22, true); 

          view.setUint32(22, 40, true); 
          view.setUint32(26, size, true); 
          view.setUint32(30, size * 2, true); 
          view.setUint16(34, 1, true); 
          view.setUint16(36, 32, true); 
          view.setUint32(38, 0, true); 
          view.setUint32(42, size * size * 4, true); 
          view.setUint32(46, 0, true); 
          view.setUint32(50, 0, true); 
          view.setUint32(54, 0, true); 
          view.setUint32(58, 0, true); 

          const icoData = new Uint8Array(buffer, 62);
          let offset = 0;
          for (let y = size - 1; y >= 0; y--) {
              for (let x = 0; x < size; x++) {
                  const i = (y * size + x) * 4;
                  icoData[offset++] = imageData[i + 2]; 
                  icoData[offset++] = imageData[i + 1]; 
                  icoData[offset++] = imageData[i + 0]; 
                  icoData[offset++] = imageData[i + 3]; 
              }
          }
          const finalIcoBuffer = new Uint8Array(buffer);
          const header = new Uint8Array(buffer, 0, 62);
          finalIcoBuffer.set(header, 0);
          finalIcoBuffer.set(icoData, 62);
          
          zip.file(fileName, finalIcoBuffer);

      } else {
        const blob = await (await fetch(dataUrl)).blob();
        zip.file(fileName, blob);
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'favicons.zip');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'image':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}/>
                <p className="text-xs text-muted-foreground mt-1">Upload a PNG, JPG, or other image file.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="flex justify-between">Logo Scale (Zoom) <span>{imageScale}%</span></Label>
                    <Slider value={[imageScale]} onValueChange={([v]: number[]) => setImageScale(v)} min={10} max={200} step={1} className="py-4" />
                </div>
                <div className="space-y-2 flex items-center gap-3 pt-4">
                    <Switch id="use-bg-image" checked={useBackground} onCheckedChange={setUseBackground} />
                    <Label htmlFor="use-bg-image" className="cursor-pointer font-bold text-primary">Use Background Color</Label>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Icon Shape (Auto-Crop)</Label>
                <div className="flex gap-2">
                    <Button 
                        variant={backgroundShape === 'square' ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={() => setBackgroundShape('square')}
                    >
                        <Square className="h-4 w-4" /> Square
                    </Button>
                    <Button 
                        variant={backgroundShape === 'circle' ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={() => setBackgroundShape('circle')}
                    >
                        <Circle className="h-4 w-4" /> Circle
                    </Button>
                    <Button 
                        variant={backgroundShape === 'rounded' ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={() => setBackgroundShape('rounded')}
                    >
                        <Smartphone className="h-4 w-4" /> Rounded
                    </Button>
                </div>
            </div>

            {useBackground && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    <Label>Background Color</Label>
                    <Input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-10 w-full" />
                </div>
            )}
          </div>
        );
      case 'text':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="text-input">Text</Label>
                    <Input id="text-input" value={textInput} onChange={handleTextInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger id="font-family"><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {FONT_FAMILIES.map(font => (
                                <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size <span>({fontSize}px)</span></Label>
                    <Slider value={[fontSize]} onValueChange={([v]: number[]) => setFontSize(v)} min={50} max={800} step={1} className="py-4" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="font-weight">Font Weight</Label>
                    <Select value={fontWeight} onValueChange={(v) => setFontWeight(v as 'normal' | 'bold')}>
                        <SelectTrigger id="font-weight"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-1">
                        <Switch id="use-bg-text" checked={useBackground} onCheckedChange={setUseBackground} />
                        <Label htmlFor="use-bg-text" className="font-bold text-primary">Enable Background</Label>
                    </div>
                    <Label className="text-[10px] text-muted-foreground">Transparent if disabled</Label>
                </div>
                <div className="space-y-2">
                    <Label>Text Color</Label>
                    <Input id="font-color" type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="h-10"/>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Icon Shape (Auto-Crop)</Label>
                <div className="flex gap-2">
                    <Button 
                        variant={backgroundShape === 'square' ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={() => setBackgroundShape('square')}
                    >
                        <Square className="h-4 w-4" /> Square
                    </Button>
                    <Button 
                        variant={backgroundShape === 'circle' ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={() => setBackgroundShape('circle')}
                    >
                        <Circle className="h-4 w-4" /> Circle
                    </Button>
                    <Button 
                        variant={backgroundShape === 'rounded' ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={() => setBackgroundShape('rounded')}
                    >
                        <Smartphone className="h-4 w-4" /> Rounded
                    </Button>
                </div>
            </div>

            {useBackground && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <Input id="bg-color" type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-10 w-full"/>
                </div>
            )}
          </div>
        );
      case 'emoji':
        return (
            <div className="space-y-4">
             <div className="flex items-center gap-4 rounded-lg border p-4">
                <Smile className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                    <Label htmlFor="emoji-input">Enter Emoji</Label>
                    <Input id="emoji-input" placeholder="e.g., 🚀" onChange={(e) => handleEmojiChange(e.target.value)} maxLength={2} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="flex justify-between">Emoji Scale (Zoom) <span>{emojiScale}%</span></Label>
                    <Slider value={[emojiScale]} onValueChange={([v]: number[]) => setEmojiScale(v)} min={10} max={200} step={1} className="py-4" />
                </div>
                <div className="space-y-2 flex items-center gap-3 pt-4">
                    <Switch id="use-bg-emoji" checked={useBackground} onCheckedChange={setUseBackground} />
                    <Label htmlFor="use-bg-emoji" className="cursor-pointer font-bold text-primary">Use Background Color</Label>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Icon Shape (Auto-Crop)</Label>
                <div className="flex gap-2">
                    <Button 
                        variant={backgroundShape === 'square' ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={() => setBackgroundShape('square')}
                    >
                        <Square className="h-4 w-4" /> Square
                    </Button>
                    <Button 
                        variant={backgroundShape === 'circle' ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={() => setBackgroundShape('circle')}
                    >
                        <Circle className="h-4 w-4" /> Circle
                    </Button>
                    <Button 
                        variant={backgroundShape === 'rounded' ? 'default' : 'outline'} 
                        size="sm" 
                        className="flex-1 gap-2" 
                        onClick={() => setBackgroundShape('rounded')}
                    >
                        <Smartphone className="h-4 w-4" /> Rounded
                    </Button>
                </div>
            </div>

            {useBackground && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    <Label>Background Color</Label>
                    <Input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-10 w-full" />
                </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Favicon Converter</CardTitle>
        <CardDescription>
          Create a full set of favicons from an image, text, or emoji.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="image"><ImageIcon className="mr-2 h-4 w-4" />Image</TabsTrigger>
                    <TabsTrigger value="text"><Type className="mr-2 h-4 w-4" />Text</TabsTrigger>
                    <TabsTrigger value="emoji"><Smile className="mr-2 h-4 w-4" />Emoji</TabsTrigger>
                  </TabsList>
                  <div className="pt-6">
                    {renderTabContent()}
                  </div>
                </Tabs>
                
                {sourcePreview && (
                    <Button onClick={generateFavicons} disabled={isLoading || !source}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                        Generate Favicons
                    </Button>
                )}
            </div>
            <div className="space-y-4">
                {sourcePreview && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="font-bold text-primary">Master Preview (512x512)</Label>
                                <span className="text-[10px] font-mono bg-muted px-2 py-1 rounded">Adaptive Scaling</span>
                            </div>
                            <div className="rounded-xl border-4 border-muted p-8 flex justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-muted shadow-inner relative overflow-hidden group">
                                <div className="relative z-10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                     <Image
                                        src={sourcePreview}
                                        alt="Master preview"
                                        width={256}
                                        height={256}
                                        className="rounded-none object-contain"
                                        />
                                </div>
                                <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/20 flex justify-center items-center">
                                    <div className="w-[184px] h-[184px] border border-dashed border-primary/40 rounded-full flex justify-center items-center">
                                        <span className="text-[8px] text-primary/40 absolute -top-4 font-bold uppercase tracking-widest">Safe Zone</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Platform Context Previews</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
                                    <p className="text-[10px] font-bold text-center uppercase">iOS / Android (192px)</p>
                                    <div className="flex justify-center gap-4">
                                        <div className="space-y-1 flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border">
                                                <img src={sourcePreview} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-[8px]">Squircle</span>
                                        </div>
                                        <div className="space-y-1 flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border">
                                                <img src={sourcePreview} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-[8px]">Circle</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
                                    <p className="text-[10px] font-bold text-center uppercase">Web / Tab (32px)</p>
                                    <div className="flex justify-center items-end gap-6 h-16">
                                        <div className="flex flex-col items-center gap-1">
                                            <img src={sourcePreview} className="w-8 h-8 object-contain shadow-sm" />
                                            <span className="text-[8px]">32x32</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <img src={sourcePreview} className="w-4 h-4 object-contain shadow-sm" />
                                            <span className="text-[8px]">16x16</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {Object.keys(generatedFiles).length > 0 && !isLoading && (
                     <div className="space-y-4">
                        <Label>Generated Favicons</Label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 rounded-lg border p-4">
                            {SIZES.map(({name, size}) => (
                                <div key={name} className="flex flex-col items-center gap-2">
                                    <Image
                                    src={generatedFiles[name]}
                                    alt={`${name} preview`}
                                    width={64}
                                    height={64}
                                    className="rounded-md bg-muted object-contain"
                                    />
                                    <p className="text-xs text-muted-foreground text-center">{name}<br/>({size}x{size})</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </CardContent>
      <CardFooter>
          {Object.keys(generatedFiles).length > 0 && !isLoading && (
             <Button id="download-section" onClick={downloadZip} variant="default" size="lg" className="bg-green-600 hover:bg-green-700 shadow-xl">
                <Download className="mr-2 h-5 w-5" />
                Download All Favicons (.zip)
            </Button>
          )}
      </CardFooter>
    </Card>

    <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Favicon Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">All-in-One Solution:</strong> A favicon is more than just a small icon in a browser tab. Modern websites need a variety of sizes for different platforms, including Apple Touch Icons for iOS and Chrome manifest icons for Android. Our generator creates the complete set in one click.
                    </p>
                    <p>
                        Whether you're starting with a professional logo, a simple piece of text, or a fun emoji, our tool ensures your site looks polished and professional across all devices and bookmarks.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Versatile Creation Modes:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li><strong>Image to Favicon:</strong> Convert any PNG or JPG.</li>
                        <li><strong>Text to Favicon:</strong> Create clean, minimalist initials.</li>
                        <li><strong>Emoji to Favicon:</strong> Use any standard emoji as your icon.</li>
                        <li><strong>Multiple Shapes:</strong> Square, Circle, or Rounded corners.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">What sizes are included in the ZIP?</h4>
                    <p className="text-muted-foreground text-sm">We include all standard sizes: 16x16, 32x32, 48x48 (ICO), 180x180 (Apple Touch), and 192x192/512x512 (Android Chrome).</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the .ico format included?</h4>
                    <p className="text-muted-foreground text-sm">Yes! We automatically generate a high-quality favicon.ico file that is compatible with older browsers and standard web practices.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Are my images uploaded to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. All image processing happens directly in your browser. Your source images and generated icons are never sent to our servers.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">How do I install these on my site?</h4>
                    <p className="text-muted-foreground text-sm">Simply upload the generated files to your website's root directory and add the provided HTML link tags to your head section.</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
