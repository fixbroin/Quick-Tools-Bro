export interface AdPlacementConfig {
  slot: string;         // Google AdSense slot ID
  fbPlacementId: string; // Facebook Placement ID
  customHtml: string;   // Custom HTML / iframe code for other networks (e.g. Adsterra, Media.net, affiliate banners)
}

export interface AdConfig {
  enabled: boolean;
  showDemo: boolean;
  provider: 'adsense' | 'facebook' | 'custom' | 'none';
  adsensePubId: string; // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  placements: {
    top: AdPlacementConfig;
    bottom: AdPlacementConfig;
    inline: AdPlacementConfig;
  };
  affiliates: {
    hostingUrl: string; // Hostinger affiliate link
    vpnUrl: string;     // NordVPN affiliate link
  };
  downloadAd: {
    enabled: boolean;   // Globally toggle the download wait ad gate modal
    mode: 'custom' | 'adsense'; // custom = display video/image, adsense = display AdSense inline
    type: 'image' | 'video';    // Only for 'custom' mode
    fileUrl: string;    // Path in public/ folder (e.g., /ads/bottom-1.mp4)
    linkUrl: string;    // Destination redirect URL on click
    duration: number;   // Total ad duration before auto-download starts (seconds)
    skipAfter: number;  // Seconds before "Skip Ad & Download" button activates (seconds)
  };
}

export const AD_CONFIG: AdConfig = {
  // Toggle ads globally
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
  
  // Toggle demo/placement outlines
  showDemo: process.env.NEXT_PUBLIC_ADS_SHOW_DEMO === 'true',
  
  // Choose your provider: 'adsense', 'facebook', 'custom', or 'none'
  provider: (process.env.NEXT_PUBLIC_AD_PROVIDER as 'adsense' | 'facebook' | 'custom' | 'none') || 'none',
  
  // Your Google AdSense publisher ID
  adsensePubId: process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-0000000000000000',
  
  // Placement slots configurations
  placements: {
    top: {
      slot: process.env.NEXT_PUBLIC_AD_SLOT_TOP || '0000000000',
      fbPlacementId: process.env.NEXT_PUBLIC_FB_PLACEMENT_TOP || '000000000000000_000000000000000',
      customHtml: process.env.NEXT_PUBLIC_CUSTOM_AD_TOP || `
        <!-- Custom Ad Network Banner (e.g. Adsterra / Ezoic / Affiliate) -->
        <a href="https://usebro.in/contact" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; max-width: 728px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #29ABE2 0%, #1b75bc 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; font-family: sans-serif; box-shadow: 0 4px 15px rgba(41,171,226,0.2);">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">ADVERTISE WITH USEBRO</h3>
            <p style="margin: 0; font-size: 12px; opacity: 0.9;">Reach thousands of web developers and digital creators daily. Click here to sponsor this slot.</p>
          </div>
        </a>
      `
    },
    bottom: {
      slot: process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM || '1111111111',
      fbPlacementId: process.env.NEXT_PUBLIC_FB_PLACEMENT_BOTTOM || '111111111111111_111111111111111',
      customHtml: process.env.NEXT_PUBLIC_CUSTOM_AD_BOTTOM || `
        <a href="https://usebro.in/contact" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; max-width: 728px; margin: 0 auto;">
          <div style="background: #1e293b; color: #94a3b8; padding: 15px; border-radius: 12px; text-align: center; border: 1px dashed #334155; font-family: sans-serif;">
            <p style="margin: 0; font-size: 11px;">Sponsored Link Ad Space. Contact admin@usebro.in to place your banner.</p>
          </div>
        </a>
      `
    },
    inline: {
      slot: process.env.NEXT_PUBLIC_AD_SLOT_INLINE || '2222222222',
      fbPlacementId: process.env.NEXT_PUBLIC_FB_PLACEMENT_INLINE || '222222222222222_222222222222222',
      customHtml: process.env.NEXT_PUBLIC_CUSTOM_AD_INLINE || `
        <a href="https://usebro.in/contact" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; max-width: 300px; margin: 0 auto;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; padding: 15px; border-radius: 8px; text-align: center; font-family: sans-serif;">
            <span style="font-size: 8px; font-weight: bold; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; display: block; margin-bottom: 5px;">Sponsor</span>
            <p style="margin: 0; font-size: 12px; font-weight: bold; color: #334155;">Host Your Website on Hostinger</p>
            <p style="margin: 5px 0 0 0; font-size: 10px; color: #64748b;">Get 80% off premium hosting plans + free domain. Reliable & ultra-fast.</p>
          </div>
        </a>
      `
    }
  },
  
  // Affiliate referrals configurations
  affiliates: {
    hostingUrl: process.env.NEXT_PUBLIC_AFFILIATE_HOSTING_URL || 'https://www.hostinger.com',
    vpnUrl: process.env.NEXT_PUBLIC_AFFILIATE_VPN_URL || 'https://nordvpn.com'
  },

  // Custom Video/Image ad gate overlay for downloads
  downloadAd: {
    enabled: process.env.NEXT_PUBLIC_DOWNLOAD_AD_ENABLED === 'true',
    mode: (process.env.NEXT_PUBLIC_DOWNLOAD_AD_MODE as 'custom' | 'adsense') || 'custom',
    type: (process.env.NEXT_PUBLIC_DOWNLOAD_AD_TYPE as 'image' | 'video') || 'video',
    fileUrl: process.env.NEXT_PUBLIC_DOWNLOAD_AD_FILE || '/ads/bottom-1.mp4',
    linkUrl: process.env.NEXT_PUBLIC_DOWNLOAD_AD_LINK || 'https://usebro.in',
    duration: parseInt(process.env.NEXT_PUBLIC_DOWNLOAD_AD_DURATION || '10', 10),
    skipAfter: parseInt(process.env.NEXT_PUBLIC_DOWNLOAD_AD_SKIP_AFTER || '5', 10),
  }
};
