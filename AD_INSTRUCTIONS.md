# 💰 UseBro Advertising Setup Guide

This document explains how to set up, create, and integrate advertisements from **Google AdSense**, **Meta Audience Network (Facebook Ads)**, and **Custom/Direct Ad networks** on UseBro.

---

## 🟢 Part 1: Setting up Google AdSense

Google AdSense is the best choice for automatic, high-quality display banners.

### Step 1: Link Your Domain
1. Log in to the [Google AdSense Console](https://adsense.google.com/).
2. Go to **Sites** > **Add Site** and input your domain: `https://usebro.in`.
3. AdSense will request you to verify ownership. Copied verification keys go inside `.env` under:
   ```env
   NEXT_PUBLIC_GSC_VERIFICATION_ID="google-site-verification=..."
   ```

### Step 2: Retrieve Your Publisher ID
1. In your AdSense account dashboard, go to **Account** > **Settings** > **Account Information**.
2. Locate the **Publisher ID** (e.g. `pub-1234567890123456`).
3. Add it to your `.env` file:
   ```env
   NEXT_PUBLIC_ADSENSE_PUB_ID="ca-pub-1234567890123456"
   ```

### Step 3: Create Ad Slot Units
1. Go to **Ads** > **By ad unit** > **Display ads**.
2. Create **3 Display Ads**:
   * **Unit 1 (Top Banner)**: Name it `usebro-top-banner`, Ad Size: `Responsive`, Shape: `Horizontal`. Copy Slot ID to `.env`:
     ```env
     NEXT_PUBLIC_AD_SLOT_TOP="YOUR_TOP_SLOT_ID"
     ```
   * **Unit 2 (Bottom Banner)**: Name it `usebro-bottom-banner`, Ad Size: `Responsive`, Shape: `Square`. Copy Slot ID to `.env`:
     ```env
     NEXT_PUBLIC_AD_SLOT_BOTTOM="YOUR_BOTTOM_SLOT_ID"
     ```
   * **Unit 3 (Inline/Download Ad)**: Name it `usebro-inline-banner`, Ad Size: `Responsive`, Shape: `Square` (renders inside the 5s download wait-timer modal!). Copy Slot ID to `.env`:
     ```env
     NEXT_PUBLIC_AD_SLOT_INLINE="YOUR_INLINE_SLOT_ID"
     ```

### Step 4: Turn Ads Live
Set these values in your `.env` file:
```env
NEXT_PUBLIC_ADS_ENABLED="true"
NEXT_PUBLIC_AD_PROVIDER="adsense"
NEXT_PUBLIC_ADS_SHOW_DEMO="false"
```

---

## 🔵 Part 2: Setting up Meta Audience Network (Facebook Web Ads)

Meta Audience Network lets you show targeted Facebook mobile and web ads.

### Step 1: Register in Meta Business Suite
1. Log in to [Meta Audience Network](https://developers.facebook.com/products/audience-network/).
2. Create a new Property for your business name.
3. Under **Platforms**, select **Mobile Web** and add your domain: `usebro.in`.

### Step 2: Create Banner Placements
1. Go to **Integration** > **Placements** > **Create Placement**.
2. Create **3 Placements**:
   * **Placement 1 (Top)**: Select **Banner** (recommended dimensions: `728x90` Leaderboard). Copy Placement ID to `.env`:
     ```env
     NEXT_PUBLIC_FB_PLACEMENT_TOP="YOUR_TOP_PLACEMENT_ID"
     ```
   * **Placement 2 (Bottom)**: Select **Banner** (dimensions: `728x90`). Copy Placement ID to `.env`:
     ```env
     NEXT_PUBLIC_FB_PLACEMENT_BOTTOM="YOUR_BOTTOM_PLACEMENT_ID"
     ```
   * **Placement 3 (Inline / Download Modal)**: Select **Medium Rectangle** (dimensions: `300x250`). Copy Placement ID to `.env`:
     ```env
     NEXT_PUBLIC_FB_PLACEMENT_INLINE="YOUR_INLINE_PLACEMENT_ID"
     ```

### Step 3: Turn Meta Ads Live
Set these values in your `.env` file:
```env
NEXT_PUBLIC_ADS_ENABLED="true"
NEXT_PUBLIC_AD_PROVIDER="facebook"
NEXT_PUBLIC_ADS_SHOW_DEMO="false"
```

---

## 🟡 Part 3: Setting up Custom Ad Networks & Direct Sponsors

If you want to place direct corporate sponsor banners, affiliate links, or use other networks like **Adsterra**, **Ezoic**, or **Media.net**:

### Step 1: Get Code Snippets
Create custom ad banner images (Leaderboards: `728x90px` or `970x90px`, Rectangles: `300x250px`) or get the HTML/iframe embed codes from your ad platform dashboard.

### Step 2: Paste HTML in `.env`
Paste the raw HTML or iframe code inside single quotes under custom variables in `.env`:
```env
NEXT_PUBLIC_CUSTOM_AD_TOP='<a href="https://sponsorlink.com" target="_blank"><img src="https://yoursite.com/banner.png" alt="Sponsor" /></a>'
NEXT_PUBLIC_CUSTOM_AD_BOTTOM='...'
NEXT_PUBLIC_CUSTOM_AD_INLINE='...'
```

### Step 3: Turn Custom Banners Live
Set these values in your `.env` file:
```env
NEXT_PUBLIC_ADS_ENABLED="true"
NEXT_PUBLIC_AD_PROVIDER="custom"
NEXT_PUBLIC_ADS_SHOW_DEMO="false"
```

---

## 🚀 Part 4: High-Yield Download Wait-Timer Modal
We integrated a 5-second countdown timer gate modal when downloading files in high-conversion tools like **PDF to JPG** and **Image Compressor**.
* When a user clicks "Download", the `DownloadModal` triggers, starting a 5-second countdown.
* During the countdown, a high-paying **Inline Rectangle Ad Slot** is displayed directly in front of the user.
* Once the timer hits zero, the file download automatically starts.
* This modal is fully dynamic and respects the `.env` settings (it displays in `NEXT_PUBLIC_ADS_SHOW_DEMO="true"` for testing, and respects provider configuration).

---

## 🔍 Part 5: How to Test Placement Layouts (Show Demo Box)
If you want to see exactly where ads will appear on the homepage, tools pages, and inside the download modal without activating real scripts:
1. In your `.env` file, set:
   ```env
   NEXT_PUBLIC_ADS_SHOW_DEMO="true"
   ```
2. Run your website locally. Dashed mockup banners representing standard advertising boxes (including the `300x250` rectangle inside the download modal!) will show immediately so you can inspect sizes and margin layouts.
