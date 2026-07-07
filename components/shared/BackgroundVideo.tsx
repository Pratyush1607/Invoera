"use client";

import { useEffect, useRef, useState } from "react";

interface BackgroundVideoProps {
  src: string;
  /** Static fallback shown for prefers-reduced-motion visitors; omit to just show the container's own background color. */
  poster?: string;
  /** Seconds into the clip to start/loop from. */
  loopStart: number;
  /** Seconds into the clip to loop back to loopStart at. */
  loopEnd: number;
  playbackRate?: number;
  className?: string;
}

/**
 * Autoplaying, muted, looping background video that replays only the
 * [loopStart, loopEnd) segment of the source clip (seeking back via
 * `timeupdate` rather than relying on the whole file looping). Falls back
 * to a static poster image for visitors who've asked for reduced motion.
 */
export function BackgroundVideo({
  src,
  poster,
  loopStart,
  loopEnd,
  playbackRate,
  className,
}: BackgroundVideoProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const listener = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  if (reducedMotion) {
    if (!poster) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className={className ?? "absolute inset-0 h-full w-full object-cover"}
      />
    );
  }

  return (
    <video
      key={src}
      src={src}
      poster={poster}
      autoPlay
      muted
      playsInline
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full object-cover"}
      ref={(el) => {
        if (!el || initializedRef.current) return;
        initializedRef.current = true;
        if (playbackRate) el.playbackRate = playbackRate;
        el.addEventListener("loadedmetadata", () => {
          el.currentTime = loopStart;
        });
        el.addEventListener("timeupdate", () => {
          if (el.currentTime >= loopEnd) el.currentTime = loopStart;
        });
      }}
    />
  );
}
