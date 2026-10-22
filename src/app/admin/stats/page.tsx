import { requirePageSession } from "@/lib/requireAdmin";
import { pageViews } from "@/lib/repositories/pageViews";
import AdminShell from "@/components/admin/AdminShell";
import StatsView from "@/components/admin/StatsView";

export const dynamic = "force-dynamic";

const RANGE_DAYS = 30;

function daysAgo(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

async function getStats() {
  const startDay = daysAgo(RANGE_DAYS - 1);
  const stats = await pageViews.stats(startDay);

  const dailyByDay = new Map(stats.daily.map((d) => [d.day, d]));
  const daily = Array.from({ length: RANGE_DAYS }, (_, i) => {
    const day = daysAgo(RANGE_DAYS - 1 - i);
    return dailyByDay.get(day) ?? { day, views: 0, visitors: 0 };
  });

  return {
    totalViews: stats.totalViews,
    totalVisitors: stats.totalVisitors,
    daily,
    topPages: stats.topPages,
    topReferrers: stats.topReferrers,
    directViews: stats.directViews,
    deviceTypes: stats.deviceTypes,
    topCountries: stats.topCountries,
    avgDurationMs: stats.avgDuration,
  };
}

export default async function AdminStatsPage() {
  await requirePageSession();
  const stats = await getStats();

  return (
    <AdminShell crumb="Statistiques" showNewButton={false}>
      <StatsView {...stats} rangeDays={RANGE_DAYS} />
    </AdminShell>
  );
}
