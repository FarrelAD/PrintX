import { useState, useEffect, type RefObject } from 'react';

type StageSize = {
  width: number;
  height: number;
};

/**
 * Measures a container element with ResizeObserver and returns its size.
 * When a `bgImage` is provided the height is derived from the image's
 * natural aspect ratio; otherwise a 0.6 ratio fallback is used.
 *
 * Shared hook — replaces the duplicated ResizeObserver pattern in
 * Step3Mapping and Step4Result.
 */
export function useStageSize(
  containerRef: RefObject<HTMLElement | null>,
  bgImage: HTMLImageElement | null,
): StageSize {
  const [stageSize, setStageSize] = useState<StageSize>({ width: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      if (!bgImage) {
        setStageSize({ width: w, height: Math.round(w * 0.6) });
        return;
      }
      const ratio = bgImage.naturalHeight / bgImage.naturalWidth;
      setStageSize({ width: w, height: Math.round(w * ratio) });
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef, bgImage]);

  return stageSize;
}
