
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Upload, Crop as CropIcon } from 'lucide-react';
import Image from 'next/image';
import { scrollToDownload } from '@/lib/utils';

interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageCropperPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [aspectRatioMode, setAspectRatioMode] = useState<string>('free');
  const [targetWidth, setTargetWidth] = useState<string>('1280');
  const [targetHeight, setTargetHeight] = useState<string>('720');
  const [interactionType, setInteractionType] = useState<'create' | 'move' | 'resize-nw' | 'resize-ne' | 'resize-se' | 'resize-sw' | null>(null);
  const dragStartOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const startPoint = useRef<{ x: number, y: number } | null>(null);

  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file type", description: "Please upload an image.", variant: "destructive" });
        return;
      }
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);

      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        imageRef.current = img;
        setCrop(null);
        setCroppedUrl(null);
        setTargetWidth(String(img.width));
        setTargetHeight(String(img.height));
        drawCanvas();
      };
    }
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fit image to canvas viewport bounds (max height 500px for desktop clean view)
    const maxWidth = canvas.parentElement?.clientWidth || 500;
    const maxHeight = Math.min(500, typeof window !== 'undefined' ? window.innerHeight * 0.6 : 500);
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (crop && crop.width > 0 && crop.height > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.beginPath();
      ctx.rect(crop.x, crop.y, crop.width, crop.height);
      ctx.clip();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
      ctx.setLineDash([]);

      // Draw circular resize handles
      const drawHandle = (hx: number, hy: number) => {
        ctx.beginPath();
        ctx.arc(hx, hy, 7, 0, 2 * Math.PI);
        ctx.fillStyle = '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      drawHandle(crop.x, crop.y); // NW
      drawHandle(crop.x + crop.width, crop.y); // NE
      drawHandle(crop.x + crop.width, crop.y + crop.height); // SE
      drawHandle(crop.x, crop.y + crop.height); // SW
    }
  }, [crop, aspectRatioMode, targetWidth, targetHeight]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, crop]);
  
  useEffect(() => {
      const handleResize = () => drawCanvas();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, [drawCanvas]);


  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };
  
  const handleInteractionStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsCropping(true);
    const coords = getCanvasCoordinates(e);
    startPoint.current = coords;

    if (crop) {
      const tolerance = 20; // touch-friendly size
      
      const distNW = Math.hypot(coords.x - crop.x, coords.y - crop.y);
      const distNE = Math.hypot(coords.x - (crop.x + crop.width), coords.y - crop.y);
      const distSE = Math.hypot(coords.x - (crop.x + crop.width), coords.y - (crop.y + crop.height));
      const distSW = Math.hypot(coords.x - crop.x, coords.y - (crop.y + crop.height));

      if (distNW < tolerance) {
        setInteractionType('resize-nw');
      } else if (distNE < tolerance) {
        setInteractionType('resize-ne');
      } else if (distSE < tolerance) {
        setInteractionType('resize-se');
      } else if (distSW < tolerance) {
        setInteractionType('resize-sw');
      } else if (
        coords.x >= crop.x && 
        coords.x <= crop.x + crop.width && 
        coords.y >= crop.y && 
        coords.y <= crop.y + crop.height
      ) {
        setInteractionType('move');
        dragStartOffset.current = {
          x: coords.x - crop.x,
          y: coords.y - crop.y
        };
      } else {
        setInteractionType('create');
        setCrop({ x: coords.x, y: coords.y, width: 0, height: 0 });
      }
    } else {
      setInteractionType('create');
      setCrop({ x: coords.x, y: coords.y, width: 0, height: 0 });
    }
  };

  const handleMouseMoveHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isCropping || !crop || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const coords = getCanvasCoordinates(e);
    const tolerance = 20;

    const distNW = Math.hypot(coords.x - crop.x, coords.y - crop.y);
    const distNE = Math.hypot(coords.x - (crop.x + crop.width), coords.y - crop.y);
    const distSE = Math.hypot(coords.x - (crop.x + crop.width), coords.y - (crop.y + crop.height));
    const distSW = Math.hypot(coords.x - crop.x, coords.y - (crop.y + crop.height));

    if (distNW < tolerance || distSE < tolerance) {
      canvas.style.cursor = 'nwse-resize';
    } else if (distNE < tolerance || distSW < tolerance) {
      canvas.style.cursor = 'nesw-resize';
    } else if (
      coords.x >= crop.x && 
      coords.x <= crop.x + crop.width && 
      coords.y >= crop.y && 
      coords.y <= crop.y + crop.height
    ) {
      canvas.style.cursor = 'move';
    } else {
      canvas.style.cursor = 'crosshair';
    }
  };

  const handleInteractionMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isCropping || !startPoint.current || !canvasRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const coords = getCanvasCoordinates(e);
    
    const clampX = Math.max(0, Math.min(canvas.width, coords.x));
    const clampY = Math.max(0, Math.min(canvas.height, coords.y));

    if (interactionType === 'move' && crop) {
      let newX = clampX - dragStartOffset.current.x;
      let newY = clampY - dragStartOffset.current.y;
      
      newX = Math.max(0, Math.min(canvas.width - crop.width, newX));
      newY = Math.max(0, Math.min(canvas.height - crop.height, newY));
      
      setCrop({
        ...crop,
        x: newX,
        y: newY
      });
      return;
    }
    
    let R = 1;
    let hasRatioLock = false;
    
    if (aspectRatioMode === '1:1') {
      R = 1;
      hasRatioLock = true;
    } else if (aspectRatioMode === '16:9') {
      R = 16 / 9;
      hasRatioLock = true;
    } else if (aspectRatioMode === '4:3') {
      R = 4 / 3;
      hasRatioLock = true;
    } else if (aspectRatioMode === '9:16') {
      R = 9 / 16;
      hasRatioLock = true;
    } else if (aspectRatioMode === 'custom') {
      const tw = parseInt(targetWidth, 10);
      const th = parseInt(targetHeight, 10);
      if (!isNaN(tw) && !isNaN(th) && tw > 0 && th > 0) {
        R = tw / th;
        hasRatioLock = true;
      }
    }

    if (crop && interactionType && interactionType.startsWith('resize-')) {
      if (interactionType === 'resize-nw') {
        const X2 = crop.x + crop.width;
        const Y2 = crop.y + crop.height;
        let W = X2 - clampX;
        let H = Y2 - clampY;
        
        if (hasRatioLock) {
          H = W / R;
          if (Y2 - H < 0) {
            H = Y2;
            W = H * R;
          }
        }
        if (W >= 20 && H >= 20) {
          setCrop({ x: X2 - W, y: Y2 - H, width: W, height: H });
        }
      } else if (interactionType === 'resize-ne') {
        const X1 = crop.x;
        const Y2 = crop.y + crop.height;
        let W = clampX - X1;
        let H = Y2 - clampY;
        
        if (hasRatioLock) {
          H = W / R;
          if (Y2 - H < 0) {
            H = Y2;
            W = H * R;
          }
        }
        if (W >= 20 && H >= 20) {
          setCrop({ x: X1, y: Y2 - H, width: W, height: H });
        }
      } else if (interactionType === 'resize-se') {
        const X1 = crop.x;
        const Y1 = crop.y;
        let W = clampX - X1;
        let H = clampY - Y1;
        
        if (hasRatioLock) {
          H = W / R;
          if (Y1 + H > canvas.height) {
            H = canvas.height - Y1;
            W = H * R;
          }
        }
        if (W >= 20 && H >= 20) {
          setCrop({ x: X1, y: Y1, width: W, height: H });
        }
      } else if (interactionType === 'resize-sw') {
        const X2 = crop.x + crop.width;
        const Y1 = crop.y;
        let W = X2 - clampX;
        let H = clampY - Y1;
        
        if (hasRatioLock) {
          H = W / R;
          if (Y1 + H > canvas.height) {
            H = canvas.height - Y1;
            W = H * R;
          }
        }
        if (W >= 20 && H >= 20) {
          setCrop({ x: X2 - W, y: Y1, width: W, height: H });
        }
      }
      return;
    }

    if (interactionType === 'create') {
      let dragW = clampX - startPoint.current.x;
      let dragH = clampY - startPoint.current.y;
      
      if (hasRatioLock) {
        const signX = Math.sign(dragW) || 1;
        const signY = Math.sign(dragH) || 1;
        const absW = Math.abs(dragW);
        const absH = absW / R;
        
        const targetY = startPoint.current.y + signY * absH;
        if (targetY < 0 || targetY > canvas.height) {
          const maxAvailableH = signY > 0 ? (canvas.height - startPoint.current.y) : startPoint.current.y;
          const clampedH = maxAvailableH;
          const clampedW = clampedH * R;
          
          dragW = signX * clampedW;
          dragH = signY * clampedH;
        } else {
          dragW = signX * absW;
          dragH = signY * absH;
        }
      }
      
      let newX = startPoint.current.x;
      let newY = startPoint.current.y;
      let newWidth = dragW;
      let newHeight = dragH;
      
      if (dragW < 0) {
        newX = startPoint.current.x + dragW;
        newWidth = -dragW;
      }
      if (dragH < 0) {
        newY = startPoint.current.y + dragH;
        newHeight = -dragH;
      }
      
      setCrop({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }
  };
  
  const handleInteractionEnd = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsCropping(false);
    setInteractionType(null);
    startPoint.current = null;
    if (crop && (crop.width < 5 || crop.height < 5)) {
        setCrop(null);
    }
  };

  const handleCrop = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !crop || !canvas) {
      toast({ title: "No crop area selected", description: "Please select an area on the image to crop.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);

    const scale = img.width / canvas.width;
    
    const cropX = crop.x * scale;
    const cropY = crop.y * scale;
    const cropWidth = crop.width * scale;
    const cropHeight = crop.height * scale;

    let outputWidth = cropWidth;
    let outputHeight = cropHeight;

    if (aspectRatioMode === 'custom') {
      const tw = parseInt(targetWidth, 10);
      const th = parseInt(targetHeight, 10);
      if (!isNaN(tw) && !isNaN(th) && tw > 0 && th > 0) {
        outputWidth = tw;
        outputHeight = th;
      }
    }

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = outputWidth;
    cropCanvas.height = outputHeight;
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) {
        setIsLoading(false);
        return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight);
    
    setCroppedUrl(cropCanvas.toDataURL(originalFile?.type));
    setIsLoading(false);
    toast({title: "Image Cropped", description: "You can now download the result."});
    scrollToDownload();
  };

  const handleDownload = () => {
    if (croppedUrl && originalFile) {
        const a = document.createElement('a');
        a.href = croppedUrl;
        a.download = `cropped-${originalFile.name}`;
        a.click();
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Image Cropper</CardTitle>
        <CardDescription>Upload an image and drag to select the area you want to crop.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload Image</Label>
           <div className="flex items-center gap-4 rounded-lg border p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
        </div>

        {originalUrl && (
          <div className="space-y-4 p-4.5 rounded-2xl bg-slate-500/5 border border-border/50">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Aspect Ratio Mode</Label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { id: 'free', label: 'Free Crop' },
                  { id: '1:1', label: '1:1 Square' },
                  { id: '16:9', label: '16:9' },
                  { id: '4:3', label: '4:3' },
                  { id: '9:16', label: '9:16' },
                  { id: 'custom', label: 'Custom Size' },
                ].map((mode) => (
                  <Button
                    key={mode.id}
                    type="button"
                    variant={aspectRatioMode === mode.id ? 'default' : 'outline'}
                    onClick={() => {
                      setAspectRatioMode(mode.id);
                      setCrop(null);
                    }}
                    className="rounded-xl text-xs py-2 h-auto"
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>
            </div>

            {aspectRatioMode === 'custom' && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                <div className="space-y-2">
                  <Label htmlFor="targetWidth">Target Width (px)</Label>
                  <Input
                    id="targetWidth"
                    type="number"
                    value={targetWidth}
                    onChange={(e) => {
                      setTargetWidth(e.target.value);
                      setCrop(null);
                    }}
                    placeholder="e.g. 1280"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetHeight">Target Height (px)</Label>
                  <Input
                    id="targetHeight"
                    type="number"
                    value={targetHeight}
                    onChange={(e) => {
                      setTargetHeight(e.target.value);
                      setCrop(null);
                    }}
                    placeholder="e.g. 720"
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {originalUrl && (
          <div className="space-y-4">
            <Label>Click and drag on the image to select a crop area.</Label>
            <div className="border rounded-xl cursor-default touch-none bg-slate-950 flex items-center justify-center p-1.5 overflow-hidden">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleInteractionStart}
                    onMouseMove={(e) => {
                      if (isCropping) {
                        handleInteractionMove(e);
                      } else {
                        handleMouseMoveHover(e);
                      }
                    }}
                    onMouseUp={handleInteractionEnd}
                    onMouseLeave={handleInteractionEnd}
                    onTouchStart={handleInteractionStart}
                    onTouchMove={handleInteractionMove}
                    onTouchEnd={handleInteractionEnd}
                    onTouchCancel={handleInteractionEnd}
                />
            </div>
            <Button onClick={handleCrop} disabled={!crop || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CropIcon className="mr-2 h-4 w-4" />}
              Crop Image
            </Button>
          </div>
        )}

        {croppedUrl && !isLoading && (
          <div className="space-y-2">
            <Label>Cropped Result</Label>
            <div className="rounded-md border p-2">
              <Image src={croppedUrl} alt="Cropped" width={400} height={400} className="w-auto h-auto max-w-full rounded-md object-contain" />
            </div>
          </div>
        )}
      </CardContent>
        {croppedUrl && !isLoading && (
        <CardFooter id="download-section">
          <Button onClick={handleDownload}>

              <Download className="mr-2 h-4 w-4" />
              Download Cropped Image
          </Button>
        </CardFooter>
      )}
    </Card>

    <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Image Cropper?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div>
                    <h3 className="text-xl font-bold mb-3">100% Privacy</h3>
                    <p>Your photos never leave your device. All cropping operations are performed entirely within your web browser, ensuring your private data remains yours alone.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Instant Performance</h3>
                    <p>No waiting for uploads or server processing. Our browser-based tool uses your computer's local power to crop images instantly, regardless of your internet speed.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Simple & Intuitive</h3>
                    <p>Just click and drag to select exactly what you want to keep. No complicated menus or professional software knowledge required—anyone can crop like a pro.</p>
                </div>
            </div>
        </div>
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Does cropping reduce image quality?</h4>
                    <p className="text-muted-foreground text-sm">Cropping simply removes the outer parts of an image. The pixels within your selected area remain exactly as they were, maintaining their original clarity.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Which image formats are supported?</h4>
                    <p className="text-muted-foreground text-sm">We support all standard web formats, including JPEG, PNG, WebP, and GIF. The output will match the format of your original file.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Can I crop on my mobile phone?</h4>
                    <p className="text-muted-foreground text-sm">Yes! Our tool is fully responsive and supports touch gestures, allowing you to easily crop photos on your smartphone or tablet.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Is there a file size limit?</h4>
                    <p className="text-muted-foreground text-sm">Since the tool runs locally in your browser, it can handle most high-resolution photos. The only limit is your device's available memory.</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
