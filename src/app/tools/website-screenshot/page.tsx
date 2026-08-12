'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Globe, Monitor, Smartphone, Download, RotateCcw, 
  AlertCircle, Sparkles, Loader2, Info, Moon, Sun
} from 'lucide-react';
import ScrollToTop from '@/components/ScrollToTop';

interface Preset {
  name: string;
  width: number;
  height: number;
  label: string;
}

const DESKTOP_PRESETS: Preset[] = [
  { name: '1280x720', width: 1280, height: 720, label: 'CodeCanyon Landscape (16:9)' },
  { name: '590x300', width: 590, height: 300, label: 'Envato Main Thumbnail' },
  { name: '1920x1080', width: 1920, height: 1080, label: 'Full HD Desktop' },
];

const MOBILE_PRESETS: Preset[] = [
  { name: '393x700', width: 393, height: 700, label: 'CodeCanyon Mobile (9:16 approx)' },
  { name: '450x800', width: 450, height: 800, label: 'CodeCanyon Portrait' },
  { name: '506x900', width: 506, height: 900, label: 'CodeCanyon Portrait HD' },
  { name: '375x812', width: 375, height: 812, label: 'Standard Phone (iPhone X)' },
];

export default function WebsiteScreenshotPage() {
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('');

  const selectPreset = (preset: Preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const handleDeviceChange = (type: 'desktop' | 'mobile') => {
    setDevice(type);
    if (type === 'desktop') {
      setWidth(DESKTOP_PRESETS[0].width);
      setHeight(DESKTOP_PRESETS[0].height);
    } else {
      setWidth(MOBILE_PRESETS[0].width);
      setHeight(MOBILE_PRESETS[0].height);
    }
  };

  const captureScreenshot = async () => {
    if (!url) {
      setError('Please enter a valid website URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScreenshotUrl(null);
    
    // Simulate active steps for better UX
    setLoadingStep('Resolving website address...');
    await new Promise(r => setTimeout(r, 600));
    setLoadingStep('Launching headless Chromium renderer...');
    await new Promise(r => setTimeout(r, 600));
    setLoadingStep('Emulating device viewport parameters...');
    await new Promise(r => setTimeout(r, 600));
    setLoadingStep('Capturing visual viewport image...');

    try {
      const apiEndpoint = `/api/screenshot?url=${encodeURIComponent(url)}&width=${width}&height=${height}&isMobile=${device === 'mobile'}&colorScheme=${colorScheme}`;
      
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const imageBlob = await response.blob();
      const localImageUrl = URL.createObjectURL(imageBlob);
      setScreenshotUrl(localImageUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to capture screenshot. Please verify the URL and try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const downloadScreenshot = () => {
    if (!screenshotUrl) return;

    // Extract domain name for the filename
    let domain = 'website';
    try {
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      domain = new URL(cleanUrl).hostname.replace('www.', '');
    } catch (e) {}

    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = `${domain}_screenshot_${width}x${height}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearForm = () => {
    setUrl('');
    setScreenshotUrl(null);
    setError(null);
    if (device === 'desktop') {
      setWidth(DESKTOP_PRESETS[0].width);
      setHeight(DESKTOP_PRESETS[0].height);
    } else {
      setWidth(MOBILE_PRESETS[0].width);
      setHeight(MOBILE_PRESETS[0].height);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600/10 via-primary/5 to-purple-600/10 border border-primary/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-3 w-3" />
            CodeCanyon Specifications Compliant
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Website Screenshot Taker
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl">
            Enter any website URL, choose mobile/desktop viewports, and capture pixel-perfect preview images matching standard Envato asset specifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border-primary/5 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-primary" />
                Capture Parameters
              </CardTitle>
              <CardDescription className="text-xs">
                Configure your target website, device profiles, and resolutions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url" className="text-xs font-semibold">Website URL</Label>
                <div className="relative">
                  <Input
                    id="url"
                    type="text"
                    placeholder="e.g. google.com or github.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-9 pr-4 rounded-xl text-xs bg-slate-500/5 focus:bg-background border-primary/5"
                    disabled={isLoading}
                  />
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                </div>
              </div>

              {/* Device Selector Toggle */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Device Display Profile</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={device === 'desktop' ? 'default' : 'outline'}
                    onClick={() => handleDeviceChange('desktop')}
                    className="rounded-xl font-semibold text-xs py-5 gap-2"
                    disabled={isLoading}
                  >
                    <Monitor className="h-4 w-4" />
                    Desktop (16:9)
                  </Button>
                  <Button
                    type="button"
                    variant={device === 'mobile' ? 'default' : 'outline'}
                    onClick={() => handleDeviceChange('mobile')}
                    className="rounded-xl font-semibold text-xs py-5 gap-2"
                    disabled={isLoading}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile (Portrait)
                  </Button>
                </div>
              </div>

              {/* Resolution Presets */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Size Presets</Label>
                <div className="flex flex-wrap gap-1.5">
                  {(device === 'desktop' ? DESKTOP_PRESETS : MOBILE_PRESETS).map((preset) => {
                    const isActive = width === preset.width && height === preset.height;
                    return (
                      <Button
                        key={preset.name}
                        type="button"
                        variant={isActive ? 'secondary' : 'outline'}
                        onClick={() => selectPreset(preset)}
                        className={`rounded-xl text-[10px] py-1.5 h-auto font-medium ${
                          isActive ? 'border-primary/40 bg-primary/5 text-primary' : ''
                        }`}
                        disabled={isLoading}
                      >
                        {preset.name} ({preset.width > 1000 ? '16:9' : 'Portrait'})
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Viewport Size */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="width" className="text-[10px] font-semibold">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="rounded-xl text-xs bg-slate-500/5 border-primary/5"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="height" className="text-[10px] font-semibold">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="rounded-xl text-xs bg-slate-500/5 border-primary/5"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Color Scheme Option */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Target Website Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={colorScheme === 'light' ? 'secondary' : 'outline'}
                    onClick={() => setColorScheme('light')}
                    className="rounded-xl font-semibold text-xs py-4 gap-1.5"
                    disabled={isLoading}
                  >
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                    Light Theme
                  </Button>
                  <Button
                    type="button"
                    variant={colorScheme === 'dark' ? 'secondary' : 'outline'}
                    onClick={() => setColorScheme('dark')}
                    className="rounded-xl font-semibold text-xs py-4 gap-1.5"
                    disabled={isLoading}
                  >
                    <Moon className="h-3.5 w-3.5 text-indigo-500" />
                    Dark Theme
                  </Button>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-12 gap-2 pt-2">
                <Button
                  onClick={captureScreenshot}
                  disabled={isLoading}
                  className="col-span-8 rounded-xl font-black text-xs py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/10"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Capturing...
                    </>
                  ) : (
                    'Capture Screenshot'
                  )}
                </Button>
                <Button
                  onClick={clearForm}
                  disabled={isLoading}
                  variant="outline"
                  className="col-span-4 rounded-xl font-semibold text-xs py-5 border-primary/5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/10"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </Button>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/15 text-destructive text-[11px] leading-relaxed">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Frame Mockup */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start space-y-4">
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-primary" />
              Live Visual Preview Frame
            </span>
            {screenshotUrl && (
              <Button
                onClick={downloadScreenshot}
                className="rounded-xl font-black text-xs gap-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/10"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </Button>
            )}
          </div>

          <div className="w-full flex items-center justify-center p-4 bg-slate-500/5 border border-primary/5 rounded-3xl min-h-[350px] md:min-h-[480px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-3.5 py-12">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-foreground">Rendering Viewport Capture</p>
                  <p className="text-[10px] text-muted-foreground animate-pulse">{loadingStep}</p>
                </div>
              </div>
            ) : screenshotUrl ? (
              /* Display actual device frames matching choice */
              device === 'desktop' ? (
                /* Laptop/Desktop Preview Frame */
                <div className="w-full max-w-2xl bg-slate-900 rounded-2xl p-2 shadow-2xl border border-slate-700/50 flex flex-col space-y-2">
                  <div className="flex items-center gap-1.5 px-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <div className="h-5 bg-slate-800 rounded-md w-full max-w-[200px] mx-auto text-[9px] text-slate-400 flex items-center justify-center truncate px-2 font-mono">
                      {url}
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-lg bg-card border border-slate-800/80 max-h-[320px] md:max-h-[400px]">
                    <img 
                      src={screenshotUrl} 
                      alt="Website Screenshot Landscape" 
                      className="w-full h-auto object-contain block" 
                    />
                  </div>
                </div>
              ) : (
                /* Smartphone Preview Frame */
                <div className="relative w-full max-w-[260px] bg-slate-950 rounded-[36px] p-3 shadow-2xl border-4 border-slate-800/80 flex flex-col ring-4 ring-slate-900/35 overflow-hidden">
                  {/* Camera Punchhole */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-12 bg-slate-950 rounded-full z-20 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-950/80" />
                  </div>
                  <div className="relative overflow-hidden rounded-[26px] bg-card border border-slate-900/80 max-h-[420px] md:max-h-[480px]">
                    <img 
                      src={screenshotUrl} 
                      alt="Website Screenshot Portrait" 
                      className="w-full h-auto object-contain block" 
                    />
                  </div>
                </div>
              )
            ) : (
              /* Placeholder mockup frames based on device choice */
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-sm">
                <div className="relative flex items-center justify-center bg-card border border-primary/5 rounded-3xl h-24 w-24 shadow-sm text-muted-foreground/40">
                  {device === 'desktop' ? (
                    <Monitor className="h-12 w-12 stroke-[1.2]" />
                  ) : (
                    <Smartphone className="h-12 w-12 stroke-[1.2]" />
                  )}
                  <Globe className="absolute -bottom-1 -right-1 h-7 w-7 stroke-[1.5] text-primary bg-background border border-primary/5 rounded-full p-1.5 shadow-sm" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-foreground">Awaiting Capture Parameters</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Provide a website URL and click the capture button to generate a custom {device} format preview screenshot.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}
