import styles from "./StatsView.module.css";
import DailyTrafficChart from "./DailyTrafficChart";
import MagnitudeBarList from "./MagnitudeBarList";

type DailyPoint = { day: string; views: number; visitors: number };
type TopPage = { path: string; views: number };
type TopReferrer = { referrer: string; views: number };

export default function StatsView({
  totalViews,
  totalVisitors,
  daily,
  topPages,
  topReferrers,
  directViews,
  rangeDays,
}: {
  totalViews: number;
  totalVisitors: number;
  daily: DailyPoint[];
  topPages: TopPage[];
  topReferrers: TopReferrer[];
  directViews: number;
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
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Trafic quotidien</div>
        <DailyTrafficChart daily={daily} />
      </div>

      <div className={styles.twoCol}>
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
      </div>
    </div>
  );
}
