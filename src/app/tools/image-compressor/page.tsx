
'use client';
import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Download, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

interface CompressionResult {
  originalUrl: string;
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  compressedFile: File;
}

type CompressionMode = 'size' | 'quality';

export default function ImageCompressorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [quality, setQuality] = useState(70); // Default quality 70%
  const [mode, setMode] = useState<CompressionMode>('quality');
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file type", description: "Please upload an image.", variant: "destructive" });
        return;
      }
      setOriginalFile(file);
      setResult(null);
    }
  };

  const handleCompress = useCallback(async () => {
    if (!originalFile) {
      toast({ title: 'Please select an image first.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const options = {
      maxSizeMB: mode === 'size' ? maxSizeMB : undefined,
      initialQuality: mode === 'quality' ? quality / 100 : undefined,
      useWebWorker: true,
    };
    
    if (mode === 'size' && maxSizeMB <= 0) {
      toast({ title: 'Invalid size', description: 'Target size must be greater than 0.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    try {
      const compressedFile = await imageCompression(originalFile, options);
      
      const originalUrl = URL.createObjectURL(originalFile);
      const compressedUrl = URL.createObjectURL(compressedFile);

      setResult({
        originalUrl: originalUrl,
        compressedUrl: compressedUrl,
        originalSize: originalFile.size,
        compressedSize: compressedFile.size,
        compressedFile: compressedFile,
      });

    } catch (error: any) {
      console.error(error);
      let description = 'Please try another file or adjust settings.';
      if (error.message.includes('too Vsmall') || error.message.includes('too small')) {
        description = `Could not compress further with the current settings. The resulting file is as small as possible.`;
      }
      toast({ title: 'Compression Error', description, variant: 'destructive' });

      // Even on error, the library might return the best effort compressed file
      if (error.file) {
        const originalUrl = URL.createObjectURL(originalFile);
        const compressedUrl = URL.createObjectURL(error.file);
        setResult({
          originalUrl: originalUrl,
          compressedUrl: compressedUrl,
          originalSize: originalFile.size,
          compressedSize: error.file.size,
          compressedFile: error.file,
        });
      }

    } finally {
      setIsLoading(false);
    }
  }, [originalFile, maxSizeMB, toast, mode, quality]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const handleDownload = () => {
    if (result && result.compressedFile) {
      const a = document.createElement('a');
      a.href = result.compressedUrl;
      a.download = `compressed-${originalFile?.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Image Compressor</CardTitle>
        <CardDescription>Reduce image file size by setting a target size or quality.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload Image</Label>
          <div className="flex items-center gap-4">
            <Input id="image-upload" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
          </div>
        </div>
        
        {originalFile && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Compression Mode</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as CompressionMode)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="size" id="size"/>
                  <Label htmlFor="size">By Size</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quality" id="quality"/>
                  <Label htmlFor="quality">By Quality</Label>
                </div>
              </RadioGroup>
            </div>

            {mode === 'size' ? (
              <div className="space-y-2">
                <Label htmlFor='max-size'>Target Size (MB)</Label>
                <Input id="max-size" type="number" value={maxSizeMB} onChange={(e) => setMaxSizeMB(parseFloat(e.target.value) || 0)} min="0.01" step="0.1" />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor='quality-slider'>Quality ({quality}%)</Label>
                <Slider id="quality-slider" value={[quality]} onValueChange={([v]) => setQuality(v)} min={1} max={100} step={1} />
              </div>
            )}

            <Button onClick={handleCompress} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Compress Image
            </Button>
          </div>
        )}

        {result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Original Image ({formatSize(result.originalSize)})</Label>
              <div className="rounded-md border p-2">
                <Image src={result.originalUrl} alt="Original" width={400} height={400} className="w-full h-auto rounded-md object-contain aspect-video" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Compressed Image ({formatSize(result.compressedSize)})</Label>
              <div className="rounded-md border p-2">
                <Image src={result.compressedUrl} alt="Compressed" width={400} height={400} className="w-full h-auto rounded-md object-contain aspect-video" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {result && !isLoading && (
        <CardFooter className="flex-col items-start gap-4">
          <div className="text-sm font-medium">
            Size Reduction: {Math.max(0, (((result.originalSize - result.compressedSize) / result.originalSize) * 100)).toFixed(2)}%
          </div>
          <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Compressed Image
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
