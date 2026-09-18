import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Media from "@/models/Media";
import { badRequest, isDuplicateKeyError, readJson, str } from "@/lib/http";
import { isCloudinaryUrl } from "@/lib/cloudinary";

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

  const body = await readJson(request);
  if (!body) return badRequest();

  const url = str(body.url, 1000);
  const publicId = str(body.publicId, 300);
  if (!isCloudinaryUrl(url) || !publicId) {
    return badRequest("url Cloudinary et publicId requis");
  }

  const num = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;

  await connectDB();

  let media;
  try {
    media = await Media.create({
      url,
      publicId,
      filename: str(body.filename, 300),
      alt: str(body.alt, 300),
      format: str(body.format, 20),
      bytes: num(body.bytes),
      width: num(body.width),
      height: num(body.height),
    });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ error: "Ce média existe déjà" }, { status: 409 });
    }
    throw err;
  }

  return NextResponse.json({ success: true, media }, { status: 201 });
}
