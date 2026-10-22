import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidId } from "@/lib/http";
import { pageViews } from "@/lib/repositories/pageViews";
import { verifyViewId } from "@/lib/trackingToken";
import { getClientIp, memoryRateLimit, tooManyRequests } from "@/lib/rateLimit";

const MAX_DURATION_MS = 30 * 60 * 1000;

export async function POST(request: NextRequest) {
  if (!memoryRateLimit("track-duration", getClientIp(request.headers), { limit: 120, windowMs: 60 * 1000 })) {
    return tooManyRequests();
  }

  let body: { id?: unknown; token?: unknown; duration?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const duration = typeof body.duration === "number" ? body.duration : NaN;

  if (
    !isValidId(id) ||
    !verifyViewId(id, body.token) ||
    !Number.isFinite(duration) ||
    duration <= 0
  ) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
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

  await pageViews.setDuration(id, Math.min(duration, MAX_DURATION_MS));

  return NextResponse.json({ ok: true });
}
