"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./DailyTrafficChart.module.css";

type DailyPoint = { day: string; views: number; visitors: number };

const WIDTH = 760;
const HEIGHT = 260;
const MARGIN = { top: 16, right: 40, bottom: 30, left: 44 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

const VIEWS_COLOR = "#e0a338";
const VISITORS_COLOR = "#3a6ea5";

function niceMax(max: number) {
  if (max <= 0) return 4;
  const rawStep = max / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  const step = niceNorm * mag;
  return Math.ceil(max / step) * step;
}

function formatDate(day: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(day).toLocaleDateString("fr-FR", opts);
}

export default function DailyTrafficChart({ daily }: { daily: DailyPoint[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number; wrapWidth: number } | null>(null);

  const n = daily.length;

  const { xAt, yAt, viewsPath, visitorsPath, ticks, labelIndices } = useMemo(() => {
    const dataMax = Math.max(1, ...daily.map((d) => Math.max(d.views, d.visitors)));
    const max = niceMax(dataMax);

    const xAt = (i: number) => (n <= 1 ? MARGIN.left + PLOT_WIDTH / 2 : MARGIN.left + (i / (n - 1)) * PLOT_WIDTH);
    const yAt = (v: number) => MARGIN.top + PLOT_HEIGHT - (v / max) * PLOT_HEIGHT;

    const toPath = (key: "views" | "visitors") =>
      daily.map((d, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(d[key]).toFixed(1)}`).join(" ");

    const tickCount = 4;
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round((max / tickCount) * i));

    const step = Math.max(1, Math.ceil(n / 6));
    const labelIndices = daily
      .map((_, i) => i)
      .filter((i) => i % step === 0 || i === n - 1);

    return { max, xAt, yAt, viewsPath: toPath("views"), visitorsPath: toPath("visitors"), ticks, labelIndices };
  }, [daily, n]);

  if (n === 0) {
    return <p className={styles.empty}>Aucune donnée pour le moment.</p>;
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const ratio = (relX - MARGIN.left) / PLOT_WIDTH;
    const index = Math.min(n - 1, Math.max(0, Math.round(ratio * (n - 1))));
    setHoverIndex(index);
    setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top, wrapWidth: rect.width });
  };

  const handlePointerLeave = () => {
    setHoverIndex(null);
    setPointer(null);
  };

  const hovered = hoverIndex !== null ? daily[hoverIndex] : null;

  const lastViewsY = yAt(daily[n - 1].views);
  const lastVisitorsY = yAt(daily[n - 1].visitors);
  const endLabelsCollide = Math.abs(lastViewsY - lastVisitorsY) < 16;

  const tooltipLeft = pointer ? (pointer.x / pointer.wrapWidth) * 100 : 0;
  const flipTooltip = tooltipLeft > 65;

  return (
    <div>
      <div
        ref={wrapRef}
        className={styles.chartWrap}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} preserveAspectRatio="none">
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={MARGIN.left}
                x2={WIDTH - MARGIN.right}
                y1={yAt(t)}
                y2={yAt(t)}
                className={styles.gridline}
              />
              <text x={MARGIN.left - 8} y={yAt(t)} className={styles.axisTick} textAnchor="end" dominantBaseline="middle">
                {t.toLocaleString("fr-FR")}
              </text>
            </g>
          ))}

          {labelIndices.map((i) => (
            <text
              key={daily[i].day}
              x={xAt(i)}
              y={HEIGHT - MARGIN.bottom + 18}
              className={styles.axisTick}
              textAnchor="middle"
            >
              {formatDate(daily[i].day, { day: "2-digit", month: "2-digit" })}
            </text>
          ))}

          {hoverIndex !== null && (
            <line
              x1={xAt(hoverIndex)}
              x2={xAt(hoverIndex)}
              y1={MARGIN.top}
              y2={HEIGHT - MARGIN.bottom}
              className={styles.crosshair}
            />
          )}

          <path d={visitorsPath} fill="none" stroke={VISITORS_COLOR} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={viewsPath} fill="none" stroke={VIEWS_COLOR} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          <circle cx={xAt(n - 1)} cy={lastVisitorsY} r={4} fill={VISITORS_COLOR} stroke="#fffdf8" strokeWidth={2} />
          <circle cx={xAt(n - 1)} cy={lastViewsY} r={4} fill={VIEWS_COLOR} stroke="#fffdf8" strokeWidth={2} />

          {!endLabelsCollide && (
            <>
              <text x={xAt(n - 1) + 8} y={lastViewsY} className={styles.endLabel} dominantBaseline="middle">
                {daily[n - 1].views.toLocaleString("fr-FR")}
              </text>
              <text x={xAt(n - 1) + 8} y={lastVisitorsY} className={styles.endLabel} dominantBaseline="middle">
                {daily[n - 1].visitors.toLocaleString("fr-FR")}
              </text>
            </>
          )}

          {hoverIndex !== null && (
            <>
              <circle cx={xAt(hoverIndex)} cy={yAt(daily[hoverIndex].views)} r={4} fill={VIEWS_COLOR} stroke="#fffdf8" strokeWidth={2} />
              <circle cx={xAt(hoverIndex)} cy={yAt(daily[hoverIndex].visitors)} r={4} fill={VISITORS_COLOR} stroke="#fffdf8" strokeWidth={2} />
            </>
          )}
        </svg>

        {hovered && pointer && (
          <div
            className={styles.tooltip}
            style={{
              left: flipTooltip ? undefined : pointer.x + 12,
              right: flipTooltip ? pointer.wrapWidth - pointer.x + 12 : undefined,
              top: Math.max(0, pointer.y - 44),
            }}
          >
            <div className={styles.tooltipDate}>{formatDate(hovered.day, { weekday: "short", day: "2-digit", month: "long" })}</div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipKey} style={{ background: VIEWS_COLOR }} />
              <span className={styles.tooltipValue}>{hovered.views.toLocaleString("fr-FR")}</span>
              <span className={styles.tooltipLabel}>vues</span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipKey} style={{ background: VISITORS_COLOR }} />
              <span className={styles.tooltipValue}>{hovered.visitors.toLocaleString("fr-FR")}</span>
              <span className={styles.tooltipLabel}>visiteurs</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendKey} style={{ background: VIEWS_COLOR }} />
          Vues
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendKey} style={{ background: VISITORS_COLOR }} />
          Visiteurs uniques
        </span>
      </div>
    </div>
  );
}
