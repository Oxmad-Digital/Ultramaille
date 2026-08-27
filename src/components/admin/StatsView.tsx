import styles from "./StatsView.module.css";

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
  const maxDailyViews = Math.max(1, ...daily.map((d) => d.views));

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
        {daily.length === 0 ? (
          <p className={styles.empty}>Aucune donnée pour le moment.</p>
        ) : (
          <div className={styles.dailyChart}>
            {daily.map((d) => (
              <div key={d.day} className={styles.dailyRow}>
                <span className={styles.dailyDay}>
                  {new Date(d.day).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
                </span>
                <div className={styles.dailyBarTrack}>
                  <div
                    className={styles.dailyBar}
                    style={{ width: `${Math.max(2, (d.views / maxDailyViews) * 100)}%` }}
                  />
                </div>
                <span className={styles.dailyValue}>{d.views}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.twoCol}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Pages les plus vues</div>
          {topPages.length === 0 ? (
            <p className={styles.empty}>Aucune donnée pour le moment.</p>
          ) : (
            <table className={styles.table}>
              <tbody>
                {topPages.map((p) => (
                  <tr key={p.path}>
                    <td className={styles.tablePath}>{p.path}</td>
                    <td className={styles.tableValue}>{p.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Provenance</div>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.tablePath}>Direct</td>
                <td className={styles.tableValue}>{directViews}</td>
              </tr>
              {topReferrers.map((r) => (
                <tr key={r.referrer}>
                  <td className={styles.tablePath}>{r.referrer}</td>
                  <td className={styles.tableValue}>{r.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
