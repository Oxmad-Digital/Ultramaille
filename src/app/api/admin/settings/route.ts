import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import { getSiteSettings, SETTINGS_KEY } from "@/lib/settings";

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
  const update: Record<string, unknown> = {};
  if (typeof body.maintenanceMode === "boolean") {
    update.maintenanceMode = body.maintenanceMode;
  }
  if (typeof body.maintenanceMessage === "string") {
    update.maintenanceMessage = body.maintenanceMessage.trim();
  }

  await connectDB();
  const settings = await Settings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $set: update, $setOnInsert: { key: SETTINGS_KEY } },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({
    success: true,
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
  });
}
