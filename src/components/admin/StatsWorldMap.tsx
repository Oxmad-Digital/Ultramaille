"use client";

import { useEffect, useRef } from "react";
import { countryLabel } from "@/lib/country-label";
import styles from "./StatsWorldMap.module.css";

type CountryPoint = { country: string; views: number };

export default function StatsWorldMap({ countries }: { countries: CountryPoint[] }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || countries.length === 0) return;

    let cancelled = false;

    (async () => {
      let svgText: string;
      try {
        const res = await fetch("/world-map.min.svg");
        svgText = await res.text();
      } catch {
        return;
      }
      if (cancelled) return;

      host.innerHTML = svgText;
      const svg = host.querySelector("svg");
      if (!svg) return;

      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.style.width = "100%";
      svg.style.height = "auto";
      svg.style.display = "block";

      const byCountry = new Map(
        countries.filter((c) => c.country).map((c) => [c.country.toLowerCase(), c.views])
      );
      const max = Math.max(1, ...countries.map((c) => c.views));

      const tooltip = document.createElement("div");
      tooltip.className = styles.tooltip;
      host.appendChild(tooltip);

      svg.querySelectorAll<SVGElement>("path[id], g[id]").forEach((el) => {
        const views = byCountry.get(el.id);
        const paths =
          el.tagName.toLowerCase() === "g"
            ? Array.from(el.querySelectorAll<SVGPathElement>("path"))
            : [el as unknown as SVGPathElement];

        paths.forEach((p) => {
          p.style.stroke = "rgba(15, 30, 48, 0.18)";
          p.style.strokeWidth = "0.35";
        });

        if (!views) {
          paths.forEach((p) => {
            p.style.fill = "#ece4d5";
          });
          return;
        }

        const intensity = 0.28 + 0.72 * Math.sqrt(views / max);
        const fill = `rgba(224, 163, 56, ${intensity.toFixed(2)})`;
        paths.forEach((p) => {
          p.style.fill = fill;
          p.style.cursor = "pointer";
        });

        const show = (e: PointerEvent) => {
          const hostRect = host.getBoundingClientRect();
          tooltip.innerHTML =
            `<span class="${styles.tooltipLabel}">${countryLabel(el.id.toUpperCase())}</span>` +
            `<span class="${styles.tooltipValue}">${views.toLocaleString("fr-FR")}</span>`;
          tooltip.style.left = `${e.clientX - hostRect.left}px`;
          tooltip.style.top = `${e.clientY - hostRect.top}px`;
          tooltip.classList.add(styles.tooltipVisible);
          paths.forEach((p) => {
            p.style.filter = "brightness(1.12)";
          });
        };
        const hide = () => {
          tooltip.classList.remove(styles.tooltipVisible);
          paths.forEach((p) => {
            p.style.filter = "";
          });
        };
        el.addEventListener("pointerenter", show);
        el.addEventListener("pointermove", show);
        el.addEventListener("pointerleave", hide);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [countries]);

  if (countries.length === 0) {
    return <p className={styles.empty}>Aucune donnée pour le moment.</p>;
  }

  return <div ref={hostRef} className={styles.host} />;
}
