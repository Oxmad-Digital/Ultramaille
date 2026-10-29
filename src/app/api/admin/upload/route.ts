import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAdmin } from "@/lib/requireAdmin";
import { badRequest, readJson } from "@/lib/http";
import { getR2Bucket, getR2Client, r2PublicUrlFor } from "@/lib/r2";

// Types acceptés -> extension du fichier stocké. L'extension vient uniquement d'ici,
// jamais du nom de fichier envoyé par le navigateur.
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_BYTES = 10 * 1024 * 1024;
const URL_TTL_SECONDS = 5 * 60;

// Renvoie une URL signée pour envoyer l'image directement du navigateur vers R2.
// Content-Type et Content-Length sont signés : R2 refuse un PUT qui ne correspond pas.
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await readJson(request);
  if (!body) return badRequest();

  const contentType = body.contentType;
  if (typeof contentType !== "string" || !Object.hasOwn(ALLOWED_TYPES, contentType)) {
    return badRequest("Format d'image non pris en charge (JPEG, PNG, WebP, GIF ou AVIF)");
  }

  const size = body.size;
  if (typeof size !== "number" || !Number.isInteger(size) || size <= 0) {
    return badRequest("Taille de fichier invalide");
  }
  if (size > MAX_BYTES) {
    return badRequest("Image trop volumineuse (10 Mo maximum)");
  }

  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const key = `uploads/${now.getUTCFullYear()}/${month}/${randomUUID()}.${ALLOWED_TYPES[contentType]}`;

  try {
    const command = new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    });
    const uploadUrl = await getSignedUrl(getR2Client(), command, {
      expiresIn: URL_TTL_SECONDS,
      // Sans cela, le presigner exclut content-type des en-têtes signés.
      signableHeaders: new Set(["content-type", "content-length"]),
    });

    return NextResponse.json({ success: true, uploadUrl, publicUrl: r2PublicUrlFor(key), key });
  } catch (err) {
    console.error("Erreur de génération de l'URL d'upload R2", err);
    return NextResponse.json({ error: "Impossible de préparer l'envoi de l'image" }, { status: 500 });
  }
}
