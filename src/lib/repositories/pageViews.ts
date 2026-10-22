import { query } from "@/lib/db";
import { count, text } from "./rows";

export type PageViewInput = {
  day: string;
  path: string;
  referrer: string;
  deviceType: string;
  country: string;
  visitorHash: string;
};

export const pageViews = {
  async create(input: PageViewInput): Promise<{ _id: string; id: string }> {
    const [row] = await query(
      "INSERT INTO page_views (day, path, referrer, device_type, country, visitor_hash) " +
        "VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [input.day, input.path, input.referrer, input.deviceType, input.country, input.visitorHash]
    );
    const id = String(row.id);
    return { _id: id, id };
  },

  async setDuration(id: string, duration: number) {
    await query("UPDATE page_views SET duration = $2 WHERE id = $1", [id, duration]);
  },

  // Agrégats du tableau de bord sur les jours >= startDay ('YYYY-MM-DD').
  async stats(startDay: string) {
    const p = [startDay];
    const [
      [totals],
      daily,
      topPages,
      topReferrers,
      [direct],
      deviceTypes,
      topCountries,
      [duration],
    ] = await Promise.all([
      query(
        "SELECT count(*) AS views, count(DISTINCT visitor_hash) AS visitors " +
          "FROM page_views WHERE day >= $1",
        p
      ),
      query(
        "SELECT day, count(*) AS views, count(DISTINCT visitor_hash) AS visitors " +
          "FROM page_views WHERE day >= $1 GROUP BY day ORDER BY day",
        p
      ),
      query(
        "SELECT path, count(*) AS views FROM page_views WHERE day >= $1 " +
          "GROUP BY path ORDER BY views DESC LIMIT 10",
        p
      ),
      query(
        "SELECT referrer, count(*) AS views FROM page_views WHERE day >= $1 AND referrer <> '' " +
          "GROUP BY referrer ORDER BY views DESC LIMIT 10",
        p
      ),
      query("SELECT count(*) AS n FROM page_views WHERE day >= $1 AND referrer = ''", p),
      query(
        "SELECT device_type, count(*) AS views FROM page_views WHERE day >= $1 " +
          "GROUP BY device_type ORDER BY views DESC",
        p
      ),
      query(
        "SELECT country, count(*) AS views FROM page_views WHERE day >= $1 AND country <> '' " +
          "GROUP BY country ORDER BY views DESC",
        p
      ),
      query(
        "SELECT avg(duration) AS avg FROM page_views WHERE day >= $1 AND duration > 0",
        p
      ),
    ]);

    return {
      totalViews: count(totals?.views),
      totalVisitors: count(totals?.visitors),
      daily: daily.map((r) => ({ day: text(r.day), views: count(r.views), visitors: count(r.visitors) })),
      topPages: topPages.map((r) => ({ path: text(r.path), views: count(r.views) })),
      topReferrers: topReferrers.map((r) => ({ referrer: text(r.referrer), views: count(r.views) })),
      directViews: count(direct?.n),
      deviceTypes: deviceTypes.map((r) => ({ deviceType: text(r.device_type), views: count(r.views) })),
      topCountries: topCountries.map((r) => ({ country: text(r.country), views: count(r.views) })),
      avgDuration: duration?.avg === null || duration?.avg === undefined ? null : Number(duration.avg),
    };
  },
};
