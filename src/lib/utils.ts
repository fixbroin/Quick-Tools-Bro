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
