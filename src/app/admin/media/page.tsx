import { requirePageSession } from "@/lib/requireAdmin";
import { media as mediaRepo } from "@/lib/repositories/media";
import AdminShell from "@/components/admin/AdminShell";
import MediaAdminGrid, { type AdminMediaItem } from "@/components/admin/MediaAdminGrid";

export const dynamic = "force-dynamic";

async function getMedia(): Promise<AdminMediaItem[]> {
  const media = await mediaRepo.findAll();
  return media.map((m) => ({
    id: m.id,
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
  await requirePageSession();
  const media = await getMedia();
  return (
    <AdminShell crumb="Médias" showNewButton={false}>
      <MediaAdminGrid initialMedia={media} />
    </AdminShell>
  );
}
