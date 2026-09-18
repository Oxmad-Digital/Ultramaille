import crypto from "crypto";

// Clés dérivées d'AUTH_SECRET avec un libellé par usage : le secret de session n'est
// jamais utilisé tel quel pour autre chose, et les usages ne se recoupent pas.
function derivedKey(label: string) {
  return crypto
    .createHmac("sha256", process.env.AUTH_SECRET ?? "")
    .update(`ultramaille:${label}`)
    .digest();
}

export function visitorPepper() {
  return derivedKey("visitor-hash").toString("hex");
}

// Jeton renvoyé avec l'id d'une vue : prouve que l'appelant est celui qui l'a créée
// (sans lui, n'importe qui pourrait écraser la durée de n'importe quelle vue).
export function signViewId(id: string) {
  return crypto.createHmac("sha256", derivedKey("view-id")).update(id).digest("hex").slice(0, 32);
}

export function verifyViewId(id: string, token: unknown) {
  if (typeof token !== "string") return false;
  const expected = Buffer.from(signViewId(id));
  const given = Buffer.from(token);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
