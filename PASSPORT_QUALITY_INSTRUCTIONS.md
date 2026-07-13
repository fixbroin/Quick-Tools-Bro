# Passport Photo Maker - Quality & Resolution Adjustment Guide

This guide explains how to customize or decrease the image resolution and file sizes of the passport photo sheet generator in the future.

All rendering and scaling configurations are located inside the file:
👉 **[src/app/tools/passport-photo-maker/page.tsx](file:///c:/Users/srikanth/Downloads/Quick%20Tools%20Bro/Quick%20Tools%20Bro%20version%2013/src/app/tools/passport-photo-maker/page.tsx)**

---

## 1. Adjusting the Print Resolution (DPI / Pixel Size)

The resolution density is determined by the `scaleFactor` variable. This multiplier determines the number of pixels generated per millimeter (mm) on the paper sheet templates.

There are **three** locations where `scaleFactor` is defined in [page.tsx](file:///c:/Users/srikanth/Downloads/Quick%20Tools%20Bro/Quick%20Tools%20Bro%20version%2013/src/app/tools/passport-photo-maker/page.tsx). To keep dimensions mathematically consistent, **always update all three values to match**.

### The Three Scale Variables to Edit:

1. **Crop Preview Canvas (`useEffect` hook)**:
   ```typescript
   // Around Line 80
   const scaleFactor = 12; // Change this value
   ```
2. **4x6 Print Sheet Canvas (`handleGenerate` function)**:
   ```typescript
   // Around Line 117
   const scaleFactor = 12; // Change this value to match
   ```
3. **A4 Print Sheet Canvas (`handleGenerate` function)**:
   ```typescript
   // Around Line 157
   const scaleFactor = 12; // Change this value to match
   ```

### Resolution Presets Reference:
* **High Quality (300 DPI - Current)**: Set all values to **`12`**. (Generates A4 sheet at `2520 x 3564` pixels).
* **Medium Quality (150 DPI - Standard Web)**: Set all values to **`6`**. (Generates A4 sheet at `1260 x 1782` pixels).
* **Low Quality (75 DPI - Small Files)**: Set all values to **`3`**. (Generates A4 sheet at `630 x 891` pixels).

---

## 2. Adjusting JPEG Compression Quality

You can also decrease the file size by adjusting the compression factor of the exported JPEGs. This is configured using canvas `.toDataURL` encoders.

Inside the `handleGenerate` function, look for the `.toDataURL` lines and change the second parameter (value ranges between `0.0` for maximum compression to `1.0` for maximum quality):

* **Single Photo Output**:
  ```typescript
  // Around Line 109
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95); // Change 0.95 (e.g. to 0.80)
  ```
* **4x6 Sheet Output**:
  ```typescript
  // Around Line 150
  setSheetUrl(sheetCanvas.toDataURL('image/jpeg', 0.95)); // Change 0.95 (e.g. to 0.80)
  ```
* **A4 Sheet Output**:
  ```typescript
  // Around Line 190
  setA4SheetUrl(a4Canvas.toDataURL('image/jpeg', 0.95)); // Change 0.95 (e.g. to 0.80)
  ```
