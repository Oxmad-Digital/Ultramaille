import { query, type Row } from "@/lib/db";
import { date, ids, text } from "./rows";

export type Settings = {
  _id: string;
  id: string;
  key: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  createdAt: Date;
  updatedAt: Date;
};

function toSettings(r: Row): Settings {
  return {
    ...ids(r.id),
    key: text(r.key),
    maintenanceMode: Boolean(r.maintenance_mode),
    maintenanceMessage: text(r.maintenance_message),
    createdAt: date(r.created_at),
    updatedAt: date(r.updated_at),
  };
}

export const settings = {
  // Lit la ligne, en la créant avec les valeurs par défaut si besoin (sans toucher updated_at).
  async getOrCreate(key: string): Promise<Settings> {
    const [row] = await query(
      "WITH ins AS (INSERT INTO settings (key) VALUES ($1) ON CONFLICT (key) DO NOTHING RETURNING *) " +
        "SELECT * FROM ins UNION ALL SELECT * FROM settings WHERE key = $1 LIMIT 1",
      [key]
    );
    return toSettings(row);
  },

  // Upsert : seuls les champs fournis sont modifiés.
  async update(
    key: string,
    patch: { maintenanceMode?: boolean; maintenanceMessage?: string }
  ): Promise<Settings> {
    const [row] = await query(
      "INSERT INTO settings (key, maintenance_mode, maintenance_message) " +
        "VALUES ($1, COALESCE($2::boolean, false), COALESCE($3::text, '')) " +
        "ON CONFLICT (key) DO UPDATE SET " +
        "maintenance_mode = COALESCE($2::boolean, settings.maintenance_mode), " +
        "maintenance_message = COALESCE($3::text, settings.maintenance_message) " +
        "RETURNING *",
      [key, patch.maintenanceMode ?? null, patch.maintenanceMessage?.trim() ?? null]
    );
    return toSettings(row);
  },
};
