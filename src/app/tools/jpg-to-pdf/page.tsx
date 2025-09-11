'use client';
import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Loader2, Download, Upload, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { saveAs } from 'file-saver';

interface ImageFile {
  file: File;
  url: string;
}

export default function JpgToPdfPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files)
        .filter(file => file.type.startsWith('image/jpeg'))
        .map(file => ({ file, url: URL.createObjectURL(file) }));
      
      if (newImages.length !== files.length) {
          toast({ title: "Some files were not JPGs", description: "Only JPG/JPEG files are supported.", variant: "destructive" });
      }
      
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleConvertToPdf = useCallback(async () => {
    if (images.length === 0) {
      toast({ title: 'No images selected', description: 'Please upload at least one JPG image.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const { file } of images) {
        const jpgImageBytes = await file.arrayBuffer();
        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
        const page = pdfDoc.addPage([jpgImage.width, jpgImage.height]);
        page.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: jpgImage.width,
          height: jpgImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'converted.pdf');
    } catch (error) {
      console.error(error);
      toast({ title: 'Conversion Failed', description: 'Could not convert images to PDF. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [images, toast]);
  
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  }
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">JPG to PDF Converter</CardTitle>
        <CardDescription>Upload multiple JPG images to combine them into a single PDF file.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload JPG Images</Label>
          <div className="flex items-center gap-4 rounded-lg border p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                  <Input id="image-upload" type="file" accept="image/jpeg" multiple onChange={handleFileChange} />
                  <p className="text-xs text-muted-foreground mt-1">Select one or more JPG files.</p>
              </div>
          </div>
        </div>

        {images.length > 0 && (
            <div className="space-y-4">
                <Label>Image Preview & Order</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group border rounded-lg p-2">
                             <Image src={img.url} alt={`Preview ${index}`} width={200} height={200} className="w-full h-auto rounded-md object-contain aspect-square" />
                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <Button size="icon" variant="ghost" onClick={() => moveImage(index, 'up')} disabled={index === 0} className="text-white"><ArrowLeft/></Button>
                                <Button size="icon" variant="ghost" onClick={() => removeImage(index)} className="text-white"><X/></Button>
                                <Button size="icon" variant="ghost" onClick={() => moveImage(index, 'down')} disabled={index === images.length - 1} className="text-white"><ArrowRight/></Button>
                             </div>
                             <div className="absolute top-1 left-2 bg-primary text-primary-foreground h-6 w-6 flex items-center justify-center rounded-full text-sm font-bold">{index + 1}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleConvertToPdf} disabled={isLoading || images.length === 0}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Convert to PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
