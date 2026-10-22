import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { media as mediaRepo } from "@/lib/repositories/media";
import { badRequest, invalidId, isValidId, readJson, str } from "@/lib/http";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidId(id)) return invalidId();
  const body = await readJson(request);
  if (!body) return badRequest();

  const media = await mediaRepo.findById(id);
  if (!media) {
    return NextResponse.json({ error: "Média introuvable" }, { status: 404 });
  }

  if (body.alt !== undefined) media.alt = str(body.alt, 300);
  const saved = await mediaRepo.save(media);

  return NextResponse.json({ success: true, media: saved });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidId(id)) return invalidId();
  await mediaRepo.deleteById(id);

  return NextResponse.json({ success: true });
}
