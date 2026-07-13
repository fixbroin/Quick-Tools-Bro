'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Palette, Sparkles, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ColorPickerPage() {
  const [color, setColor] = useState('#29abe2'); // default primary blue
  const [rgb, setRgb] = useState({ r: 41, g: 171, b: 226 });
  const [hsl, setHsl] = useState({ h: 197, s: 75, l: 52 });
  const { toast } = useToast();

  const hexToRgb = (hexStr: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hexStr.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    const toHex = (x: number) => {
      const hexVal = Math.round(x * 255).toString(16);
      return hexVal.length === 1 ? '0' + hexVal : hexVal;
    };
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  };

  useEffect(() => {
    const computedRgb = hexToRgb(color);
    const computedHsl = rgbToHsl(computedRgb.r, computedRgb.g, computedRgb.b);
    setRgb(computedRgb);
    setHsl(computedHsl);
  }, [color]);

  const updateHsl = (h: number, s: number, l: number) => {
    const newHex = hslToHex(h, s, l);
    setColor(newHex);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Color Copied!', description: `"${text}" copied to clipboard.` });
  };

  // Harmonious Schemes
  const getComplementary = () => {
    const h = (hsl.h + 180) % 360;
    return hslToHex(h, hsl.s, hsl.l);
  };

  const getAnalogous = () => {
    const h1 = (hsl.h - 30 + 360) % 360;
    const h2 = (hsl.h + 30) % 360;
    return [hslToHex(h1, hsl.s, hsl.l), hslToHex(h2, hsl.s, hsl.l)];
  };

  const getTriadic = () => {
    const h1 = (hsl.h + 120) % 360;
    const h2 = (hsl.h + 240) % 360;
    return [hslToHex(h1, hsl.s, hsl.l), hslToHex(h2, hsl.s, hsl.l)];
  };

  // WCAG Contrast ratio (against white and black)
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (lum1: number, lum2: number) => {
    const l1 = Math.max(lum1, lum2);
    const l2 = Math.min(lum1, lum2);
    return (l1 + 0.05) / (l2 + 0.05);
  };

  const lumColor = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastWhite = getContrastRatio(lumColor, 1.0); // white is 1.0
  const contrastBlack = getContrastRatio(lumColor, 0.0); // black is 0.0

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Color picker box */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Palette className="h-6 w-6 text-primary" /> COLOR PICKER
              </CardTitle>
              <CardDescription>Select colors visually and extract HSL, RGB, HEX, plus standard palette coordinates.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative h-32 w-32 rounded-2xl overflow-hidden shadow border flex items-center justify-center shrink-0">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                  />
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-2 text-center font-bold text-white shadow-inner uppercase tracking-wider drop-shadow-md text-[10px]"
                    style={{ backgroundColor: color }}
                  >
                    <span>Click Box for</span>
                    <span className="text-[9px] opacity-90 mt-0.5">System Picker</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div className="flex gap-2 items-center">
                    <Label className="w-14 text-xs font-bold uppercase tracking-wider">HEX</Label>
                    <Input value={color} onChange={(e) => setColor(e.target.value)} className="font-mono text-sm" />
                    <Button size="icon" variant="ghost" onClick={() => handleCopy(color)} className="h-9 w-9 rounded-lg"><Copy className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Label className="w-14 text-xs font-bold uppercase tracking-wider">RGB</Label>
                    <Input readOnly value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} className="font-mono text-sm" />
                    <Button size="icon" variant="ghost" onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="h-9 w-9 rounded-lg"><Copy className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Label className="w-14 text-xs font-bold uppercase tracking-wider">HSL</Label>
                    <Input readOnly value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} className="font-mono text-sm" />
                    <Button size="icon" variant="ghost" onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="h-9 w-9 rounded-lg"><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>

              {/* Custom Sliders for Hue, Saturation, Lightness */}
              <div className="space-y-4 pt-4 border-t border-muted">
                <style>{`
                  .color-slider::-webkit-slider-thumb {
                    border: 2px solid white !important;
                    height: 18px !important;
                    width: 18px !important;
                    border-radius: 50% !important;
                    background: #0f172a !important;
                    cursor: pointer !important;
                    -webkit-appearance: none !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
                  }
                  .color-slider::-moz-range-thumb {
                    border: 2px solid white !important;
                    height: 18px !important;
                    width: 18px !important;
                    border-radius: 50% !important;
                    background: #0f172a !important;
                    cursor: pointer !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
                  }
                `}</style>
                <Label className="text-xs font-bold uppercase tracking-wider block text-muted-foreground">Adjust Color (HSL)</Label>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Hue: {hsl.h}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => updateHsl(parseInt(e.target.value, 10), hsl.s, hsl.l)}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer color-slider"
                    style={{
                      background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Saturation: {hsl.s}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => updateHsl(hsl.h, parseInt(e.target.value, 10), hsl.l)}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer color-slider"
                    style={{
                      background: `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Lightness: {hsl.l}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => updateHsl(hsl.h, hsl.s, parseInt(e.target.value, 10))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer color-slider"
                    style={{
                      background: `linear-gradient(to right, #000000, hsl(${hsl.h}, ${hsl.s}%, 50%), #ffffff)`
                    }}
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Harmonies & contrast checks */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground flex items-center justify-center gap-1"><Sparkles className="h-4 w-4 text-primary" /> Schemes & WCAG</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider block">Harmonious Colors</Label>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Complementary:</span>
                    <button
                      onClick={() => setColor(getComplementary())}
                      className="h-6 w-16 rounded border shadow-sm"
                      style={{ backgroundColor: getComplementary() }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Analogous:</span>
                    <div className="flex gap-1">
                      {getAnalogous().map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className="h-6 w-8 rounded border shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Triadic:</span>
                    <div className="flex gap-1">
                      {getTriadic().map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className="h-6 w-8 rounded border shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label className="text-xs font-bold uppercase tracking-wider block">WCAG Contrast compliance</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/20 p-3 border rounded-xl text-center space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">On White (#FFF)</p>
                    <p className="text-md font-black">{contrastWhite.toFixed(1)}:1</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${contrastWhite >= 4.5 ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                      {contrastWhite >= 4.5 ? 'Pass (AA)' : 'Fail'}
                    </span>
                  </div>
                  
                  <div className="bg-muted/20 p-3 border rounded-xl text-center space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">On Black (#000)</p>
                    <p className="text-md font-black">{contrastBlack.toFixed(1)}:1</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${contrastBlack >= 4.5 ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                      {contrastBlack >= 4.5 ? 'Pass (AA)' : 'Fail'}
                    </span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Color Picker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Color Picker is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Pick colors, convert values, and check WCAG contrast.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Color Picker tool on UseBro.</li>
                        <li>Input your parameters or upload the required file in the field controls.</li>
                        <li>Wait for the tool to process the details dynamically in your browser.</li>
                        <li>Click download, save, or copy the final outputs to your device.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the Color Picker tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Color Picker upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Color Picker on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
