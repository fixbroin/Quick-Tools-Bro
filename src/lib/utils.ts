import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToDownload() {
  // Wait a tiny bit for the UI to render the download button
  setTimeout(() => {
    const downloadButton = document.getElementById('download-section') || 
                           document.querySelector('button[class*="bg-green-600"]') ||
                           document.querySelector('button:has(.lucide-download)');
    
    if (downloadButton) {
      downloadButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 150);
}

export function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  callback: (base64: string) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions preserving aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/png'));
      } else {
        callback(e.target?.result as string);
      }
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}
