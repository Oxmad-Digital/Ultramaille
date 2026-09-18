import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Media from "@/models/Media";
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

  await connectDB();

  const media = await Media.findById(id);
  if (!media) {
    return NextResponse.json({ error: "Média introuvable" }, { status: 404 });
  }

  if (body.alt !== undefined) media.alt = str(body.alt, 300);
  await media.save();

  return NextResponse.json({ success: true, media });
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
  await connectDB();
  await Media.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
