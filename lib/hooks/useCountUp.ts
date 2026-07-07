"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns an eased 0→1 progress value driven by requestAnimationFrame,
 * re-triggered whenever `deps` changes (e.g. a route/slide/value change).
 * Consumers multiply a raw numeric value by the returned progress before
 * formatting, producing a count-up effect. Short-circuits to 1 (no
 * animation) when the visitor has requested reduced motion, or when
 * `enabled` is false.
 */
export function useCountUp(deps: unknown[] = [], enabled = true): number {
  const [progress, setProgress] = useState(enabled ? 0 : 1);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setProgress(1);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    setProgress(0);
    const start = performance.now();
    const duration = 500;

    function tick(now: number) {
      const linear = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - linear, 3);
      setProgress(eased);
      if (linear < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return progress;
}
