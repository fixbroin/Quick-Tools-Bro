'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, Upload, Download, RefreshCw, Play, CheckCircle2, 
  HelpCircle, ShieldCheck, Zap, Sliders, ArrowRight, Video, Scissors
} from 'lucide-react';

interface WatermarkBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  size: number;
  name: string;
}

export default function VideoWatermarkRemoverPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<VideoMetadata | null>(null);
  const [previewTime, setPreviewTime] = useState<number>(1);
  const [box, setBox] = useState<WatermarkBox>({ x: 0, y: 0, w: 80, h: 80 });
  const [preset, setPreset] = useState<string>('veo');
  const [qualityPreset, setQualityPreset] = useState<'fast' | 'high'>('fast');
  
  // Processing state
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);

  // Canvas interaction
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDraggingBox, setIsDraggingBox] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const { toast } = useToast();
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ffmpegRef = useRef<any>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 1. Calculate preset coordinates based on video resolution
  const getPresetBox = useCallback((presetKey: string, width: number, height: number): WatermarkBox => {
    if (presetKey === 'veo-portrait' || (presetKey === 'veo' && height > width)) {
      // Calibrated for Google Veo portrait 9:16
      const w = Math.round(width * 0.075);
      const h = Math.round(height * 0.042);
      const x = Math.round(width * 0.798);
      const y = Math.round(height * 0.886);
      return { x, y, w, h };
    } else if (presetKey === 'veo-landscape' || (presetKey === 'veo' && width >= height)) {
      // Calibrated for Google Veo landscape 16:9
      const w = Math.round(width * 0.048);
      const h = Math.round(height * 0.084);
      const x = Math.round(width * 0.885);
      const y = Math.round(height * 0.796);
      return { x, y, w, h };
    } else if (presetKey === 'bottom-right' || presetKey === 'sora') {
      const size = Math.round(Math.min(width, height) * 0.10);
      return {
        x: Math.round(width - size - (width * 0.04)),
        y: Math.round(height - size - (height * 0.04)),
        w: size,
        h: size
      };
    } else if (presetKey === 'bottom-left') {
      const size = Math.round(Math.min(width, height) * 0.10);
      return {
        x: Math.round(width * 0.04),
        y: Math.round(height - size - (height * 0.04)),
        w: size,
        h: size
      };
    } else if (presetKey === 'top-right') {
      const size = Math.round(Math.min(width, height) * 0.10);
      return {
        x: Math.round(width - size - (width * 0.04)),
        y: Math.round(height * 0.04),
        w: size,
        h: size
      };
    } else if (presetKey === 'top-left') {
      const size = Math.round(Math.min(width, height) * 0.10);
      return {
        x: Math.round(width * 0.04),
        y: Math.round(height * 0.04),
        w: size,
        h: size
      };
    }
    // Default fallback
    const size = Math.round(Math.min(width, height) * 0.08);
    return {
      x: width - size - 20,
      y: height - size - 20,
      w: size,
      h: size
    };
  }, []);

  // 2. Handle File Selection
  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a video file (MP4, WebM, MOV).',
        variant: 'destructive',
      });
      return;
    }

    const isMobile = typeof window !== 'undefined' && (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768);
    const maxLimit = isMobile ? 120 * 1024 * 1024 : 350 * 1024 * 1024;
    if (file.size > maxLimit) {
      toast({
        title: 'File is large',
        description: `For fast in-browser processing, videos under ${formatSize(maxLimit)} are recommended. Larger files may run slower.`,
        duration: 5000,
      });
    }

    const url = URL.createObjectURL(file);
    setOriginalFile(file);
    setOriginalVideoUrl(url);
    setResultUrl(null);
    setResultSize(null);
    setProgress(0);

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.onloadedmetadata = () => {
      const w = video.videoWidth || 1920;
      const h = video.videoHeight || 1080;
      const d = video.duration || 10;
      setMeta({
        width: w,
        height: h,
        duration: d,
        size: file.size,
        name: file.name
      });
      const initialPreset = h > w ? 'veo-portrait' : 'veo-landscape';
      setPreset(initialPreset);
      setBox(getPresetBox(initialPreset, w, h));
      setPreviewTime(Math.min(1.5, d / 2));
    };
  };

  // 3. Draw Preview Frame and Watermark Box on Canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video = hiddenVideoRef.current;
    if (!canvas || !video || !meta) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video aspect ratio cleanly
    const containerWidth = canvas.parentElement?.clientWidth || 640;
    const scale = containerWidth / meta.width;
    canvas.width = containerWidth;
    canvas.height = meta.height * scale;

    // Draw the video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Box coordinates on display canvas
    const displayX = box.x * scale;
    const displayY = box.y * scale;
    const displayW = box.w * scale;
    const displayH = box.h * scale;

    // Semi-transparent overlay mask for whole video except watermark area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    // Top
    ctx.fillRect(0, 0, canvas.width, displayY);
    // Bottom
    ctx.fillRect(0, displayY + displayH, canvas.width, canvas.height - (displayY + displayH));
    // Left
    ctx.fillRect(0, displayY, displayX, displayH);
    // Right
    ctx.fillRect(displayX + displayW, displayY, canvas.width - (displayX + displayW), displayH);

    // Watermark bounding box
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)'; // Red tint
    ctx.fillRect(displayX, displayY, displayW, displayH);

    // Glowing border
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(displayX, displayY, displayW, displayH);

    // Inner dashed line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(displayX + 1, displayY + 1, displayW - 2, displayH - 2);
    ctx.setLineDash([]);

    // Corner grab indicators
    const cornerSize = 7;
    ctx.fillStyle = '#ef4444';
    // Top-left
    ctx.fillRect(displayX - 3, displayY - 3, cornerSize, cornerSize);
    // Top-right
    ctx.fillRect(displayX + displayW - 4, displayY - 3, cornerSize, cornerSize);
    // Bottom-left
    ctx.fillRect(displayX - 3, displayY + displayH - 4, cornerSize, cornerSize);
    // Bottom-right
    ctx.fillRect(displayX + displayW - 4, displayY + displayH - 4, cornerSize, cornerSize);

    // Label tag
    const label = `Erase Area: ${box.w}x${box.h} px`;
    ctx.font = 'bold 11px sans-serif';
    const textWidth = ctx.measureText(label).width;
    const tagY = displayY > 24 ? displayY - 6 : displayY + displayH + 16;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(displayX, tagY - 12, textWidth + 8, 16);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, displayX + 4, tagY);
  }, [box, meta]);

  // Redraw when video seeks
  const handleVideoSeeked = () => {
    drawCanvas();
  };

  // Seek video when previewTime changes
  useEffect(() => {
    if (hiddenVideoRef.current && meta) {
      hiddenVideoRef.current.currentTime = previewTime;
    }
  }, [previewTime, meta]);

  // Redraw when box or window resize
  useEffect(() => {
    drawCanvas();
    const handleResize = () => drawCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawCanvas]);

  // 4. Mouse / Touch Interactions on Canvas
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !meta) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scale = meta.width / canvas.width;
    const x = (clientX - rect.left) * scale;
    const y = (clientY - rect.top) * scale;
    return { x: Math.max(0, Math.min(meta.width, x)), y: Math.max(0, Math.min(meta.height, y)) };
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const pt = getCanvasCoords(e);
    if (!meta) return;

    // Check if clicking inside current box to drag it
    if (
      pt.x >= box.x &&
      pt.x <= box.x + box.w &&
      pt.y >= box.y &&
      pt.y <= box.y + box.h
    ) {
      setIsDraggingBox(true);
      setDragOffset({ x: pt.x - box.x, y: pt.y - box.y });
    } else {
      // Start drawing new custom box
      setIsDrawing(true);
      setPreset('custom');
      setDragStart(pt);
      setBox({ x: Math.round(pt.x), y: Math.round(pt.y), w: 10, h: 10 });
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && !isDraggingBox) return;
    const pt = getCanvasCoords(e);
    if (!meta) return;

    if (isDraggingBox) {
      // Move box while clamping to boundaries
      const newX = Math.max(1, Math.min(meta.width - box.w - 1, Math.round(pt.x - dragOffset.x)));
      const newY = Math.max(1, Math.min(meta.height - box.h - 1, Math.round(pt.y - dragOffset.y)));
      setBox((prev) => ({ ...prev, x: newX, y: newY }));
    } else if (isDrawing) {
      const left = Math.min(dragStart.x, pt.x);
      const top = Math.min(dragStart.y, pt.y);
      const width = Math.abs(pt.x - dragStart.x);
      const height = Math.abs(pt.y - dragStart.y);

      setBox({
        x: Math.max(1, Math.round(left)),
        y: Math.max(1, Math.round(top)),
        w: Math.max(12, Math.min(meta.width - left - 1, Math.round(width))),
        h: Math.max(12, Math.min(meta.height - top - 1, Math.round(height))),
      });
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    setIsDraggingBox(false);
  };

  // 5. Preset Switcher
  const handleSelectPreset = (key: string) => {
    setPreset(key);
    if (!meta) return;
    const newBox = getPresetBox(key, meta.width, meta.height);
    setBox(newBox);
  };

  // 6. Manual Numeric Box Adjustment
  const updateBoxProperty = (key: keyof WatermarkBox, value: number) => {
    if (!meta) return;
    setPreset('custom');
    setBox((prev) => {
      const updated = { ...prev, [key]: value };
      // Safety clamp
      updated.x = Math.max(1, Math.min(meta.width - updated.w - 1, updated.x));
      updated.y = Math.max(1, Math.min(meta.height - updated.h - 1, updated.y));
      updated.w = Math.max(8, Math.min(meta.width - updated.x - 1, updated.w));
      updated.h = Math.max(8, Math.min(meta.height - updated.y - 1, updated.h));
      return updated;
    });
  };

  // 7. Load In-Browser FFmpeg Engine
  const loadFFmpeg = async () => {
    if (!ffmpegRef.current) {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      ffmpegRef.current = new FFmpeg();
    }
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg.loaded) {
      ffmpeg.on('progress', ({ progress }: { progress: number }) => {
        setProgress(Math.min(99, Math.round(progress * 100)));
      });
      await ffmpeg.load({
        coreURL: `${window.location.origin}/ffmpeg/ffmpeg-core.js`,
        wasmURL: `${window.location.origin}/ffmpeg/ffmpeg-core.wasm`,
      });
    }
    return ffmpeg;
  };

  // 8. Process Watermark Removal
  const handleRemoveWatermark = async () => {
    if (!originalFile || !meta) {
      toast({ title: 'Please select a video first.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setResultUrl(null);
    setStatusText('Preparing FFmpeg in-browser engine...');

    try {
      const ffmpeg = await loadFFmpeg();

      setStatusText('Loading video into browser memory...');
      const { fetchFile } = await import('@ffmpeg/util');
      const inputFilename = 'input_' + Date.now() + '.mp4';
      const outputFilename = 'clean_' + Date.now() + '.mp4';

      await ffmpeg.writeFile(inputFilename, await fetchFile(originalFile));

      setStatusText('Erasing watermark with delogo interpolation...');

      // Precise integer bounding box clamped for FFmpeg delogo requirements
      const safeX = Math.max(1, Math.min(meta.width - 10, Math.round(box.x)));
      const safeY = Math.max(1, Math.min(meta.height - 10, Math.round(box.y)));
      const safeW = Math.max(8, Math.min(meta.width - safeX - 1, Math.round(box.w)));
      const safeH = Math.max(8, Math.min(meta.height - safeY - 1, Math.round(box.h)));

      const speedPreset = qualityPreset === 'fast' ? 'ultrafast' : 'veryfast';
      const crf = qualityPreset === 'fast' ? '22' : '18';

      const command = [
        '-i', inputFilename,
        '-vf', `delogo=x=${safeX}:y=${safeY}:w=${safeW}:h=${safeH}`,
        '-c:v', 'libx264',
        '-preset', speedPreset,
        '-crf', crf,
        '-c:a', 'copy',
        outputFilename,
      ];

      await ffmpeg.exec(command);

      setStatusText('Finalizing video file...');
      const data = await ffmpeg.readFile(outputFilename);
      const cleanBlob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: 'video/mp4' });
      const cleanUrl = URL.createObjectURL(cleanBlob);

      setResultUrl(cleanUrl);
      setResultSize(cleanBlob.size);
      setProgress(100);

      // Clean up virtual filesystem memory
      try {
        await ffmpeg.deleteFile(inputFilename);
        await ffmpeg.deleteFile(outputFilename);
      } catch (err) {
        // silent cleanup
      }

      toast({
        title: 'Watermark Removed Successfully!',
        description: 'Your cleaned video is ready for preview and download.',
      });
    } catch (err: any) {
      console.error('Watermark removal error:', err);
      toast({
        title: 'Processing failed',
        description: err.message || 'Failed to remove watermark. Please try with a shorter clip.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setStatusText('');
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !meta) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const baseName = meta.name.substring(0, meta.name.lastIndexOf('.')) || 'video';
    a.download = `${baseName}_clean.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalVideoUrl(null);
    setMeta(null);
    setResultUrl(null);
    setResultSize(null);
    setProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 py-6">
      {/* Hidden video element used to capture preview frames */}
      {originalVideoUrl && (
        <video
          ref={hiddenVideoRef}
          src={originalVideoUrl}
          onSeeked={handleVideoSeeked}
          className="hidden"
          playsInline
          muted
        />
      )}

      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <ShieldCheck className="h-4 w-4" />
          <span>100% In-Browser & Private • No Server Uploads</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" /> AI Video Watermark Remover
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Erase watermarks, logos, channel stamps, and AI badges (Google Veo, Sora) from your video clips with pixel-perfect edge blending.
        </p>
      </div>

      {/* Main Tool Container */}
      {!originalFile ? (
        /* STEP 1: Upload Dropzone */
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors shadow-sm">
          <CardContent className="p-8 md:p-12 text-center">
            <input
              id="video-upload"
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <div
              onClick={() => document.getElementById('video-upload')?.click()}
              className="cursor-pointer space-y-4 flex flex-col items-center justify-center"
            >
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary hover:scale-105 transition-transform">
                <Upload className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Select or Drag & Drop Video</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Supports MP4, MOV, WebM • Portrait (9:16) & Landscape (16:9)
                </p>
              </div>
              <Button type="button" className="mt-2 font-bold px-6">
                Browse Video File
              </Button>
              <p className="text-[11px] text-muted-foreground pt-2">
                Processed 100% on your device using WebAssembly. Your videos never leave your browser.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* STEP 2: Configure Watermark & Preview */
        <div className="space-y-6">
          {/* Video Metadata Bar */}
          <Card className="bg-muted/30 border-primary/10">
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1 min-w-[200px]">
                <p className="text-sm font-bold truncate max-w-xs md:max-w-md">{meta?.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Badge variant="outline" className="font-semibold">
                    {meta?.width} x {meta?.height}
                  </Badge>
                  <Badge variant="outline">{meta?.duration.toFixed(1)}s</Badge>
                  <Badge variant="outline">{meta && formatSize(meta.size)}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset} disabled={isLoading}>
                Change Video
              </Button>
            </CardContent>
          </Card>

          {/* Interactive Canvas & Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Canvas Preview */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="overflow-hidden border-primary/20 shadow-md">
                <CardHeader className="bg-muted/40 p-4 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" /> Draw or Adjust Watermark Box
                  </CardTitle>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Box: {box.x}, {box.y} ({box.w}x{box.h})
                  </span>
                </CardHeader>
                <CardContent className="p-3 bg-black/95 flex flex-col items-center justify-center">
                  <div className="relative w-full overflow-hidden rounded-lg flex items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handlePointerDown}
                      onMouseMove={handlePointerMove}
                      onMouseUp={handlePointerUp}
                      onTouchStart={handlePointerDown}
                      onTouchMove={handlePointerMove}
                      onTouchEnd={handlePointerUp}
                      className="max-h-[500px] w-full object-contain cursor-crosshair rounded touch-none"
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 text-center">
                    Click & drag directly on the video to select any watermark, or drag the box to reposition.
                  </p>
                </CardContent>
              </Card>

              {/* Timeline Preview Scrubber */}
              <Card className="p-4 bg-muted/20">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="font-bold flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5 text-primary" /> Frame Preview Time:
                    </Label>
                    <span className="font-mono text-primary font-bold">{previewTime.toFixed(1)}s</span>
                  </div>
                  <Slider
                    value={[previewTime]}
                    min={0}
                    max={meta?.duration || 10}
                    step={0.1}
                    onValueChange={(val) => setPreviewTime(val[0])}
                    className="py-1"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-muted-foreground self-center mr-1">Quick Scrub:</span>
                    {[0.5, 1.0, 2.0, (meta?.duration ? Math.round(meta.duration / 2) : 5)].map((sec) => (
                      <Button
                        key={sec}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => setPreviewTime(Math.min(sec, meta?.duration || 10))}
                      >
                        {sec}s
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Presets & Controls */}
            <div className="lg:col-span-5 space-y-4">
              {/* 1-Click AI Presets */}
              <Card>
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-500" /> 1-Click Presets
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pre-calibrated locations for AI video generators & logos
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={preset === 'veo-portrait' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs justify-start font-medium h-9"
                      onClick={() => handleSelectPreset('veo-portrait')}
                    >
                      Veo Portrait (9:16)
                    </Button>
                    <Button
                      type="button"
                      variant={preset === 'veo-landscape' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs justify-start font-medium h-9"
                      onClick={() => handleSelectPreset('veo-landscape')}
                    >
                      Veo Landscape (16:9)
                    </Button>
                    <Button
                      type="button"
                      variant={preset === 'bottom-right' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs justify-start font-medium h-9"
                      onClick={() => handleSelectPreset('bottom-right')}
                    >
                      Bottom-Right (Sora)
                    </Button>
                    <Button
                      type="button"
                      variant={preset === 'bottom-left' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs justify-start font-medium h-9"
                      onClick={() => handleSelectPreset('bottom-left')}
                    >
                      Bottom-Left Logo
                    </Button>
                    <Button
                      type="button"
                      variant={preset === 'top-right' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs justify-start font-medium h-9"
                      onClick={() => handleSelectPreset('top-right')}
                    >
                      Top-Right Corner
                    </Button>
                    <Button
                      type="button"
                      variant={preset === 'top-left' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs justify-start font-medium h-9"
                      onClick={() => handleSelectPreset('top-left')}
                    >
                      Top-Left Corner
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pixel Fine-Tuning */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold">Fine-Tune Coordinates (Pixels)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground font-bold">X Position (px)</Label>
                      <Input
                        type="number"
                        value={box.x}
                        onChange={(e) => updateBoxProperty('x', parseInt(e.target.value) || 0)}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground font-bold">Y Position (px)</Label>
                      <Input
                        type="number"
                        value={box.y}
                        onChange={(e) => updateBoxProperty('y', parseInt(e.target.value) || 0)}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground font-bold">Width (px)</Label>
                      <Input
                        type="number"
                        value={box.w}
                        onChange={(e) => updateBoxProperty('w', parseInt(e.target.value) || 10)}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground font-bold">Height (px)</Label>
                      <Input
                        type="number"
                        value={box.h}
                        onChange={(e) => updateBoxProperty('h', parseInt(e.target.value) || 10)}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Quality Mode */}
                  <div className="pt-2 border-t space-y-1.5">
                    <Label className="text-xs font-bold">Processing Speed</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={qualityPreset === 'fast' ? 'default' : 'outline'}
                        className="text-xs h-8"
                        onClick={() => setQualityPreset('fast')}
                      >
                        ⚡ Fast (Ultrafast)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={qualityPreset === 'high' ? 'default' : 'outline'}
                        className="text-xs h-8"
                        onClick={() => setQualityPreset('high')}
                      >
                        ✨ Crisp (High Quality)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Start Processing Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  size="lg"
                  className="w-full font-bold text-base h-12 shadow-lg gap-2"
                  onClick={handleRemoveWatermark}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" /> Processing Video ({progress}%)...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" /> Remove Watermark Now
                    </>
                  )}
                </Button>
              </div>

              {/* Live Progress Card */}
              {isLoading && (
                <Card className="border-primary/30 bg-primary/5 p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{statusText || 'Processing...'}</span>
                    <span className="font-mono text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2.5" />
                  <p className="text-[11px] text-muted-foreground text-center">
                    Please keep this tab open while your browser cleans the video frames.
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* STEP 3: Result & Download */}
          {resultUrl && (
            <Card className="border-2 border-green-500/30 bg-green-500/5 shadow-xl animate-in fade-in-50 duration-300">
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-lg">
                  <CheckCircle2 className="h-6 w-6" /> Watermark Successfully Removed!
                </div>
                <CardDescription>
                  Preview your clean video below and download it directly.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2 rounded-xl overflow-hidden border bg-black shadow-inner">
                    <video
                      src={resultUrl}
                      controls
                      className="w-full max-h-[380px] object-contain mx-auto"
                      autoPlay
                      loop
                    />
                  </div>

                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="space-y-2 bg-background p-4 rounded-xl border">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Original Size:</span>
                        <span className="font-mono font-bold">{meta && formatSize(meta.size)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Clean Video Size:</span>
                        <span className="font-mono font-bold text-green-600 dark:text-green-400">
                          {resultSize && formatSize(resultSize)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Audio Track:</span>
                        <span className="font-mono font-bold">Preserved (Original Quality)</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="lg"
                      className="w-full font-bold h-12 gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md"
                      onClick={handleDownload}
                    >
                      <Download className="h-5 w-5" /> Download Clean Video
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full font-semibold"
                      onClick={() => {
                        window.scrollTo({ top: 100, behavior: 'smooth' });
                      }}
                    >
                      Adjust Box & Re-process
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* SEO Guide & FAQ Section */}
      <div className="pt-8 space-y-6 border-t">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">How to Remove Watermarks from Videos Online</h2>
          <p className="text-sm text-muted-foreground">
            Follow these 4 simple steps to erase watermarks, AI logos, and channel badges from your videos without quality loss:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 space-y-2 bg-muted/20">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-sm">Upload Video</h3>
            <p className="text-xs text-muted-foreground">
              Select or drop your MP4, MOV, or WebM video file. Files under 250MB process fastest.
            </p>
          </Card>

          <Card className="p-4 space-y-2 bg-muted/20">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-sm">Pick AI Preset or Draw</h3>
            <p className="text-xs text-muted-foreground">
              Choose a 1-click preset (Veo, Sora) or click and drag a rectangle over any logo or timestamp.
            </p>
          </Card>

          <Card className="p-4 space-y-2 bg-muted/20">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-sm">In-Browser delogo</h3>
            <p className="text-xs text-muted-foreground">
              FFmpeg interpolates neighboring pixels to blend away the watermark while keeping video sharp.
            </p>
          </Card>

          <Card className="p-4 space-y-2 bg-muted/20">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-sm">Preview & Download</h3>
            <p className="text-xs text-muted-foreground">
              Watch your cleaned video in the browser player and download the MP4 file instantly.
            </p>
          </Card>
        </div>

        {/* FAQs */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 space-y-2">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-primary" /> How does it remove watermarks without blurring everything?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The tool uses the advanced FFmpeg edge-interpolation algorithm (delogo). Only the exact rectangular box you select is modified. It smoothly samples neighboring pixels from the border of the box to cover the watermark, leaving 100% of the surrounding video untouched in full original resolution.
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-primary" /> Are my videos uploaded to any server?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No! The entire video processing engine runs locally inside your browser via WebAssembly. Your video files are processed strictly in your device's memory and are never uploaded to any cloud server or third party.
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-primary" /> Does it work for Google Veo, Sora, and TikTok watermarks?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes! We have pre-calibrated buttons for Google Veo portrait (9:16) and landscape (16:9), as well as Sora corner watermarks. You can also drag the selection box over any custom timestamp, TikTok badge, or channel logo.
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-primary" /> Is this tool free to use?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes, it is 100% free with no subscriptions, no daily limits, and no watermark added to your output.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
