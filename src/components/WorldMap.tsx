"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/language-context";
import styles from "./WorldMap.module.css";

const EUROPE_IDS = [
  "fr", "it", "gb", "de", "es", "be", "nl", "pt", "ch", "at", "pl", "cz", "dk",
  "se", "no", "fi", "ie", "gr", "ro", "hu", "sk", "hr", "si", "rs", "ba", "bg",
  "lt", "lv", "ee", "lu", "md", "mk", "al", "me", "is",
];
const SECONDARY_IDS = ["us", "za", "mu"];

type Stats = { volume: string; volumeEn: string; clients: string; clientsEn: string };

type Marker = {
  id: string;
  label: string;
  sub: string;
  subEn: string;
  type: "principal" | "sec" | "origin";
  side: "top" | "bottom" | "left" | "right";
  stats?: Stats;
};

// TODO: remplacer ces chiffres d'exemple par les valeurs réelles.
const MARKERS: Marker[] = [
  {
    id: "de", label: "EUROPE", sub: "Marché principal", subEn: "Principal market", type: "principal", side: "top",
    stats: { volume: "1 200 t / an", volumeEn: "1,200 t / year", clients: "18 marques", clientsEn: "18 brands" },
  },
  {
    id: "us", label: "ÉTATS-UNIS", sub: "Secondaire", subEn: "Secondary", type: "sec", side: "top",
    stats: { volume: "180 t / an", volumeEn: "180 t / year", clients: "5 marques", clientsEn: "5 brands" },
  },
  {
    id: "za", label: "AFRIQUE DU SUD", sub: "Secondaire", subEn: "Secondary", type: "sec", side: "left",
    stats: { volume: "95 t / an", volumeEn: "95 t / year", clients: "3 marques", clientsEn: "3 brands" },
  },
  { id: "mg", label: "MADAGASCAR", sub: "Origine", subEn: "Origin", type: "origin", side: "right" },
];

function dotHTML(type: Marker["type"]) {
  if (type === "sec") {
    return '<span style="width:var(--dot-size);height:var(--dot-size);border-radius:50%;background:#9c7a35;box-shadow:0 0 0 3px rgba(15,30,48,.6);flex:none;"></span>';
  }
  if (type === "origin") {
    return '<span style="position:relative;width:var(--dot-size);height:var(--dot-size);flex:none;"><span class="' +
      styles.pulse +
      '" style="position:absolute;inset:0;border-radius:50%;background:#F4EFE6;"></span><span style="position:absolute;inset:0;border-radius:50%;background:transparent;border:2px solid #E0A338;box-sizing:border-box;"></span></span>';
  }
  return '<span style="position:relative;width:var(--dot-size);height:var(--dot-size);flex:none;"><span class="' +
    styles.pulse +
    '" style="position:absolute;inset:0;border-radius:50%;background:#E0A338;"></span><span style="position:absolute;inset:2px;border-radius:50%;background:#E0A338;box-shadow:0 0 0 2px rgba(15,30,48,.6);"></span></span>';
}

