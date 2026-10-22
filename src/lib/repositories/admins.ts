import { query, type Row } from "@/lib/db";
import { count, date, dateOrNull, ids, text, textOrNull } from "./rows";

export type AdminRole = "admin" | "member";

export type Admin = {
  _id: string;
  id: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  resetTokenHash: string | null;
  resetTokenExpiry: Date | null;
  invitePending: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminInput = Omit<Admin, "_id" | "id" | "createdAt" | "updatedAt">;

function toAdmin(r: Row): Admin {
  return {
    ...ids(r.id),
    email: text(r.email),
    passwordHash: text(r.password_hash),
    role: r.role as AdminRole,
    resetTokenHash: textOrNull(r.reset_token_hash),
    resetTokenExpiry: dateOrNull(r.reset_token_expiry),
    invitePending: Boolean(r.invite_pending),
    createdAt: date(r.created_at),
    updatedAt: date(r.updated_at),
  };
}

function values(a: AdminInput): unknown[] {
  return [
    a.email.trim().toLowerCase(), a.passwordHash, a.role, a.resetTokenHash, a.resetTokenExpiry,
    a.invitePending,
  ];
}

export const admins = {
  async findAll(): Promise<Admin[]> {
    const rows = await query('SELECT * FROM admins ORDER BY email COLLATE "C"');
    return rows.map(toAdmin);
  },

  async findById(id: string): Promise<Admin | null> {
    const [row] = await query("SELECT * FROM admins WHERE id = $1", [id]);
    return row ? toAdmin(row) : null;
  },

  async findRoleById(id: string): Promise<AdminRole | null> {
    const [row] = await query("SELECT role FROM admins WHERE id = $1", [id]);
    return row ? (row.role as AdminRole) : null;
  },

  async findByEmail(email: string): Promise<Admin | null> {
    const [row] = await query("SELECT * FROM admins WHERE email = $1", [email]);
    return row ? toAdmin(row) : null;
  },

  async findByValidResetToken(tokenHash: string): Promise<Admin | null> {
    const [row] = await query(
      "SELECT * FROM admins WHERE reset_token_hash = $1 AND reset_token_expiry > now()",
      [tokenHash]
    );
    return row ? toAdmin(row) : null;
  },

  async create(input: AdminInput): Promise<Admin> {
    const [row] = await query(
      "INSERT INTO admins (email, password_hash, role, reset_token_hash, reset_token_expiry, " +
        "invite_pending) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      values(input)
    );
    return toAdmin(row);
  },

  // Équivalent de document.save().
  async save(admin: Admin): Promise<Admin> {
    const [row] = await query(
      "UPDATE admins SET email = $2, password_hash = $3, role = $4, reset_token_hash = $5, " +
        "reset_token_expiry = $6, invite_pending = $7 WHERE id = $1 RETURNING *",
      [admin.id, ...values(admin)]
    );
    return toAdmin(row);
  },

  async deleteById(id: string) {
    await query("DELETE FROM admins WHERE id = $1", [id]);
  },

  // Administrateurs (rôle autre que member) hors celui indiqué.
  async countAdminsExcept(id: string): Promise<number> {
    const [row] = await query(
      "SELECT count(*) AS n FROM admins WHERE id <> $1 AND role <> 'member'",
      [id]
    );
    return count(row.n);
  },
};
