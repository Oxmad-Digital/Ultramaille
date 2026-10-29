// Envoi d'une image vers R2 depuis le navigateur : la route admin signe l'URL,
// le fichier part ensuite directement vers R2 sans passer par le serveur Next.

export type UploadedImage = {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
};

type SignedUpload = { uploadUrl: string; publicUrl: string; key: string };

// Valeur de l'attribut accept des sélecteurs de fichier, alignée sur ALLOWED_TYPES
// de la route /api/admin/upload.
export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/gif,image/avif";

const UPLOAD_FAILED = "Échec de l'envoi de l'image";

// Dimensions lues par le navigateur. Certains formats (ex. AVIF selon le navigateur)
// ne se décodent pas : on renvoie 0, la valeur par défaut de la table media.
async function readDimensions(file: File) {
  if (typeof createImageBitmap !== "function") return { width: 0, height: 0 };
  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  } catch {
    return { width: 0, height: 0 };
  }
}

async function requestSignedUpload(file: File): Promise<SignedUpload> {
  let res: Response;
  try {
    res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.type, size: file.size }),
    });
  } catch {
    throw new Error(UPLOAD_FAILED);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // Les messages de la route sont déjà rédigés pour l'utilisateur
    // (type refusé, fichier trop lourd, non autorisé).
    const message = typeof data?.error === "string" ? data.error : UPLOAD_FAILED;
    throw new Error(message);
  }
  if (
    typeof data?.uploadUrl !== "string" ||
    typeof data?.publicUrl !== "string" ||
    typeof data?.key !== "string"
  ) {
    throw new Error(UPLOAD_FAILED);
  }
  return data as SignedUpload;
}

export async function uploadImage(file: File): Promise<UploadedImage> {
  const [signed, dimensions] = await Promise.all([requestSignedUpload(file), readDimensions(file)]);

  // Content-Type doit être identique à celui signé, sinon R2 refuse le PUT.
  let res: Response;
  try {
    res = await fetch(signed.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
  } catch {
    throw new Error(UPLOAD_FAILED);
  }
  if (!res.ok) throw new Error(UPLOAD_FAILED);

  return {
    url: signed.publicUrl,
    publicId: signed.key,
    format: signed.key.slice(signed.key.lastIndexOf(".") + 1),
    bytes: file.size,
    ...dimensions,
  };
}
