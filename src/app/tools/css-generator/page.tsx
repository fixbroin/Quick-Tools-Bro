'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Code, Sparkles, RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function CSSGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'shadow' | 'border' | 'gradient'>('shadow');
  
  // Shadow state
  const [hOffset, setHOffset] = useState<number>(10);
  const [vOffset, setVOffset] = useState<number>(10);
  const [blur, setBlur] = useState<number>(15);
  const [spread, setSpread] = useState<number>(0);
  const [shadowColor, setShadowColor] = useState<string>('rgba(0, 0, 0, 0.3)');
  const [inset, setInset] = useState<boolean>(false);

  // Border state
  const [radius, setRadius] = useState<number>(16);

  // Gradient state
  const [angle, setAngle] = useState<number>(135);
  const [color1, setColor1] = useState<string>('#29abe2'); // primary blue
  const [color2, setColor2] = useState<string>('#1565c0'); // deep blue

  const { toast } = useToast();

  const getCSS = () => {
    if (activeTab === 'shadow') {
      return `box-shadow: ${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${shadowColor};`;
    } else if (activeTab === 'border') {
      return `border-radius: ${radius}px;`;
    } else {
      return `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;
    }
  };

  const getPreviewStyles = () => {
    if (activeTab === 'shadow') {
      return {
        boxShadow: `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${shadowColor}`,
        backgroundColor: '#ffffff',
      };
    } else if (activeTab === 'border') {
      return {
        borderRadius: `${radius}px`,
        backgroundColor: '#29abe2',
      };
    } else {
      return {
        background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
      };
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCSS());
    toast({ title: 'CSS Code Copied!' });
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor controls */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Code className="h-6 w-6 text-primary" /> CSS STYLES GENERATOR
              </CardTitle>
              <CardDescription>Adjust styles visually and copy responsive CSS codes client-side.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              
              <Tabs defaultValue="shadow" onValueChange={(val: any) => setActiveTab(val)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-xl mb-6">
                  <TabsTrigger value="shadow" className="rounded-lg text-xs font-bold">Box Shadow</TabsTrigger>
                  <TabsTrigger value="border" className="rounded-lg text-xs font-bold">Border Radius</TabsTrigger>
                  <TabsTrigger value="gradient" className="rounded-lg text-xs font-bold">CSS Gradients</TabsTrigger>
                </TabsList>
                
                <TabsContent value="shadow" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Horizontal Offset</span>
                      <span>{hOffset}px</span>
                    </div>
                    <Slider value={[hOffset]} onValueChange={(val) => setHOffset(val[0])} min={-50} max={50} step={1} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Vertical Offset</span>
                      <span>{vOffset}px</span>
                    </div>
                    <Slider value={[vOffset]} onValueChange={(val) => setVOffset(val[0])} min={-50} max={50} step={1} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Blur Radius</span>
                      <span>{blur}px</span>
                    </div>
                    <Slider value={[blur]} onValueChange={(val) => setBlur(val[0])} min={0} max={80} step={1} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Spread Radius</span>
                      <span>{spread}px</span>
                    </div>
                    <Slider value={[spread]} onValueChange={(val) => setSpread(val[0])} min={-20} max={40} step={1} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="shadowcolor" className="text-xs font-bold uppercase tracking-wider">Shadow Color</Label>
                      <Input id="shadowcolor" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="rounded-xl font-mono text-xs" />
                    </div>
                    <div className="flex items-center justify-between pt-6">
                      <Label htmlFor="inset" className="text-sm font-semibold cursor-pointer">Inset Shadow</Label>
                      <Switch id="inset" checked={inset} onCheckedChange={setInset} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="border" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Border Radius</span>
                      <span>{radius}px</span>
                    </div>
                    <Slider value={[radius]} onValueChange={(val) => setRadius(val[0])} min={0} max={150} step={1} />
                  </div>
                </TabsContent>

                <TabsContent value="gradient" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Gradient Angle</span>
                      <span>{angle}°</span>
                    </div>
                    <Slider value={[angle]} onValueChange={(val) => setAngle(val[0])} min={0} max={360} step={5} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="color1" className="text-xs font-bold uppercase tracking-wider">Start Color</Label>
                      <div className="flex gap-2">
                        <Input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-12 h-10 p-0 border rounded-xl" />
                        <Input id="color1" value={color1} onChange={(e) => setColor1(e.target.value)} className="rounded-xl font-mono text-xs" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color2" className="text-xs font-bold uppercase tracking-wider">End Color</Label>
                      <div className="flex gap-2">
                        <Input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-12 h-10 p-0 border rounded-xl" />
                        <Input id="color2" value={color2} onChange={(e) => setColor2(e.target.value)} className="rounded-xl font-mono text-xs" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

            </CardContent>
          </Card>
        </div>

        {/* Live Preview & Code */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Preview & Code</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col justify-between space-y-6 min-h-[350px]">
              
              {/* Preview Box */}
              <div className="flex-1 flex items-center justify-center p-10 bg-muted/10 border rounded-2xl">
                <div
                  className="w-40 h-40 border border-primary/15 transition-all duration-300 flex items-center justify-center font-bold text-center text-xs text-muted-foreground uppercase"
                  style={getPreviewStyles()}
                >
                  {activeTab !== 'shadow' ? '' : 'Live Preview'}
                </div>
              </div>

              {/* Code display */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider block">Generated CSS</Label>
                  <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 rounded-lg text-xs"><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
                </div>
                <div className="font-mono text-xs p-3 border rounded-xl bg-muted/15 select-all">
                  {getCSS()}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our CSS Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our CSS Generator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Visually generate shadows, borders, and gradients.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the CSS Generator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the CSS Generator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this CSS Generator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use CSS Generator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
