import { query, type Row } from "@/lib/db";
import { count, date, ids, text, textOrNull } from "./rows";

export type Author = {
  _id: string;
  id: string;
  name: string;
  slug: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthorInput = Omit<Author, "_id" | "id" | "createdAt" | "updatedAt">;

function toAuthor(r: Row): Author {
  return {
    ...ids(r.id),
    name: text(r.name),
    slug: text(r.slug),
    email: text(r.email),
    bio: text(r.bio),
    avatarUrl: textOrNull(r.avatar_url),
    avatarPublicId: textOrNull(r.avatar_public_id),
    createdAt: date(r.created_at),
    updatedAt: date(r.updated_at),
  };
}

function values(a: AuthorInput): unknown[] {
  return [
    a.name.trim(), a.slug.trim().toLowerCase(), a.email.trim(), a.bio, a.avatarUrl,
    a.avatarPublicId,
  ];
}

export const authors = {
  async findAll(): Promise<Author[]> {
    const rows = await query('SELECT * FROM authors ORDER BY name COLLATE "C"');
    return rows.map(toAuthor);
  },

  async findById(id: string): Promise<Author | null> {
    const [row] = await query("SELECT * FROM authors WHERE id = $1", [id]);
    return row ? toAuthor(row) : null;
  },

  async findByName(name: string, excludeId?: string): Promise<Author | null> {
    const [row] = await query(
      "SELECT * FROM authors WHERE name = $1 AND ($2::uuid IS NULL OR id <> $2::uuid)",
      [name, excludeId ?? null]
    );
    return row ? toAuthor(row) : null;
  },

  async slugExists(slug: string): Promise<boolean> {
    const rows = await query("SELECT 1 FROM authors WHERE slug = $1 LIMIT 1", [slug]);
    return rows.length > 0;
  },

  async create(input: AuthorInput): Promise<Author> {
    const [row] = await query(
      "INSERT INTO authors (name, slug, email, bio, avatar_url, avatar_public_id) " +
        "VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      values(input)
    );
    return toAuthor(row);
  },

  // Équivalent de document.save().
  async save(author: Author): Promise<Author> {
    const [row] = await query(
      "UPDATE authors SET name = $2, slug = $3, email = $4, bio = $5, avatar_url = $6, " +
        "avatar_public_id = $7 WHERE id = $1 RETURNING *",
      [author.id, ...values(author)]
    );
    return toAuthor(row);
  },

  // Les articles de cet auteur passent à author_id NULL (ON DELETE SET NULL).
  async deleteById(id: string) {
    await query("DELETE FROM authors WHERE id = $1", [id]);
  },

  async count(): Promise<number> {
    const [row] = await query("SELECT count(*) AS n FROM authors");
    return count(row.n);
  },
};
