
'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Camera, CameraOff } from 'lucide-react';

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
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
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
          <Alert>
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
  );
}
