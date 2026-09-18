"use client";

import { useEffect, useRef } from "react";

// Vidéo d'ambiance sous la ligne de flottaison : rien n'est téléchargé (source ni
// métadonnées) tant qu'elle n'approche pas de l'écran, seul le poster est affiché.
export default function LazyVideo({
  src,
  poster,
  className,
  label,
}: {
  src: string;
  poster: string;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        video.src = src;
        video.play().catch(() => {});
      },
      { rootMargin: "200px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      aria-label={label}
      preload="none"
      muted
      loop
      playsInline
      controls
    />
  );
}
