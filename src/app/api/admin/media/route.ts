import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Media from "@/models/Media";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const media = await Media.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    success: true,
    media: media.map((m) => ({
      id: m._id.toString(),
      url: m.url,
      publicId: m.publicId,
      filename: m.filename,
      alt: m.alt,
      format: m.format,
      bytes: m.bytes,
      width: m.width,
      height: m.height,
      createdAt: m.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const url = (body.url || "").trim();
  const publicId = (body.publicId || "").trim();
  if (!url || !publicId) {
    return NextResponse.json({ error: "url et publicId requis" }, { status: 400 });
  }

  await connectDB();

  const media = await Media.create({
    url,
    publicId,
    filename: body.filename || "",
    alt: body.alt || "",
    format: body.format || "",
    bytes: body.bytes || 0,
    width: body.width || 0,
    height: body.height || 0,
  });

  return NextResponse.json({ success: true, media }, { status: 201 });
}
