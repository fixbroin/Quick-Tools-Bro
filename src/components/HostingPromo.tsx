import { AD_CONFIG } from '@/lib/ad-config';
import { ArrowRight, Server } from 'lucide-react';

export function HostingPromo() {
  return (
    <a 
      href={AD_CONFIG.affiliates.hostingUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block w-full max-w-4xl mx-auto my-6 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-[#673DE6] via-[#7C3AED] to-[#EC4899] hover:shadow-xl hover:shadow-violet-500/20 hover:scale-[1.01] transition-all duration-300 group"
    >
      <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="p-3 bg-white/10 text-white rounded-xl group-hover:scale-110 transition-transform shadow-inner shadow-white/20">
            <Server className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-white flex items-center justify-center md:justify-start gap-2">
              Need Ultra-Fast Web Hosting for Your Website?
              <span className="text-[9px] font-black uppercase bg-yellow-400 text-purple-950 px-2 py-0.5 rounded-full shadow-sm animate-pulse">80% Off Deal</span>
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">Get a free domain, unlimited SSL certificates, and 24/7 support via our exclusive Hostinger partner referral link.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-extrabold bg-white text-[#673DE6] hover:bg-slate-50 px-4 py-2.5 rounded-xl shadow-lg shadow-purple-950/20 transition-all duration-300 group-hover:scale-105 whitespace-nowrap">
          Claim Discount Deal <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </a>
  );
}
