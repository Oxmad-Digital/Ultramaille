import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";
import { settings as settingsRepo } from "@/lib/repositories/settings";
import { getSiteSettings, SETTINGS_CACHE_TAG, SETTINGS_KEY } from "@/lib/settings";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json({
    success: true,
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
  });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const update: { maintenanceMode?: boolean; maintenanceMessage?: string } = {};
  if (typeof body.maintenanceMode === "boolean") {
    update.maintenanceMode = body.maintenanceMode;
  }
  if (typeof body.maintenanceMessage === "string") {
    update.maintenanceMessage = body.maintenanceMessage.trim();
  }

  const settings = await settingsRepo.update(SETTINGS_KEY, update);

  revalidateTag(SETTINGS_CACHE_TAG, "max");

  return NextResponse.json({
    success: true,
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
  });
}
