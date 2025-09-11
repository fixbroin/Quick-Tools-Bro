
'use client';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Upload, Download, Loader2 } from 'lucide-react';

type Format = 'png' | 'jpeg';

export default function ImageConverterPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>('png');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        toast({ title: 'Invalid file type', description: 'Please upload a PNG or JPG image.', variant: 'destructive' });
        return;
      }
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setConvertedUrl(null);
    }
  };

  const handleConvert = useCallback(() => {
    if (!originalFile || !originalUrl) return;

    setIsLoading(true);
    setConvertedUrl(null);

    const img = new window.Image();
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (targetFormat === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL(`image/${targetFormat}`);
        setConvertedUrl(dataUrl);
      }
      setIsLoading(false);
    };
    img.onerror = () => {
      toast({ title: 'Error loading image', variant: 'destructive' });
      setIsLoading(false);
    };
  }, [originalFile, originalUrl, targetFormat, toast]);
  
  const downloadExtension = targetFormat === 'jpeg' ? 'jpg' : 'png';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Image Format Converter</CardTitle>
        <CardDescription>Convert images from PNG to JPG, or JPG to PNG.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload Image (JPG or PNG)</Label>
          <Input id="image-upload" type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />
        </div>

        {originalUrl && (
          <>
            <div className="rounded-md border p-2">
              <Image src={originalUrl} alt="Original" width={400} height={400} className="w-full h-auto rounded-md object-contain aspect-video" />
            </div>
            <div className="space-y-2">
              <Label>Convert to:</Label>
              <RadioGroup value={targetFormat} onValueChange={(val: Format) => setTargetFormat(val)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="png" id="png" />
                  <Label htmlFor="png">PNG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jpeg" id="jpeg" />
                  <Label htmlFor="jpeg">JPG</Label>
                </div>
              </RadioGroup>
            </div>
            <Button onClick={handleConvert} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Convert
            </Button>
          </>
        )}

        {convertedUrl && !isLoading && (
           <div className="space-y-2">
            <Label>Converted Image</Label>
            <div className="rounded-md border p-2">
                <Image src={convertedUrl} alt="Converted" width={400} height={400} className="w-full h-auto rounded-md object-contain aspect-video" />
              </div>
           </div>
        )}
      </CardContent>
      {convertedUrl && !isLoading && originalFile && (
        <CardFooter>
          <Button asChild>
            <a href={convertedUrl} download={`${originalFile.name.split('.')[0]}.${downloadExtension}`}>
              <Download className="mr-2 h-4 w-4" />
              Download Converted Image
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
