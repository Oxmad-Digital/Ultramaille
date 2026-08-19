import { connectDB } from "@/lib/db";
import Media from "@/models/Media";
import AdminShell from "@/components/admin/AdminShell";
import MediaAdminGrid, { type AdminMediaItem } from "@/components/admin/MediaAdminGrid";

export const dynamic = "force-dynamic";

async function getMedia(): Promise<AdminMediaItem[]> {
  await connectDB();
  const media = await Media.find({}).sort({ createdAt: -1 }).lean();
  return media.map((m) => ({
    id: m._id.toString(),
    url: m.url,
    publicId: m.publicId,
    filename: m.filename,
    alt: m.alt,
    format: m.format,
    bytes: m.bytes,
    width: m.width,
    height: m.height,
  }));
}

export default async function AdminMediaPage() {
  const media = await getMedia();
  return (
    <AdminShell crumb="Médias" showNewButton={false}>
      <MediaAdminGrid initialMedia={media} />
    </AdminShell>
  );
}
