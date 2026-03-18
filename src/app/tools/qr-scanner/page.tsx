
'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Camera, CameraOff } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';

const QR_READER_ID = 'qr-reader';

export default function QrScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();

  const stopScanner = useCallback(() => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop()
        .then(() => {
          scannerRef.current?.clear();
          setIsScanning(false);
        })
        .catch(err => {
          console.error("Failed to stop scanner", err);
          // Even if stop fails, try to update state
          setIsScanning(false);
        });
    }
  }, []);
  
  const startScanner = useCallback(async () => {
    if (isScanning || !hasPermission) return;
    
    // Ensure the DOM element is there
    const qrReaderElement = document.getElementById(QR_READER_ID);
    if (!qrReaderElement) {
        toast({ title: "QR Reader element not found", variant: "destructive" });
        return;
    }

    if(!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(QR_READER_ID, {
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
            verbose: false
        });
    }

    setScanResult(null);

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length) {
        setIsScanning(true);
        // Prefer the back camera
        const cameraId = cameras.find(c => c.label.toLowerCase().includes('back'))?.id || cameras[0].id;
        
        await scannerRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.8);
              return { width: qrboxSize, height: qrboxSize };
            },
          },
          (decodedText: string) => {
            setScanResult(decodedText);
            toast({ title: 'QR Code Scanned!', description: 'Result copied to clipboard.' });
            navigator.clipboard.writeText(decodedText);
            stopScanner();
            scrollToDownload();
          },
          (errorMessage: string) => {
            // parse error, ideally ignore it.
          }
        );
      } else {
        toast({ title: "No cameras found", variant: "destructive" });
        setHasPermission(false);
      }
    } catch (err: any) {
        console.error("Failed to start scanner", err);
        toast({ title: "Failed to start scanner", description: "Please grant camera permissions and try again.", variant: "destructive" });
        setHasPermission(false);
        setIsScanning(false);
    }
  }, [isScanning, hasPermission, toast, stopScanner]);

  // Request permissions on mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setHasPermission(true);
        } else {
            setHasPermission(false);
        }
      })
      .catch(err => {
        setHasPermission(false);
        console.error(err);
      });
  }, []);
  
  // Auto-start scanner when permission is granted
  useEffect(() => {
    if(hasPermission && !isScanning) {
        startScanner();
    }
  }, [hasPermission, isScanning, startScanner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
       if (scannerRef.current && scannerRef.current.isScanning) {
            stopScanner();
       }
    };
  }, [stopScanner]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">QR Code Scanner</CardTitle>
          <CardDescription>
            Use your camera to scan a QR code. The result will be displayed and copied below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div id={QR_READER_ID} style={{ width: '100%' }}></div>
          
          {!hasPermission && (
              <Alert variant="destructive">
                <CameraOff className="h-4 w-4" />
                <AlertTitle>Camera Permission Required</AlertTitle>
                <AlertDescription>
                  Please grant camera permissions to use the QR scanner. If you've denied them, you may need to change the setting in your browser.
                </AlertDescription>
              </Alert>
          )}
          
          {scanResult && (
            <Alert id="download-section">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Scan Result</AlertTitle>
              <AlertDescription className="break-words">
                {scanResult}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {!isScanning ? (
            <Button onClick={startScanner} disabled={!hasPermission}>
              <Camera className="mr-2" /> Start Scanning
            </Button>
          ) : (
            <Button onClick={stopScanner} variant="destructive">
              <CameraOff className="mr-2"/> Stop Scanning
            </Button>
          )}
        </CardFooter>
      </Card>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our QR Code Scanner?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold mb-2">Instant Scanning</h3>
              <p>Scan any QR code in real-time using your device's camera. No more typing long URLs or manual data entry – just point and scan for instant results.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Browser-Based</h3>
              <p>Our tool works directly in your web browser. There is no need to download heavy apps or worry about storage space. It's fast, lightweight, and always available.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p>We prioritize your security. All scanning happens locally on your device. We do not store or transmit your scanned data to any server, ensuring complete privacy.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Universal Compatibility</h3>
              <p>Works seamlessly on any device with a camera, including smartphones, tablets, and laptops. Our scanner supports various QR code formats for a versatile experience.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I scan a QR code with this tool?</h3>
              <p>Simply allow camera access when prompted by your browser, point your camera at the QR code, and the tool will automatically detect and scan it for you.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Does it work on iPhones and Android?</h3>
              <p>Yes, it works on both iOS and Android devices through any modern web browser like Safari, Chrome, or Firefox. No additional app installation is required.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I scan a QR code from an image file?</h3>
              <p>Currently, this tool is designed for live camera scanning. For scanning QR codes from saved image files, we are planning a future update to support file uploads.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is the scanner free to use?</h3>
              <p>Absolutely! Our QR code scanner is 100% free to use, with no limits on the number of scans you can perform or any hidden costs.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
