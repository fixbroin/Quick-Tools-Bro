
'use client';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Upload } from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

interface CompressionResult {
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  compressedFile: Blob;
}

type CompressionMode = 'quality' | 'size';

export default function VideoCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<CompressionMode>('quality');
  const [quality, setQuality] = useState(28); // CRF value, lower is better quality. Slider will be inverted.
  const [targetSize, setTargetSize] = useState(25); // in MB
  const { toast } = useToast();
  const ffmpegRef = useRef(new FFmpeg());
  const [progressMessage, setProgressMessage] = useState('');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast({ title: "Invalid file type", description: "Please upload a video file.", variant: "destructive" });
        return;
      }
      
      const maxFileSize = 500 * 1024 * 1024; // 500 MB
      if (file.size > maxFileSize) {
        toast({
          title: "File too large",
          description: `Please upload a video smaller than ${formatSize(maxFileSize)}. The ideal size for browser-based compression is under 500MB for best performance.`,
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      setOriginalFile(file);
      setResult(null);
    }
  };

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg.loaded) {
      ffmpeg.on('progress', ({ progress, time }) => {
         setProgress(Math.round(progress * 100));
      });
      await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
      });
    }
  };

  const handleCompress = useCallback(async () => {
    if (!originalFile) {
      toast({ title: 'Please select a video first.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setResult(null);
    setProgressMessage('Loading FFmpeg...');

    try {
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const inputFileName = originalFile.name;
      const outputFileName = `compressed-${Date.now()}.mp4`;
      
      await ffmpeg.writeFile(inputFileName, await fetchFile(originalFile));
      
      let command: string[];
      if (mode === 'quality') {
        setProgressMessage('Compressing by quality...');
        const crfValue = 51 - quality;
        command = ['-i', inputFileName, '-vcodec', 'libx264', '-crf', crfValue.toString(), '-preset', 'fast', '-c:a', 'aac', outputFileName];
        await ffmpeg.exec(command);
      } else { // Target Size
        const originalDuration = await getVideoDuration(originalFile);
        if (originalDuration === null || originalDuration <= 0) {
            throw new Error("Could not determine video duration. Target size mode cannot be used.");
        }
        // Two-pass encoding for target size
        const targetTotalBitrate = Math.floor((targetSize * 8 * 1024) / originalDuration); // in kbps
        const audioBitrate = 128; // a reasonable audio bitrate
        const targetVideoBitrate = targetTotalBitrate - audioBitrate;

        if (targetVideoBitrate <= 0) {
            throw new Error("Target size is too small for this video duration. Please choose a larger size or use quality mode.");
        }
        
        setProgressMessage('Pass 1 of 2: Analyzing video...');
        await ffmpeg.exec(['-i', inputFileName, '-c:v', 'libx264', '-b:v', `${targetVideoBitrate}k`, '-pass', '1', '-an', '-f', 'null', '/dev/null']);
        
        setProgressMessage('Pass 2 of 2: Compressing video...');
        command = ['-i', inputFileName, '-c:v', 'libx264', '-b:v', `${targetVideoBitrate}k`, '-pass', '2', '-c:a', 'aac', '-b:a', `${audioBitrate}k`, outputFileName];
        await ffmpeg.exec(command);
      }
      
      const data = await ffmpeg.readFile(outputFileName);
      const compressedBlob = new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' });
      const compressedUrl = URL.createObjectURL(compressedBlob);

      setResult({
        compressedUrl,
        originalSize: originalFile.size,
        compressedSize: compressedBlob.size,
        compressedFile: compressedBlob,
      });

      toast({ title: "Compression Complete!", description: "Video has been successfully compressed." });

    } catch (error: any) {
      console.error(error);
      toast({ title: 'Compression Failed', description: error.message || 'Could not compress the video. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setProgress(0);
      setProgressMessage('');
    }
  }, [originalFile, toast, mode, quality, targetSize]);

  const getVideoDuration = (file: File): Promise<number | null> => {
      return new Promise((resolve) => {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
              window.URL.revokeObjectURL(video.src);
              resolve(video.duration);
          };
          video.onerror = () => {
              resolve(null);
          };
          video.src = URL.createObjectURL(file);
      });
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
        <CardTitle className="font-headline">Video Compressor</CardTitle>
        <CardDescription>Reduce video file size by re-encoding with FFmpeg.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="video-upload">Upload Video (Max 500MB)</Label>
           <div className="flex items-center gap-4 rounded-lg border p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <Input id="video-upload" type="file" accept="video/mp4,video/webm,video/mov,video/quicktime" onChange={handleFileChange} />
                <p className="text-xs text-muted-foreground mt-1">Select a video file (MP4, WebM, MOV).</p>
              </div>
            </div>
        </div>
        
        {originalFile && (
          <div className="space-y-4">
             <div className="space-y-2">
              <Label>Compression Mode</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as CompressionMode)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quality" id="quality"/>
                  <Label htmlFor="quality">By Quality</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="size" id="size"/>
                  <Label htmlFor="size">By Target Size</Label>
                </div>
              </RadioGroup>
            </div>
            
            {mode === 'quality' ? (
                <div className="space-y-2">
                    <Label htmlFor='quality-slider'>Clarity (Higher is better)</Label>
                    <div className="flex items-center gap-4">
                        <Slider 
                            id="quality-slider" 
                            value={[quality]} 
                            onValueChange={([v]) => setQuality(v)} 
                            min={1} 
                            max={51} 
                            step={1} 
                            className="w-full"
                        />
                        <span className="text-sm font-medium w-12 text-center">{quality}</span>
                    </div>
                     <p className="text-xs text-muted-foreground">A lower value means lower quality and smaller file size. A value around 28 is a good balance.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    <Label htmlFor='target-size'>Target Size (MB)</Label>
                    <Input id="target-size" type="number" value={targetSize} onChange={(e) => setTargetSize(Number(e.target.value))} />
                    <p className="text-xs text-muted-foreground">The compressor will attempt to match this file size. May fail on very short videos.</p>
                </div>
            )}

            <Button onClick={handleCompress} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? `${progressMessage} ${progress}%` : 'Process Video'}
            </Button>
          </div>
        )}

        {result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Original Size: {formatSize(result.originalSize)}</Label>
              <div className="rounded-md border p-2 bg-muted">
                {originalFile && <video src={URL.createObjectURL(originalFile)} controls className="w-full h-auto rounded-md aspect-video" />}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Compressed Size: {formatSize(result.compressedSize)}</Label>
              <div className="rounded-md border p-2 bg-muted">
                <video src={result.compressedUrl} controls className="w-full h-auto rounded-md aspect-video" />
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
              Download Compressed Video
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
