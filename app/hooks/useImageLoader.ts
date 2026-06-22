import { useState, useEffect } from 'react';

/**
 * Loads an image from a URL and returns the HTMLImageElement once loaded.
 * Returns `null` while loading or if `src` is falsy.
 *
 * Shared hook — replaces duplicate useEffect image-loading patterns
 * in Step3Mapping, Step4Result, and Step5Print.
 */
export function useImageLoader(src?: string | null): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) return;

    let cancelled = false;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    return () => {
      cancelled = true;
      setImage(null);
    };
  }, [src]);

  return src ? image : null;
}
