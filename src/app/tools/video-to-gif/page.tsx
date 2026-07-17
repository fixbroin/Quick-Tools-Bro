'use client';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Upload, Sparkles, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export default function VideoToGIFPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fps, setFps] = useState('10');
  const [width, setWidth] = useState('480');
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);
  const [progressMessage, setProgressMessage] = useState('');
  const { toast } = useToast();
  const ffmpegRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSliderChange = useCallback((values: number[]) => {
    const [start, end] = values;
    const video = videoRef.current;
    if (video) {
      if (start !== startTime) {
        video.currentTime = start;
      } else if (end !== endTime) {
        video.currentTime = end;
      }
    }
    setStartTime(start);
    setEndTime(end);
  }, [startTime, endTime]);

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
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setCompressedUrl(null);
      setCompressedSize(null);
      setStartTime(0);
      
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        setDuration(video.duration);
        setEndTime(Math.min(10, video.duration)); // default trim to first 10 seconds for GIF
      };
    }
  };

  const loadFFmpeg = async () => {
    if (!ffmpegRef.current) {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      ffmpegRef.current = new FFmpeg();
    }
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg.loaded) {
      ffmpeg.on('progress', ({ progress }: { progress: number }) => {
         setProgress(Math.round(progress * 100));
      });
      await ffmpeg.load({
        coreURL: `${window.location.origin}/ffmpeg/ffmpeg-core.js`,
        wasmURL: `${window.location.origin}/ffmpeg/ffmpeg-core.wasm`,
      });
    }
  };

  const handleConvert = useCallback(async () => {
    if (!originalFile) return;
    setIsLoading(true);
    setProgress(0);
    setCompressedUrl(null);
    setProgressMessage('Initializing encoder...');

    try {
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const inputName = originalFile.name;
      const outputName = `animated-${Date.now()}.gif`;

      const { fetchFile } = await import('@ffmpeg/util');
      await ffmpeg.writeFile(inputName, await fetchFile(originalFile));
      setProgressMessage('Creating animated GIF...');

      // High-quality palette generation and mapping in one command
      const command = [
        '-i', inputName,
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        '-vf', `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        outputName
      ];

      await ffmpeg.exec(command);
      
      const data = await ffmpeg.readFile(outputName);
      const gifBlob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: 'image/gif' });
      const gifUrl = URL.createObjectURL(gifBlob);

      setCompressedUrl(gifUrl);
      setCompressedSize(gifBlob.size);
      toast({ title: "Conversion complete!", description: "Video successfully converted to GIF." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Conversion failed", description: err.message || "Failed to convert video.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setProgress(0);
      setProgressMessage('');
    }
  }, [originalFile, fps, width, startTime, endTime, toast]);

  const handleDownload = () => {
    if (!compressedUrl) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    const originalName = originalFile ? originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) : 'animated';
    a.download = `${originalName}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Video className="text-primary h-6 w-6" /> VIDEO TO GIF CONVERTER
          </CardTitle>
          <CardDescription>
            Convert MP4, WebM, and MOV video clips into high-quality animated GIFs online. Processed entirely client-side.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Label htmlFor="video-file">Upload Video File</Label>
            <div className="border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
              <input id="video-file" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
              <div onClick={() => document.getElementById('video-file')?.click()} className="cursor-pointer space-y-3">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    {originalFile ? originalFile.name : 'Choose a video file to convert'}
                  </p>
                  <p className="text-xs text-muted-foreground">Supports MP4, WebM, MOV up to 150MB</p>
                </div>
              </div>
            </div>
          </div>

          {originalFile && originalUrl && (
            <div className="flex flex-col items-center justify-center space-y-3 bg-muted/5 p-4 rounded-xl border border-primary/5">
              <p className="text-xs font-bold text-muted-foreground">Video Timeline Preview</p>
              <video ref={videoRef} src={originalUrl} controls className="w-full max-w-md rounded-xl shadow-sm border bg-black aspect-video" />
            </div>
          )}

          {originalFile && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                <span>Select GIF Range to Trim</span>
                <span className="text-primary font-mono text-xs">
                  Trim: {startTime.toFixed(1)}s to {endTime.toFixed(1)}s ({ (endTime - startTime).toFixed(1) }s total)
                </span>
              </div>
              <Slider
                value={[startTime, endTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                minStepsBetweenThumbs={1}
                onValueChange={handleSliderChange}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>0.0s</span>
                <span>{(duration || 0).toFixed(1)}s</span>
              </div>
            </div>
          )}

          {originalFile && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="width-select">GIF Output Width</Label>
                <Select value={width} onValueChange={setWidth}>
                  <SelectTrigger id="width-select" className="rounded-xl h-11">
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="320">320px (Compact / Mobile)</SelectItem>
                    <SelectItem value="480">480px (Medium - Recommended)</SelectItem>
                    <SelectItem value="640">640px (Large / HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fps-select">Frame Rate (FPS)</Label>
                <Select value={fps} onValueChange={setFps}>
                  <SelectTrigger id="fps-select" className="rounded-xl h-11">
                    <SelectValue placeholder="Select FPS" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="5">5 FPS (Low Size)</SelectItem>
                    <SelectItem value="10">10 FPS (Standard)</SelectItem>
                    <SelectItem value="15">15 FPS (Smooth Motion)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleConvert} disabled={isLoading} className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold shadow-md">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? `${progressMessage} ${progress}%` : 'Convert to GIF'}
                </Button>
              </div>
            </div>
          )}

          {compressedUrl && !isLoading && (
            <div className="border-t pt-6 flex flex-col items-center justify-center space-y-4 bg-muted/10 p-6 rounded-2xl border">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Sparkles className="text-primary h-5 w-5 animate-pulse" /> Animated GIF Ready!
              </div>
              <img src={compressedUrl} alt="Generated animated GIF" className="max-w-md w-full h-auto rounded-xl border border-primary/20 bg-card object-contain shadow-sm" />
              {compressedSize && (
                <p className="text-xs text-muted-foreground font-mono">File Size: {formatSize(compressedSize)}</p>
              )}
              <Button onClick={handleDownload} className="rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/95 text-white shadow-md">
                <Download className="mr-2 h-4 w-4" /> Download GIF File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
