"use client";

import { useEffect, useRef, useState } from "react";
import type { StitchedQuoteVariant } from "@/app/notre-engagement/stitched-quote.fr";
import styles from "./StitchedQuote.module.css";

const STROKE_MS = 600;
const STAGGER_MS = 6000;

const VARIANT_LOADERS: Record<"fr" | "en", () => Promise<StitchedQuoteVariant>> = {
  fr: () => import("@/app/notre-engagement/stitched-quote.fr").then((m) => m.default),
  en: () => import("@/app/notre-engagement/stitched-quote.en").then((m) => m.default),
};

export default function StitchedQuote({
  lang,
  label,
}: {
  lang: "fr" | "en";
  label: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [variant, setVariant] = useState<StitchedQuoteVariant | null>(null);
  const [inView, setInView] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    VARIANT_LOADERS[lang]().then((v) => {
      if (!cancelled) setVariant(v);
    });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotionRef.current) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!variant || !inView || !svg) return;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    const total = paths.length;
    const items = paths.map((path, i) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      return { path, length, delay: (i / total) * STAGGER_MS };
    });

    if (reducedMotionRef.current) {
      items.forEach(({ path }) => {
        path.style.strokeDashoffset = "0";
      });
      return;
    }

    // Driven manually with rAF (rather than a CSS transition) so every
    // path's staggered start/duration stays in sync off one clock.
    let rafId: number;
    const start = performance.now();

    function tick(now: number) {
      let allDone = true;
      for (const { path, length, delay } of items) {
        const t = (now - start - delay) / STROKE_MS;
        if (t <= 0) {
          allDone = false;
          continue;
        }
        const clamped = Math.min(t, 1);
        if (clamped < 1) allDone = false;
        const eased = 1 - (1 - clamped) ** 3;
        path.style.strokeDashoffset = `${length * (1 - eased)}`;
      }
      if (!allDone) {
        rafId = requestAnimationFrame(tick);
      }
    }
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [variant, inView]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {variant && (
        <svg
          ref={svgRef}
          viewBox={variant.viewBox}
          className={styles.svg}
          role="img"
          aria-label={label}
        >
          {variant.subpaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      )}
    </div>
  );
}
