import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import PageView from "@/models/PageView";
import { memoryRateLimit, tooManyRequests } from "@/lib/rateLimit";
import { isTrackablePath } from "@/lib/site";
import { signViewId, visitorPepper } from "@/lib/trackingToken";

export async function POST(request: NextRequest) {
  const { isBot, device } = userAgent(request);
  if (isBot) {
    return NextResponse.json({ ok: true });
  }

  let body: { path?: unknown; referrer?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 300) : "";
  if (!path.startsWith("/")) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  // Chemins inconnus (admin, 404, valeurs forgées) : ignorés sans erreur.
  if (!isTrackablePath(path)) {
    return NextResponse.json({ ok: true });
  }

  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "Origine refusée" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Origine refusée" }, { status: 403 });
    }
  }

  let referrer = "";
  if (typeof body.referrer === "string" && body.referrer) {
    try {
      const refUrl = new URL(body.referrer);
      if (refUrl.host !== host) referrer = refUrl.host;
    } catch {
      referrer = "";
    }
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!memoryRateLimit("track", ip, { limit: 120, windowMs: 60 * 1000 })) {
    return tooManyRequests();
  }

  const day = new Date().toISOString().slice(0, 10);
  const pepper = visitorPepper();
  const visitorHash = crypto
    .createHash("sha256")
    .update(`${ip}|${request.headers.get("user-agent") ?? ""}|${day}|${pepper}`)
    .digest("hex")
    .slice(0, 32);

  const country = request.headers.get("x-vercel-ip-country") ?? "";

  await connectDB();
  const doc = await PageView.create({
    day,
    path,
    referrer,
    deviceType: device.type ?? "desktop",
    country,
    visitorHash,
  });

  const id = doc._id.toString();
  return NextResponse.json({ ok: true, id, token: signViewId(id) });
}
