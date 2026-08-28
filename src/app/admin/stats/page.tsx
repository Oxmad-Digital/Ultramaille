import { connectDB } from "@/lib/db";
import PageView from "@/models/PageView";
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
  await connectDB();
  const startDay = daysAgo(RANGE_DAYS - 1);
  const match = { day: { $gte: startDay } };

  const [totals] = await PageView.aggregate([
    { $match: match },
    { $group: { _id: null, views: { $sum: 1 }, visitors: { $addToSet: "$visitorHash" } } },
    { $project: { _id: 0, views: 1, visitors: { $size: "$visitors" } } },
  ]);

  const dailyRaw = await PageView.aggregate([
    { $match: match },
    { $group: { _id: "$day", views: { $sum: 1 }, visitors: { $addToSet: "$visitorHash" } } },
    { $project: { _id: 0, day: "$_id", views: 1, visitors: { $size: "$visitors" } } },
    { $sort: { day: 1 } },
  ]);

  const dailyByDay = new Map(dailyRaw.map((d) => [d.day, d]));
  const daily = Array.from({ length: RANGE_DAYS }, (_, i) => {
    const day = daysAgo(RANGE_DAYS - 1 - i);
    return dailyByDay.get(day) ?? { day, views: 0, visitors: 0 };
  });

  const topPages = await PageView.aggregate([
    { $match: match },
    { $group: { _id: "$path", views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 10 },
    { $project: { _id: 0, path: "$_id", views: 1 } },
  ]);

  const topReferrers = await PageView.aggregate([
    { $match: { ...match, referrer: { $ne: "" } } },
    { $group: { _id: "$referrer", views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 10 },
    { $project: { _id: 0, referrer: "$_id", views: 1 } },
  ]);

  const directViews = await PageView.countDocuments({ ...match, referrer: "" });

  return {
    totalViews: totals?.views ?? 0,
    totalVisitors: totals?.visitors ?? 0,
    daily,
    topPages,
    topReferrers,
    directViews,
  };
}

export default async function AdminStatsPage() {
  const stats = await getStats();

  return (
    <AdminShell crumb="Statistiques" showNewButton={false}>
      <StatsView {...stats} rangeDays={RANGE_DAYS} />
    </AdminShell>
  );
}
