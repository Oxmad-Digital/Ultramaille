import styles from "./StatsView.module.css";
import DailyTrafficChart from "./DailyTrafficChart";
import MagnitudeBarList from "./MagnitudeBarList";
import StatsWorldMap from "./StatsWorldMap";
import { countryLabel } from "@/lib/country-label";

type DailyPoint = { day: string; views: number; visitors: number };
type TopPage = { path: string; views: number };
type TopReferrer = { referrer: string; views: number };
type DeviceType = { deviceType: string; views: number };
type TopCountry = { country: string; views: number };

const DEVICE_LABELS: Record<string, string> = {
  desktop: "Ordinateur",
  mobile: "Mobile",
  tablet: "Tablette",
  console: "Console",
  smarttv: "TV connectée",
  wearable: "Montre connectée",
  embedded: "Autre",
};

function formatDuration(ms: number | null) {
  if (ms == null) return "—";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes} min ${seconds.toString().padStart(2, "0")}` : `${seconds} s`;
}

export default function StatsView({
  totalViews,
  totalVisitors,
  daily,
  topPages,
  topReferrers,
  directViews,
  deviceTypes,
  topCountries,
  avgDurationMs,
  rangeDays,
}: {
  totalViews: number;
  totalVisitors: number;
  daily: DailyPoint[];
  topPages: TopPage[];
  topReferrers: TopReferrer[];
  directViews: number;
  deviceTypes: DeviceType[];
  topCountries: TopCountry[];
  avgDurationMs: number | null;
  rangeDays: number;
}) {
  const avgPerDay = rangeDays > 0 ? Math.round(totalViews / rangeDays) : 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Vues ({rangeDays} j)</div>
          <div className={styles.kpiValue}>{totalViews.toLocaleString("fr-FR")}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Visiteurs uniques</div>
          <div className={styles.kpiValue}>{totalVisitors.toLocaleString("fr-FR")}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Moyenne / jour</div>
          <div className={styles.kpiValue}>{avgPerDay.toLocaleString("fr-FR")}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Durée moyenne / session</div>
          <div className={styles.kpiValue}>{formatDuration(avgDurationMs)}</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Trafic quotidien</div>
        <DailyTrafficChart daily={daily} />
      </div>

      <div className={styles.threeCol}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Pages les plus vues</div>
          <MagnitudeBarList items={topPages.map((p) => ({ label: p.path, value: p.views }))} />
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Provenance</div>
          <MagnitudeBarList
            items={[
              { label: "Direct", value: directViews },
              ...topReferrers.map((r) => ({ label: r.referrer, value: r.views })),
            ]}
          />
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Appareils</div>
          <MagnitudeBarList
            items={deviceTypes.map((d) => ({
              label: DEVICE_LABELS[d.deviceType] ?? d.deviceType,
              value: d.views,
            }))}
          />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Origine géographique</div>
        <div className={styles.geoLayout}>
          <MagnitudeBarList
            items={topCountries.slice(0, 10).map((c) => ({ label: countryLabel(c.country), value: c.views }))}
          />
          <StatsWorldMap countries={topCountries} />
        </div>
      </div>
    </div>
  );
}
