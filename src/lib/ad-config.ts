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
    }
  }
};
