import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { media as mediaRepo } from "@/lib/repositories/media";
import { badRequest, isDuplicateKeyError, readJson, str } from "@/lib/http";
import { isAllowedImageUrl } from "@/lib/imageUrl";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const media = await mediaRepo.findAll();

  return NextResponse.json({
    success: true,
    media: media.map((m) => ({
      id: m.id,
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
  if (!isAllowedImageUrl(url) || !publicId) {
    return badRequest("URL d'image invalide ou publicId manquant");
  }

  const num = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;

  let media;
  try {
    media = await mediaRepo.create({
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
