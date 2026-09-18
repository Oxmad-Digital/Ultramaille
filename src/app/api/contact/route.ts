import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/site";
import { sendContactEmail } from "@/lib/mailer";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX = { name: 120, company: 120, email: 254, phone: 40, message: 5000 };

// Champ trim + tronqué ; toute valeur non-string devient "".
// Les retours à la ligne sont retirés des champs mono-ligne (sujet d'email).
function field(value: unknown, max: number, multiline = false) {
  if (typeof value !== "string") return "";
  const cleaned = multiline ? value : value.replace(/[\r\n]+/g, " ");
  return cleaned.trim().slice(0, max);
}

export async function POST(request: Request) {
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

  const allowed = await rateLimit("contact", getClientIp(request.headers), {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) return tooManyRequests();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  // Champ piège : invisible pour un humain, rempli par les robots.
  // On répond "ok" sans rien envoyer pour ne pas les renseigner.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  const contact = {
    name: field(body.name, MAX.name),
    company: field(body.company, MAX.company),
    email: field(body.email, MAX.email),
    phone: field(body.phone, MAX.phone),
    message: field(body.message, MAX.message, true),
  };

  if (!contact.name || !contact.message || !EMAIL_RE.test(contact.email) || body.consent !== true) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  }

  try {
    await sendContactEmail(process.env.CONTACT_TO_EMAIL || CONTACT.email, contact);
  } catch (err) {
    console.error("Échec de l'envoi du message de contact", err);
    return NextResponse.json({ error: "Envoi impossible" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