export default function WorldMap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

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

      const paths = svg.querySelectorAll("path");
      paths.forEach((p) => {
        (p as SVGPathElement).style.fill = "#23394f";
        (p as SVGPathElement).style.stroke = "#0F1E30";
        (p as SVGPathElement).style.strokeWidth = "0.35";
      });

      let minX = Infinity, minY = Infinity, maxX = -Infinity;
      paths.forEach((p) => {
        try {
          const b = (p as SVGGraphicsElement).getBBox();
          if (b.width) {
            minX = Math.min(minX, b.x);
            minY = Math.min(minY, b.y);
            maxX = Math.max(maxX, b.x + b.width);
          }
        } catch {
          /* empty path */
        }
      });
      const vbX = minX - 6;
      const vbW = maxX - minX + 12;
      const vbY = minY - 4;
      const vbBottom = 644;
      const vbH = vbBottom - vbY;
      svg.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);

      const fill = (id: string, color: string) => {
        const el = svg.querySelector("#" + id);
        if (!el) return;
        const ps = el.tagName.toLowerCase() === "g" ? el.querySelectorAll("path") : [el];
        ps.forEach((p) => {
          (p as SVGElement).style.fill = color;
        });
      };
      EUROPE_IDS.forEach((id) => fill(id, "#E0A338"));
      SECONDARY_IDS.forEach((id) => fill(id, "#9c7a35"));
      fill("mg", "#F4EFE6");

      const cen = (id: string) => {
        const el = svg.querySelector("#" + id);
        if (!el) return null;
        const mainland = el.querySelector("path.mainland");
        const target = mainland ?? el;
        try {
          const b = (target as SVGGraphicsElement).getBBox();
          return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        } catch {
          return null;
        }
      };
      const NS = "http://www.w3.org/2000/svg";
      const origin = cen("mg");
      if (origin) {
        ["de", "us", "za"].forEach((id) => {
          const target = cen(id);
          if (!target) return;
          const mx = (origin.x + target.x) / 2;
          const my = (origin.y + target.y) / 2;
          const dist = Math.hypot(target.x - origin.x, target.y - origin.y);
          const p = document.createElementNS(NS, "path");
          p.setAttribute("d", `M${origin.x} ${origin.y} Q ${mx} ${my - dist * 0.26} ${target.x} ${target.y}`);
          p.setAttribute("fill", "none");
          p.setAttribute("stroke", "#E0A338");
          p.setAttribute("stroke-width", "1");
          p.setAttribute("stroke-opacity", "0.5");
          p.setAttribute("stroke-dasharray", "2.5 3.5");
          p.setAttribute("class", styles.flowLine);
          svg.appendChild(p);
        });
      }

      const overlay = document.createElement("div");
      overlay.className = styles.overlay;
      host.appendChild(overlay);

      MARKERS.forEach((m) => {
        const c = cen(m.id);
        if (!c) return;
        const left = ((c.x - vbX) / vbW) * 100;
        const top = ((c.y - vbY) / vbH) * 100;
        const subColor = m.type === "sec" ? "rgba(244,239,230,.5)" : "#E0A338";
        const sub = lang === "en" ? m.subEn : m.sub;
        const lbl =
          `<span data-marker-label class="${styles.label}" style="font-family:var(--font-space-mono),monospace;font-size:9.5px;font-weight:700;letter-spacing:.1em;color:#F4EFE6;background:rgba(10,16,26,.66);border:1px solid rgba(244,239,230,.14);border-radius:5px;padding:5px 8px;white-space:nowrap;line-height:1.3;text-align:center;flex:none;">` +
          m.label +
          `<br><span style="font-weight:400;font-size:8px;letter-spacing:.06em;color:${subColor};">` +
          sub +
          `</span></span>`;
        const dot = dotHTML(m.type);
        const vCon = '<span style="width:1px;height:9px;background:rgba(244,239,230,.35);flex:none;"></span>';
        const hCon = '<span style="width:11px;height:1px;background:rgba(244,239,230,.35);flex:none;"></span>';
        const dotSize = m.type === "sec" ? "9px" : "14px";
        const wrap = document.createElement("div");
        if (m.type === "origin") wrap.classList.add(styles.markerOrigin);
        // The dot's center, not the container edge, must land on the geo coordinate,
        // so each transform compensates by half the (var-driven) dot size.
        const base = `position:absolute;left:${left}%;top:${top}%;display:flex;align-items:center;`;
        if (m.side === "top") {
          wrap.style.cssText = base + "transform:translate(-50%,calc(-100% + var(--dot-size) / 2));flex-direction:column;";
          wrap.innerHTML = lbl + vCon + dot;
        } else if (m.side === "bottom") {
          wrap.style.cssText = base + "transform:translate(-50%,calc(var(--dot-size) / -2));flex-direction:column;";
          wrap.innerHTML = dot + vCon + lbl;
        } else if (m.side === "left") {
          wrap.style.cssText = base + "transform:translate(calc(-100% + var(--dot-size) / 2),-50%);";
          wrap.innerHTML = lbl + hCon + dot;
        } else {
          // Kept edge-anchored (not centered) on purpose: a centered dot fully covers
          // Madagascar's tiny rendered size, so it's offset just beside the island instead.
          wrap.style.cssText = base + "transform:translate(0,-50%);";
          wrap.innerHTML = dot + hCon + lbl;
        }
        wrap.style.setProperty("--dot-size", dotSize);
        overlay.appendChild(wrap);

        if (m.stats) {
          wrap.style.pointerEvents = "auto";
          wrap.style.cursor = "pointer";

          const labelEl = wrap.querySelector<HTMLElement>("[data-marker-label]");

          const volume = lang === "en" ? m.stats.volumeEn : m.stats.volume;
          const clients = lang === "en" ? m.stats.clientsEn : m.stats.clients;
          const volumeLabel = lang === "en" ? "Export volume" : "Volume exporté";
          const clientsLabel = lang === "en" ? "Clients" : "Clients";

          const tooltip = document.createElement("div");
          tooltip.className = styles.tooltip;
          tooltip.innerHTML =
            `<div class="${styles.tooltipRow}"><span class="${styles.tooltipLabel}">${volumeLabel}</span><span class="${styles.tooltipValue}">${volume}</span></div>` +
            `<div class="${styles.tooltipRow}"><span class="${styles.tooltipLabel}">${clientsLabel}</span><span class="${styles.tooltipValue}">${clients}</span></div>`;
          overlay.appendChild(tooltip);

          const positionTooltip = () => {
            if (!labelEl) return;
            const hostRect = host.getBoundingClientRect();
            const labelRect = labelEl.getBoundingClientRect();
            const tLeft = labelRect.left + labelRect.width / 2 - hostRect.left;
            const tTop = labelRect.top - hostRect.top;
            tooltip.style.cssText = `position:absolute;left:${tLeft}px;top:${tTop}px;transform:translate(-50%, calc(-100% - 10px));`;
          };

          wrap.addEventListener("mouseenter", () => {
            positionTooltip();
            tooltip.classList.add(styles.tooltipVisible);
            labelEl?.classList.add(styles.labelHidden);
          });
          wrap.addEventListener("mouseleave", () => {
            tooltip.classList.remove(styles.tooltipVisible);
            labelEl?.classList.remove(styles.labelHidden);
          });
        }
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return <div ref={hostRef} className={styles.host} />;
}
