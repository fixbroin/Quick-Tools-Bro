
'use client';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Download, Loader2, Pipette } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';

export default function ImageResizerPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [lastChanged, setLastChanged] = useState<'width' | 'height' | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fitMode, setFitMode] = useState<'stretch' | 'manual'>('stretch');
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [restrictBoundaries, setRestrictBoundaries] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const { toast } = useToast();

  const cropBoxRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number, y: number } | null>(null);
  const dragOffsetStart = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStartDist = useRef<number | null>(null);
  const touchStartZoom = useRef<number>(1);

  const getPanLimits = useCallback(() => {
    if (!originalDimensions || !width || !height) return { x: 100, y: 100 };
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);
    if (isNaN(numericWidth) || isNaN(numericHeight) || numericWidth <= 0 || numericHeight <= 0) {
      return { x: 100, y: 100 };
    }

    const R_i = originalDimensions.width / originalDimensions.height;
    const R_c = numericWidth / numericHeight;

    const K_x = Math.max(1, R_i / R_c);
    const K_y = Math.max(1, R_c / R_i);

    return {
      x: ((K_x * zoom - 1) / 2) * 100,
      y: ((K_y * zoom - 1) / 2) * 100
    };
  }, [originalDimensions, width, height, zoom]);

  const handleDoubleClick = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const minZoom = restrictBoundaries ? 1.0 : 0.1;
    const zoomFactor = e.deltaY < 0 ? 0.05 : -0.05;
    setZoom(prev => Math.min(3.0, Math.max(minZoom, prev + zoomFactor)));
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    dragStart.current = { x: clientX, y: clientY };
    dragOffsetStart.current = { x: panX, y: panY };
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragStart.current || !cropBoxRef.current) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;

    const rect = cropBoxRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const pctX = (dx / rect.width) * 100;
    const pctY = (dy / rect.height) * 100;

    let newPanX = dragOffsetStart.current.x + pctX;
    let newPanY = dragOffsetStart.current.y + pctY;

    if (restrictBoundaries) {
      const limits = getPanLimits();
      newPanX = Math.max(-limits.x, Math.min(limits.x, newPanX));
      newPanY = Math.max(-limits.y, Math.min(limits.y, newPanY));
    } else {
      newPanX = Math.max(-100, Math.min(100, newPanX));
      newPanY = Math.max(-100, Math.min(100, newPanY));
    }

    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleDragEnd = () => {
    dragStart.current = null;
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      dragStart.current = null;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDist.current = dist;
      touchStartZoom.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && dragStart.current) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && touchStartDist.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const minZoom = restrictBoundaries ? 1.0 : 0.1;
      const scale = dist / touchStartDist.current;
      setZoom(Math.min(3.0, Math.max(minZoom, touchStartZoom.current * scale)));
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
    touchStartDist.current = null;
  };

  const cropBoxSize = useMemo(() => {
    if (!originalDimensions || !width || !height) return { width: '100%', height: '100%', top: '0%', left: '0%' };
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);
    if (isNaN(numericWidth) || isNaN(numericHeight) || numericWidth <= 0 || numericHeight <= 0) {
      return { width: '100%', height: '100%', top: '0%', left: '0%' };
    }

    const R_i = originalDimensions.width / originalDimensions.height;
    const R_c = numericWidth / numericHeight;

    if (R_c > R_i) {
      // Crop is wider than image (fits width, letterboxes height)
      return {
        width: '100%',
        height: `${(R_i / R_c) * 100}%`,
        top: `${((1 - R_i / R_c) / 2) * 100}%`,
        left: '0%'
      };
    } else {
      // Crop is taller than image (fits height, pillarboxes width)
      return {
        width: `${(R_c / R_i) * 100}%`,
        height: '100%',
        left: `${((1 - R_c / R_i) / 2) * 100}%`,
        top: '0%'
      };
    }
  }, [originalDimensions, width, height]);

  const clampedPan = useMemo(() => {
    if (!originalDimensions || !width || !height) return { x: panX, y: panY };
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);
    if (isNaN(numericWidth) || isNaN(numericHeight) || numericWidth <= 0 || numericHeight <= 0) {
      return { x: panX, y: panY };
    }

    const R_i = originalDimensions.width / originalDimensions.height;
    const R_c = numericWidth / numericHeight;

    const K_x = Math.max(1, R_i / R_c);
    const K_y = Math.max(1, R_c / R_i);

    const maxPanX = ((K_x * zoom - 1) / 2) * 100;
    const maxPanY = ((K_y * zoom - 1) / 2) * 100;

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, panX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, panY))
    };
  }, [originalDimensions, width, height, zoom, panX, panY]);

  const cropImageStyle = useMemo(() => {
    if (!originalDimensions || !width || !height) return {};
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);
    if (isNaN(numericWidth) || isNaN(numericHeight) || numericWidth <= 0 || numericHeight <= 0) return {};

    const R_i = originalDimensions.width / originalDimensions.height;
    const R_c = numericWidth / numericHeight;

    const K_x = Math.max(1, R_i / R_c);
    const K_y = Math.max(1, R_c / R_i);

    const activePanX = restrictBoundaries ? clampedPan.x : panX;
    const activePanY = restrictBoundaries ? clampedPan.y : panY;

    const tx = activePanX / (K_x * zoom);
    const ty = activePanY / (K_y * zoom);

    return {
      width: `${K_x * zoom * 100}%`,
      height: `${K_y * zoom * 100}%`,
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) translate(${tx}%, ${ty}%)`
    };
  }, [originalDimensions, width, height, zoom, clampedPan, panX, panY, restrictBoundaries]);

  const handlePickColor = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        setBackgroundColor(result.sRGBHex);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: 'Please upload an image file.', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(String(img.width));
          setHeight(String(img.height));
          setLastChanged(null);
          setFitMode('stretch');
          setZoom(1);
          setPanX(0);
          setPanY(0);
        };
        img.src = e.target?.result as string;
        setOriginalUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setOriginalFile(file);
      setResizedUrl(null);
    }
  };

  useEffect(() => {
    if (!lockAspectRatio || !originalDimensions || !lastChanged) return;

    const newWidth = parseInt(width, 10);
    const newHeight = parseInt(height, 10);
    const aspectRatio = originalDimensions.width / originalDimensions.height;

    if (lastChanged === 'width' && !isNaN(newWidth)) {
      setHeight(String(Math.round(newWidth / aspectRatio)));
    } else if (lastChanged === 'height' && !isNaN(newHeight)) {
      setWidth(String(Math.round(newHeight * aspectRatio)));
    }
  }, [width, height, lockAspectRatio, originalDimensions, lastChanged]);


  const handleResize = useCallback(() => {
    if (!originalFile || !originalUrl) return;
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);

    if (isNaN(numericWidth) || isNaN(numericHeight) || numericWidth <= 0 || numericHeight <= 0) {
        toast({ title: 'Invalid dimensions', description: 'Width and height must be positive numbers.', variant: 'destructive' });
        return;
    }

    setIsLoading(true);
    setResizedUrl(null);

    new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.src = originalUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = numericWidth;
            canvas.height = numericHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.imageSmoothingQuality = "high";
                
                if (!lockAspectRatio && fitMode === 'manual') {
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, numericWidth, numericHeight);
                    
                    const fillScale = Math.max(numericWidth / img.width, numericHeight / img.height);
                    const drawWidth = img.width * fillScale * zoom;
                    const drawHeight = img.height * fillScale * zoom;
                    
                    const defaultX = (numericWidth - drawWidth) / 2;
                    const defaultY = (numericHeight - drawHeight) / 2;
                    
                    const activePanX = restrictBoundaries ? clampedPan.x : panX;
                    const activePanY = restrictBoundaries ? clampedPan.y : panY;
                    
                    const x = defaultX + (activePanX / 100) * numericWidth;
                    const y = defaultY + (activePanY / 100) * numericHeight;
                    
                    ctx.drawImage(img, x, y, drawWidth, drawHeight);
                } else {
                    ctx.drawImage(img, 0, 0, numericWidth, numericHeight);
                }
                
                const dataUrl = canvas.toDataURL(originalFile.type);
                resolve(dataUrl);
            } else {
                reject(new Error('Could not get canvas context.'));
            }
        };
        img.onerror = () => {
            reject(new Error('Error loading image'));
        };
    }).then(dataUrl => {
        setResizedUrl(dataUrl);
        scrollToDownload();
    }).catch(error => {
        toast({ title: error.message, variant: 'destructive' });
    }).finally(() => {
        setIsLoading(false);
    });
  }, [originalFile, originalUrl, width, height, lockAspectRatio, fitMode, zoom, clampedPan, panX, panY, restrictBoundaries, backgroundColor, toast]);

  // Auto-update preview when size, mode, or crop sliders change
  useEffect(() => {
    if (!originalFile || !originalUrl) return;
    
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);
    if (isNaN(numericWidth) || isNaN(numericHeight) || numericWidth <= 0 || numericHeight <= 0) return;

    const img = new window.Image();
    img.src = originalUrl;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = numericWidth;
        canvas.height = numericHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingQuality = "high";
            if (lockAspectRatio || fitMode === 'stretch') {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, numericWidth, numericHeight);
                ctx.drawImage(img, 0, 0, numericWidth, numericHeight);
            } else {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, numericWidth, numericHeight);
                
                const fillScale = Math.max(numericWidth / img.width, numericHeight / img.height);
                const drawWidth = img.width * fillScale * zoom;
                const drawHeight = img.height * fillScale * zoom;
                
                const defaultX = (numericWidth - drawWidth) / 2;
                const defaultY = (numericHeight - drawHeight) / 2;
                
                const activePanX = restrictBoundaries ? clampedPan.x : panX;
                const activePanY = restrictBoundaries ? clampedPan.y : panY;
                
                const x = defaultX + (activePanX / 100) * numericWidth;
                const y = defaultY + (activePanY / 100) * numericHeight;
                
                ctx.drawImage(img, x, y, drawWidth, drawHeight);
            }
            setResizedUrl(canvas.toDataURL(originalFile.type));
        }
    };
  }, [zoom, clampedPan, panX, panY, restrictBoundaries, backgroundColor, fitMode, width, height, lockAspectRatio, originalFile, originalUrl]);

  // Import useMemo if not already imported
  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Image Resizer</CardTitle>
        <CardDescription>Change the dimensions of your images. Adjust width and height as needed.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 order-2 md:order-1">
                 <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload Image</Label>
                    <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                {originalUrl && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input id="width" type="number" value={width} onChange={(e) => { setWidth(e.target.value); setLastChanged('width'); }} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input id="height" type="number" value={height} onChange={(e) => { setHeight(e.target.value); setLastChanged('height'); }} />
                    </div>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Checkbox id="aspect-ratio" checked={lockAspectRatio} onCheckedChange={(checked) => setLockAspectRatio(Boolean(checked))} />
                    <Label htmlFor="aspect-ratio">Lock aspect ratio</Label>
                    </div>

                    {!lockAspectRatio && (
                      <div className="space-y-4 pt-4 border-t border-border/60">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold">Fitting Option</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              type="button"
                              variant={fitMode === 'stretch' ? 'default' : 'outline'}
                              onClick={() => setFitMode('stretch')}
                              className="rounded-xl font-semibold text-xs py-3 h-auto"
                            >
                              Stretch & Shrink
                            </Button>
                            <Button
                              type="button"
                              variant={fitMode === 'manual' ? 'default' : 'outline'}
                              onClick={() => setFitMode('manual')}
                              className="rounded-xl font-semibold text-xs py-3 h-auto"
                            >
                              Crop & Position (Manual)
                            </Button>
                          </div>
                        </div>

                        {fitMode === 'manual' && (
                          <div className="p-2 rounded-2xl bg-slate-500/5 border border-border/50 space-y-4">
                            <p className="text-[10px] text-muted-foreground leading-normal">
                              Adjust the sliders or use the buttons below to zoom, pan, and align the image inside your target dimensions without stretching it.
                            </p>

                            {/* Boundary Constraints Toggle */}
                            <div className="flex items-center space-x-2 pt-1">
                              <Checkbox 
                                id="restrict-boundaries" 
                                checked={restrictBoundaries} 
                                onCheckedChange={(checked) => {
                                  const isChecked = Boolean(checked);
                                  setRestrictBoundaries(isChecked);
                                  if (isChecked) {
                                    setZoom(prev => Math.max(1.0, prev));
                                  }
                                }} 
                              />
                              <Label htmlFor="restrict-boundaries" className="text-xs font-medium cursor-pointer">
                                Restrict to image boundaries (No gaps)
                              </Label>
                            </div>

                            {/* Background Color Option */}
                            {!restrictBoundaries && (
                              <div className="space-y-2 pt-2 border-t border-border/40">
                                <Label className="text-xs font-semibold text-foreground/80 block font-sans">Background Color (fills empty space)</Label>
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1 flex items-center space-x-1.5 bg-background border border-input rounded-xl px-3 py-1.5">
                                    <span className="text-[10px] font-bold text-muted-foreground">HEX:</span>
                                    <input 
                                      type="text" 
                                      value={backgroundColor} 
                                      onChange={(e) => setBackgroundColor(e.target.value)} 
                                      className="flex-1 bg-transparent border-0 outline-none text-xs font-mono p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                                      placeholder="#ffffff"
                                    />
                                  </div>
                                  <input 
                                    type="color" 
                                    value={backgroundColor.startsWith('#') && backgroundColor.length === 7 ? backgroundColor : '#ffffff'} 
                                    onChange={(e) => setBackgroundColor(e.target.value)} 
                                    className="w-9 h-9 p-0 rounded-xl border border-input cursor-pointer shrink-0 overflow-hidden" 
                                  />
                                  {typeof window !== 'undefined' && 'EyeDropper' in window && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={handlePickColor}
                                      className="w-9 h-9 rounded-xl shrink-0"
                                      title="Pick color from screen"
                                    >
                                      <Pipette className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Zoom Slider */}
                            <div className="space-y-1.5 pt-2 border-t border-border/40">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-foreground/80">Zoom Scale</span>
                                <span className="font-mono text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">{Math.round(zoom * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min={restrictBoundaries ? "1.0" : "0.1"}
                                max="3.0"
                                step="0.05"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>

                            {/* Pan X Slider */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-foreground/80">Pan Horizontal (X)</span>
                                <span className="font-mono text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">{panX > 0 ? `+${panX}` : panX}%</span>
                              </div>
                              <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                value={panX}
                                onChange={(e) => setPanX(parseInt(e.target.value, 10))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>

                            {/* Pan Y Slider */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-foreground/80">Pan Vertical (Y)</span>
                                <span className="font-mono text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">{panY > 0 ? `+${panY}` : panY}%</span>
                              </div>
                              <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                value={panY}
                                onChange={(e) => setPanY(parseInt(e.target.value, 10))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>

                          </div>
                        )}
                      </div>
                    )}

                    <Button onClick={handleResize} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Resize Image
                    </Button>
                </div>
                )}
            </div>
            <div className="space-y-4 order-1 md:order-2">
                 {originalUrl && (
                    <div className="space-y-2">
                    <Label>Original Preview</Label>
                    <div 
                      className="rounded-md border p-2 flex items-center justify-center bg-muted w-full max-h-[350px] overflow-hidden"
                      style={{ aspectRatio: `${originalDimensions?.width || 16} / ${originalDimensions?.height || 9}` }}
                    >
                        <img 
                          src={originalUrl || undefined} 
                          alt="Original Preview" 
                          className="max-w-full max-h-full h-auto w-auto rounded-md object-contain select-none pointer-events-none" 
                        />
                    </div>
                    </div>
                )}
                {resizedUrl && (
                    <div className="space-y-2">
                    <Label className="flex justify-between items-center w-full">
                      <span>Resized Preview</span>
                      {!lockAspectRatio && fitMode === 'manual' && (
                        <span className="text-[10px] text-primary font-bold px-2 py-0.5 rounded bg-primary/10 animate-pulse">
                          Crop Box Highlighted
                        </span>
                      )}
                    </Label>
                    
                     {!lockAspectRatio && fitMode === 'manual' ? (
                       /* Interactive Crop Overlay view (shows crop window over original image) */
                       <div className="space-y-3">
                         <div 
                           className="relative rounded-md border p-0 flex items-center justify-center bg-slate-950 w-full max-h-[350px] overflow-hidden"
                           style={{ aspectRatio: `${originalDimensions?.width || 16} / ${originalDimensions?.height || 9}` }}
                         >
                             {/* Centered crop window box (representing output canvas area) */}
                             <div 
                                ref={cropBoxRef}
                                className={`absolute border-2 border-white border-dashed overflow-hidden select-none touch-none ${
                                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                                }`}
                                style={{
                                  ...cropBoxSize,
                                  backgroundColor: backgroundColor
                                }}
                                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                                onMouseMove={(e) => {
                                  if (dragStart.current) {
                                    handleDragMove(e.clientX, e.clientY);
                                  }
                                }}
                                onMouseUp={handleDragEnd}
                                onMouseLeave={handleDragEnd}
                                onWheel={handleWheel}
                                onDoubleClick={handleDoubleClick}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                              >
                                {/* Bright original image inside crop window that scales and pans */}
                                <img
                                  src={originalUrl || undefined}
                                  alt="Crop Area Preview"
                                  className="absolute max-w-none select-none pointer-events-none transition-all duration-75"
                                  style={cropImageStyle}
                                />
                              </div>
                         </div>
                       </div>
                     ) : (
                       /* Standard resized output preview */
                       <div 
                         className="rounded-md border p-2 flex items-center justify-center bg-muted w-full max-h-[350px] overflow-hidden"
                         style={{ aspectRatio: `${parseInt(width, 10) || 1280} / ${parseInt(height, 10) || 720}` }}
                       >
                           {isLoading ? (
                           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                           ) : (
                           <Image src={resizedUrl} alt="Resized Preview" width={parseInt(width, 10) || 300} height={parseInt(height, 10) || 300} className="max-w-full max-h-full h-auto w-auto rounded-md object-contain" />
                           )}
                       </div>
                     )}
                    </div>
                )}
            </div>
        </div>
      </CardContent>
      {resizedUrl && !isLoading && originalFile && (
        <CardFooter id="download-section">
          <Button asChild>
            <a href={resizedUrl} download={`resized-${originalFile.name}`}>
              <Download className="mr-2 h-4 w-4" />
              Download Resized Image
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>

    <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Image Resizer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div>
                    <h3 className="text-xl font-bold mb-3">Maintain Quality</h3>
                    <p>Our tool uses advanced browser-side canvas rendering to ensure that your images remain as sharp as possible after resizing. Whether you're scaling down for the web or adjusting for social media, quality is our priority.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Aspect Ratio Lock</h3>
                    <p>Never worry about stretching or squishing your photos. With the "Lock Aspect Ratio" feature, your image's proportions are automatically preserved, so scaling the width will perfectly adjust the height.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Local Processing</h3>
                    <p>Privacy is key. Your images are processed entirely in your browser, meaning they never touch our servers. This also makes the process incredibly fast, regardless of your internet connection speed.</p>
                </div>
            </div>
        </div>
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Is this tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Absolutely! Our image resizer is completely free with no registration or subscription required. Resize as many images as you need.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">What image formats are supported?</h4>
                    <p className="text-muted-foreground text-sm">We support all standard web formats, including JPG, PNG, WebP, and BMP. The resized image will be exported in the same format as your original.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Can I resize to a specific file size?</h4>
                    <p className="text-muted-foreground text-sm">This tool focuses on pixel dimensions. If you need to reduce the file size (MB/KB), we recommend using our Image Compressor tool after resizing.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Will my original image be changed?</h4>
                    <p className="text-muted-foreground text-sm">No, the resizing happens in memory and a new file is created for you to download. Your original file remains untouched on your device.</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
