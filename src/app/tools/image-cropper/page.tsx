
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Upload, Crop as CropIcon } from 'lucide-react';
import Image from 'next/image';

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
    
    // Fit image to canvas
    const canvasWidth = canvas.parentElement?.clientWidth || 500;
    const scale = canvasWidth / img.width;
    canvas.width = canvasWidth;
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
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
    }
  }, [crop]);

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
    setCrop({ x: coords.x, y: coords.y, width: 0, height: 0 });
  };

  const handleInteractionMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isCropping || !startPoint.current) return;
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    
    const width = coords.x - startPoint.current.x;
    const height = coords.y - startPoint.current.y;
    
    let newX = startPoint.current.x;
    let newY = startPoint.current.y;
    let newWidth = width;
    let newHeight = height;

    if (width < 0) {
        newX = coords.x;
        newWidth = -width;
    }
    if (height < 0) {
        newY = coords.y;
        newHeight = -height;
    }

    setCrop({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });
  };
  
  const handleInteractionEnd = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsCropping(false);
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

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) {
        setIsLoading(false);
        return;
    }

    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    
    setCroppedUrl(cropCanvas.toDataURL(originalFile?.type));
    setIsLoading(false);
    toast({title: "Image Cropped", description: "You can now download the result."});
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
          <div className="space-y-4">
            <Label>Click and drag on the image to select a crop area.</Label>
            <div className="border rounded-md cursor-crosshair touch-none">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleInteractionStart}
                    onMouseMove={handleInteractionMove}
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
        <CardFooter>
          <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Cropped Image
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
