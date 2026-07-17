'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PRESETS = {
  'upsc-photo': { label: 'UPSC / SSC Photo (20KB - 50KB, 350x350px)', width: 350, height: 350, minKb: 20, maxKb: 50 },
  'upsc-sign': { label: 'UPSC / SSC Signature (10KB - 20KB, 350x350px)', width: 350, height: 350, minKb: 10, maxKb: 20 },
  'ibps-photo': { label: 'IBPS Photo (20KB - 50KB, 200x230px)', width: 200, height: 230, minKb: 20, maxKb: 50 },
  'ibps-sign': { label: 'IBPS Signature (10KB - 20KB, 140x60px)', width: 140, height: 60, minKb: 10, maxKb: 20 },
  'custom': { label: 'Custom Configuration', width: 300, height: 300, minKb: 10, maxKb: 50 }
};

export default function GovtJobPhotoResizerPage() {
  const { toast } = useToast();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [preset, setPreset] = useState<keyof typeof PRESETS>('upsc-photo');
  const [customWidth, setCustomWidth] = useState(350);
  const [customHeight, setCustomHeight] = useState(350);
  const [customMaxKb, setCustomMaxKb] = useState(50);
  const [customMinKb, setCustomMinKb] = useState(20);

  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active configurations based on selected preset
  const activeWidth = preset === 'custom' ? customWidth : PRESETS[preset].width;
  const activeHeight = preset === 'custom' ? customHeight : PRESETS[preset].height;
  const activeMinKb = preset === 'custom' ? customMinKb : PRESETS[preset].minKb;
  const activeMaxKb = preset === 'custom' ? customMaxKb : PRESETS[preset].maxKb;

  const processImage = useCallback(async (file: File) => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = activeWidth;
          canvas.height = activeHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setIsProcessing(false);
            return;
          }

          // Draw and crop/stretch to exact dimensions
          ctx.drawImage(img, 0, 0, activeWidth, activeHeight);

          // Quality compression logic to hit the target KB window (minKb to maxKb)
          let low = 0.01;
          let high = 0.99;
          let bestBlob: Blob | null = null;
          let bestSize = 0;
          let bestQuality = 0.8;

          // Simple search across quality parameters
          for (let i = 0; i < 8; i++) {
            const mid = (low + high) / 2;
            const dataUrl = canvas.toDataURL('image/jpeg', mid);
            
            // Convert to blob to accurately check file size
            const byteString = atob(dataUrl.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let j = 0; j < byteString.length; j++) {
              ia[j] = byteString.charCodeAt(j);
            }
            const blob = new Blob([ab], { type: 'image/jpeg' });
            const sizeKb = blob.size / 1024;

            if (sizeKb <= activeMaxKb) {
              bestBlob = blob;
              bestSize = blob.size;
              bestQuality = mid;
              low = mid; // Try higher quality
            } else {
              high = mid; // Must compress more
            }
          }

          // Fallback if bestBlob was never set (i.e. even lowest quality was too big)
          if (!bestBlob) {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.01);
            const byteString = atob(dataUrl.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let j = 0; j < byteString.length; j++) {
              ia[j] = byteString.charCodeAt(j);
            }
            bestBlob = new Blob([ab], { type: 'image/jpeg' });
            bestSize = bestBlob.size;
          }

          const compressedUrl = URL.createObjectURL(bestBlob);
          setProcessedUrl(compressedUrl);
          setProcessedSize(bestSize);
          setIsProcessing(false);

          const finalSizeKb = bestSize / 1024;
          if (finalSizeKb < activeMinKb) {
            toast({
              title: "Size slightly below minimum",
              description: `Image resized to ${finalSizeKb.toFixed(1)} KB (target is ${activeMinKb}-${activeMaxKb} KB). Original resolution was too low to reach minimum size safely.`,
              variant: "default",
            });
          } else {
            toast({
              title: "Resized successfully!",
              description: `Final size is ${finalSizeKb.toFixed(1)} KB. Ready for download.`,
            });
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      toast({
        title: "Processing error",
        description: "Failed to process and compress the image.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  }, [activeWidth, activeHeight, activeMinKb, activeMaxKb, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOriginalFile(file);
      setOriginalPreview(URL.createObjectURL(file));
      setProcessedUrl(null);
      setProcessedSize(null);
      processImage(file);
    }
  };

  useEffect(() => {
    if (originalFile) {
      processImage(originalFile);
    }
  }, [preset, customWidth, customHeight, customMaxKb, customMinKb, originalFile, processImage]);

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    const originalName = originalFile ? originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) : 'resized';
    a.download = `${originalName}_resized_${activeWidth}x${activeHeight}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Sparkles className="text-primary h-6 w-6" /> GOVT JOB PHOTO & SIGNATURE RESIZER
          </CardTitle>
          <CardDescription>
            Directly resize photos and signatures to target pixel sizes and file sizes (KB) required for Indian Govt applications (UPSC, SSC, IBPS, etc.).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Preset Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Preset</Label>
              <Select value={preset} onValueChange={(val: any) => setPreset(val)}>
                <SelectTrigger className="rounded-xl border border-primary/15 bg-card shadow-sm h-11">
                  <SelectValue placeholder="Choose a preset" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-primary/15">
                  <SelectItem value="upsc-photo">UPSC / SSC Photo (20-50 KB)</SelectItem>
                  <SelectItem value="upsc-sign">UPSC / SSC Signature (10-20 KB)</SelectItem>
                  <SelectItem value="ibps-photo">IBPS Photo (20-50 KB)</SelectItem>
                  <SelectItem value="ibps-sign">IBPS Signature (10-20 KB)</SelectItem>
                  <SelectItem value="custom">Custom Configuration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {preset === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Width (px)</Label>
                  <Input type="number" value={customWidth} onChange={(e) => setCustomWidth(parseInt(e.target.value) || 100)} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Height (px)</Label>
                  <Input type="number" value={customHeight} onChange={(e) => setCustomHeight(parseInt(e.target.value) || 100)} className="h-11 rounded-xl" />
                </div>
              </div>
            )}
          </div>

          {preset === 'custom' && (
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Min Size (KB)</Label>
                <Input type="number" value={customMinKb} onChange={(e) => setCustomMinKb(parseInt(e.target.value) || 1)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Max Size (KB)</Label>
                <Input type="number" value={customMaxKb} onChange={(e) => setCustomMaxKb(parseInt(e.target.value) || 5)} className="h-11 rounded-xl" />
              </div>
            </div>
          )}

          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
            <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            <div onClick={triggerUpload} className="cursor-pointer space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Upload your passport photo or signature</p>
                <p className="text-xs text-muted-foreground">Supports PNG, JPG, JPEG up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {originalFile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
              {/* Original Preview */}
              <div className="space-y-2 text-center">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-left">Original Image</Label>
                <div className="relative aspect-square max-w-[250px] mx-auto rounded-xl overflow-hidden border border-muted bg-muted/30 flex items-center justify-center">
                  {originalPreview && (
                    <img src={originalPreview} alt="Original Preview" className="max-w-full max-h-full object-contain" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-mono">Size: {(originalFile.size / 1024).toFixed(1)} KB</p>
              </div>

              {/* Processed Preview */}
              <div className="space-y-2 text-center">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-left">Processed Image ({activeWidth}x{activeHeight} px)</Label>
                <div className="relative aspect-square max-w-[250px] mx-auto rounded-xl overflow-hidden border border-primary/20 bg-muted/30 flex items-center justify-center">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent rounded-full" />
                      <p className="text-xs text-muted-foreground">Compressing...</p>
                    </div>
                  ) : processedUrl ? (
                    <img src={processedUrl} alt="Processed Preview" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-center p-4 text-xs text-muted-foreground flex flex-col items-center gap-2">
                      <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                      Waiting for image...
                    </div>
                  )}
                </div>
                {processedSize !== null && (
                  <p className="text-xs font-bold text-primary mt-2 font-mono">
                    Compressed Size: {(processedSize / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
            </div>
          )}

          {processedUrl && !isProcessing && (
            <div className="flex justify-center border-t pt-6">
              <Button onClick={handleDownload} className="rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/95 text-white shadow-md">
                <Download className="mr-2 h-4 w-4" /> Download Resized Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-2xl font-bold font-headline mb-4">Official Requirements Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-primary">UPSC & SSC Portals</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Dimensions: Min 350x350 pixels, Max 1000x1000 pixels</li>
                <li>Photo File Size: 20 KB to 50 KB</li>
                <li>Signature File Size: 10 KB to 20 KB</li>
                <li>Format: JPG/JPEG format only</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-primary">IBPS Bank PO / Clerk</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Photo Dimensions: 200 x 230 pixels (preferred)</li>
                <li>Photo Size: 20 KB to 50 KB</li>
                <li>Signature Dimensions: 140 x 60 pixels</li>
                <li>Signature Size: 10 KB to 20 KB</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
