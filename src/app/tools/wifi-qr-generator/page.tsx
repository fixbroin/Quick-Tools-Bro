
'use client';
import { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Wifi, Lock, ShieldCheck, Eye, EyeOff, Share2, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { scrollToDownload } from '@/lib/utils';

export default function WiFiQRPage() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [qrValue, setQrValue] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generateValue = () => {
    if (!ssid) return;
    // Format: WIFI:S:SSID;T:WPA;P:PASSWORD;H:true;;
    const value = `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};;`;
    setQrValue(value);
    scrollToDownload();
  };

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `wifi-qr-${ssid}.png`;
      a.click();
      toast({ title: "QR Code Downloaded!" });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 🛠 Left: Settings */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="flex items-center gap-2"><Wifi className="h-5 w-5 text-primary" /> Network Details</CardTitle>
            <CardDescription>Enter your WiFi details to generate a shareable QR code.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="ssid">Network Name (SSID)</Label>
                    <Input id="ssid" placeholder="e.g. My Home WiFi" value={ssid} onChange={(e) => setSsid(e.target.value)} className="rounded-xl" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="WiFi Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="rounded-xl pr-10" 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Encryption Type</Label>
                        <Select value={encryption} onValueChange={setEncryption}>
                            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="WPA">WPA/WPA2 (Default)</SelectItem>
                                <SelectItem value="WEP">WEP</SelectItem>
                                <SelectItem value="nopass">None (Open)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
                        <div className="space-y-0.5">
                            <Label className="text-sm">Hidden Network</Label>
                            <p className="text-[10px] text-muted-foreground italic">Is the SSID hidden?</p>
                        </div>
                        <Switch checked={hidden} onCheckedChange={setHidden} />
                    </div>
                </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 p-6">
            <Button onClick={generateValue} className="w-full h-14 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/20" disabled={!ssid}>
                GENERATE QR CODE <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>

        {/* 🖥 Right: Live Preview */}
        <Card className="shadow-lg border-primary/10 overflow-hidden">
            <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Live Print Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-10 flex flex-col items-center justify-center min-h-[400px]">
                {qrValue ? (
                    <div id="download-section" className="space-y-8 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                        <div className="p-8 bg-white rounded-[2rem] shadow-2xl border-8 border-primary/10 relative">
                            <QRCodeCanvas 
                                value={qrValue} 
                                size={256} 
                                level="H"
                                includeMargin={true}
                                imageSettings={{
                                    src: "/android-chrome-192x192.png",
                                    x: undefined,
                                    y: undefined,
                                    height: 48,
                                    width: 48,
                                    excavate: true,
                                }}
                            />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">Scan Me</div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-black italic text-2xl uppercase tracking-tighter">{ssid}</h3>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">WIFI ACCESS POINT</p>
                        </div>
                        <Button onClick={downloadQR} variant="default" size="lg" className="w-full rounded-2xl bg-green-600 hover:bg-green-700 shadow-xl h-16 text-lg font-black italic">
                            <Download className="mr-2 h-6 w-6" /> DOWNLOAD PNG
                        </Button>
                    </div>
                ) : (
                    <div className="text-center space-y-4 opacity-30">
                        <div className="h-40 w-40 border-4 border-dashed rounded-3xl mx-auto flex items-center justify-center">
                            <Wifi className="h-16 w-16" />
                        </div>
                        <p className="font-bold italic">Network QR will appear here</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      {/* 🚀 SEO & Info */}
      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-primary/20">Privacy-First Sharing</span>
            <h2 className="text-5xl font-black italic tracking-tighter">WIFI SHARING MADE EASY</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Tired of typing long passwords? Generate a beautiful QR code that your guests can scan to join your network instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border/50 p-10 rounded-[3rem] space-y-6 hover:border-primary/30 transition-all hover:shadow-2xl">
                <div className="h-16 w-16 bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40"><ShieldCheck className="h-8 w-8" /></div>
                <h3 className="text-2xl font-black italic tracking-tight uppercase">100% Secure</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Your WiFi credentials are never sent to any server. The QR code is generated entirely in your browser using local JavaScript.</p>
            </div>
            <div className="bg-card border border-border/50 p-10 rounded-[3rem] space-y-6 hover:border-orange-500/30 transition-all hover:shadow-2xl">
                <div className="h-16 w-16 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-500/40"><Lock className="h-8 w-8" /></div>
                <h3 className="text-2xl font-black italic tracking-tight uppercase">Supports All Types</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Works with WPA, WPA2, WEP, and even open networks. You can also generate codes for hidden SSIDs with one click.</p>
            </div>
            <div className="bg-card border border-border/50 p-10 rounded-[3rem] space-y-6 hover:border-emerald-500/30 transition-all hover:shadow-2xl">
                <div className="h-16 w-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/40"><Share2 className="h-8 w-8" /></div>
                <h3 className="text-2xl font-black italic tracking-tight uppercase">Easy Printing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Download a high-resolution PNG image. Perfect for printing and placing in your guest room, cafe, or office.</p>
            </div>
        </div>
      </section>
    </div>
  );
}
