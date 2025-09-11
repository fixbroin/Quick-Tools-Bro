
'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { Loader2, Download, Upload, Image as ImageIcon, Type, Smile } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(512); // Increased for quality
  const [fontWeight, setFontWeight] = useState<'bold' | 'normal'>('bold');
  const [backgroundShape, setBackgroundShape] = useState<'square' | 'circle' | 'rounded'>('rounded');

  // New state for image shape
  const [imageShape, setImageShape] = useState<ImageShape>('as-is');

  const resetState = () => {
    setSource(null);
    setSourcePreview(null);
    setGeneratedFiles({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetState();
  }
  
  const drawPreview = useCallback(() => {
    const canvasSize = 1024; // Increased canvas size for better quality
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = backgroundColor;
    if (backgroundShape === 'circle') {
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (backgroundShape === 'rounded') {
       const cornerRadius = canvasSize * 0.125; // 128 for 1024
       ctx.beginPath();
       ctx.moveTo(cornerRadius, 0);
       ctx.lineTo(canvasSize - cornerRadius, 0);
       ctx.quadraticCurveTo(canvasSize, 0, canvasSize, cornerRadius);
       ctx.lineTo(canvasSize, canvasSize - cornerRadius);
       ctx.quadraticCurveTo(canvasSize, canvasSize, canvasSize - cornerRadius, canvasSize);
       ctx.lineTo(cornerRadius, canvasSize);
       ctx.quadraticCurveTo(0, canvasSize, 0, canvasSize - cornerRadius);
       ctx.lineTo(0, cornerRadius);
       ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
       ctx.closePath();
       ctx.fill();
    } else {
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const yOffset = fontSize * 0.1;
    ctx.fillText(textInput, canvasSize / 2, canvasSize / 2 + yOffset);

    setSourcePreview(canvas.toDataURL());
    setSource(textInput);
  }, [textInput, fontColor, backgroundColor, fontFamily, fontSize, fontWeight, backgroundShape]);
  
  useEffect(() => {
    if(activeTab === 'text') {
        drawPreview();
    }
  }, [drawPreview, activeTab]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file type", description: "Please upload an image.", variant: "destructive" });
        return;
      }
      setSource(file);
      setSourcePreview(URL.createObjectURL(file));
      setGeneratedFiles({});
    }
  };
  
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  }

  const handleEmojiChange = (emoji: string) => {
    setSource(emoji);
    const canvasSize = 1024; // Use a larger canvas for better quality
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    if(ctx) {
        ctx.font = `${canvasSize * 0.8}px sans-serif`; // e.g., 819px font for 1024px canvas
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, canvasSize / 2, canvasSize / 2);
        setSourcePreview(canvas.toDataURL());
    }
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
      image.crossOrigin = "anonymous";
      image.src = sourcePreview;
      await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = (err) => {
            console.error("Image load error:", err);
            reject("Could not load the source image.");
          };
      });

      const generated: Record<string, string> = {};
      for (const s of SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = s.size;
        canvas.height = s.size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingQuality = "high";
          
          // Apply shape if it's an image and a shape is selected
          if (activeTab === 'image' && imageShape !== 'as-is') {
              ctx.save();
              if (imageShape === 'circle') {
                  ctx.beginPath();
                  ctx.arc(s.size / 2, s.size / 2, s.size / 2, 0, Math.PI * 2, true);
                  ctx.clip();
              } else if (imageShape === 'rounded') {
                  const r = s.size * 0.125;
                  ctx.beginPath();
                  ctx.moveTo(r, 0);
                  ctx.lineTo(s.size - r, 0);
                  ctx.quadraticCurveTo(s.size, 0, s.size, r);
                  ctx.lineTo(s.size, s.size - r);
                  ctx.quadraticCurveTo(s.size, s.size, s.size - r, s.size);
                  ctx.lineTo(r, s.size);
                  ctx.quadraticCurveTo(0, s.size, 0, s.size - r);
                  ctx.lineTo(0, r);
                  ctx.quadraticCurveTo(0, 0, r, 0);
                  ctx.closePath();
                  ctx.clip();
              }
              // For square, the default canvas is already a square.
          }

          ctx.drawImage(image, 0, 0, s.size, s.size);
          
          if (activeTab === 'image' && imageShape !== 'as-is') {
             ctx.restore();
          }

          generated[s.name] = canvas.toDataURL('image/png');
        }
      }
      setGeneratedFiles(generated);
    } catch (error) {
      console.error(error);
      const description = typeof error === 'string' ? error : "Could not generate favicons. Please try again.";
      toast({ title: "Generation Failed", description, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [source, sourcePreview, toast, activeTab, imageShape]);

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
          // ICONDIR
          view.setUint16(0, 0, true); // reserved
          view.setUint16(2, 1, true); // type 1 for ICO
          view.setUint16(4, 1, true); // count
          // ICONDIRENTRY
          view.setUint8(6, size); // width
          view.setUint8(7, size); // height
          view.setUint8(8, 0); // colors, 0 for >256
          view.setUint8(9, 0); // reserved
          view.setUint16(10, 1, true); // planes
          view.setUint16(12, 32, true); // bpp
          view.setUint32(14, 40 + size * size * 4, true); // data size
          view.setUint32(18, 22, true); // data offset

          // BITMAPINFOHEADER
          view.setUint32(22, 40, true); // header size
          view.setUint32(26, size, true); // width
          view.setUint32(30, size * 2, true); // height (icon is top-down)
          view.setUint16(34, 1, true); // planes
          view.setUint16(36, 32, true); // bpp
          view.setUint32(38, 0, true); // compression
          view.setUint32(42, size * size * 4, true); // image size
          view.setUint32(46, 0, true); // x pixels per meter
          view.setUint32(50, 0, true); // y pixels per meter
          view.setUint32(54, 0, true); // colors used
          view.setUint32(58, 0, true); // colors important

          const icoData = new Uint8Array(buffer, 62);
          let offset = 0;
          for (let y = size - 1; y >= 0; y--) {
              for (let x = 0; x < size; x++) {
                  const i = (y * size + x) * 4;
                  icoData[offset++] = imageData[i + 2]; // B
                  icoData[offset++] = imageData[i + 1]; // G
                  icoData[offset++] = imageData[i + 0]; // R
                  icoData[offset++] = imageData[i + 3]; // A
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
            <div className="space-y-2">
                <Label htmlFor="image-shape">Image Shape Type</Label>
                <Select value={imageShape} onValueChange={(v) => setImageShape(v as ImageShape)}>
                    <SelectTrigger id="image-shape"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="as-is">As Is</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="circle">Circle</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                    </SelectContent>
                </Select>
            </div>
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
                        <SelectContent>
                            {FONT_FAMILIES.map(font => (
                                <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Input id="font-size" type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
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
                <div className="space-y-2">
                    <Label htmlFor="font-color">Font Color</Label>
                    <Input id="font-color" type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="h-10"/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="bg-color">Background</Label>
                    <Input id="bg-color" type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-10"/>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Background Shape</Label>
                <RadioGroup value={backgroundShape} onValueChange={(v) => setBackgroundShape(v as any)} className="flex gap-4">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="square" id="square"/><Label htmlFor="square">Square</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="circle" id="circle"/><Label htmlFor="circle">Circle</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="rounded" id="rounded"/><Label htmlFor="rounded">Rounded</Label></div>
                </RadioGroup>
            </div>
          </div>
        );
      case 'emoji':
        return (
            <div className="space-y-4">
            <Label htmlFor="emoji-input">Enter Emoji</Label>
             <div className="flex items-center gap-4 rounded-lg border p-4">
                <Smile className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                    <Input id="emoji-input" placeholder="e.g., 🚀" onChange={(e) => handleEmojiChange(e.target.value)} maxLength={2} />
                     <p className="text-xs text-muted-foreground mt-1">Enter a single emoji.</p>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Generate Favicons
                    </Button>
                )}
            </div>
            <div className="space-y-4">
                 {sourcePreview && (
                    <div className="space-y-2">
                        <Label>Preview (256x256)</Label>
                        <div className="rounded-lg border p-4 flex justify-center items-center bg-muted">
                             <Image
                                src={sourcePreview}
                                alt="Source preview"
                                width={128}
                                height={128}
                                className="rounded-md object-contain"
                                />
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
             <Button onClick={downloadZip}>
                <Download className="mr-2 h-4 w-4" />
                Download All (.zip)
            </Button>
          )}
      </CardFooter>
    </Card>
  );
}
