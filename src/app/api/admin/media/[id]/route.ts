import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Media from "@/models/Media";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  await connectDB();

  const media = await Media.findById(id);
  if (!media) {
    return NextResponse.json({ error: "Média introuvable" }, { status: 404 });
  }

  media.alt = (body.alt ?? media.alt).trim();
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
  await connectDB();
  await Media.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
