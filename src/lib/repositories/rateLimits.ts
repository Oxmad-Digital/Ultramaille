import { query } from "@/lib/db";

// Probabilité de purger les fenêtres expirées à chaque appel (pas de TTL en Postgres).
const PURGE_PROBABILITY = 0.01;

export const rateLimits = {
  // Incrémente le compteur de la fenêtre active, ou en ouvre une nouvelle si elle est
  // absente ou expirée. Atomique. Renvoie le compteur après incrément.
  async hit(key: string, windowMs: number): Promise<number> {
    const [row] = await query(
      "INSERT INTO rate_limits (key, count, expires_at) " +
        "VALUES ($1, 1, now() + $2 * interval '1 millisecond') " +
        "ON CONFLICT (key) DO UPDATE SET " +
        "count = CASE WHEN rate_limits.expires_at > now() THEN rate_limits.count + 1 ELSE 1 END, " +
        "expires_at = CASE WHEN rate_limits.expires_at > now() " +
        "THEN rate_limits.expires_at ELSE EXCLUDED.expires_at END " +
        "RETURNING count",
      [key, windowMs]
    );

    if (Math.random() < PURGE_PROBABILITY) {
      await query("DELETE FROM rate_limits WHERE expires_at < now()");
    }

    return Number(row.count);
  },
};
