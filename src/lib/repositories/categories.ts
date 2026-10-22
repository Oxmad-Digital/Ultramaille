import { query, withTransaction, type Row } from "@/lib/db";
import { articles } from "./articles";
import { count, date, ids, text } from "./rows";

export type Category = {
  _id: string;
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

function toCategory(r: Row): Category {
  return {
    ...ids(r.id),
    name: text(r.name),
    slug: text(r.slug),
    createdAt: date(r.created_at),
    updatedAt: date(r.updated_at),
  };
}

export const categories = {
  async findAll(): Promise<Category[]> {
    const rows = await query('SELECT * FROM categories ORDER BY name COLLATE "C"');
    return rows.map(toCategory);
  },

  async findById(id: string): Promise<Category | null> {
    const [row] = await query("SELECT * FROM categories WHERE id = $1", [id]);
    return row ? toCategory(row) : null;
  },

  async findByName(name: string, excludeId?: string): Promise<Category | null> {
    const [row] = await query(
      "SELECT * FROM categories WHERE name = $1 AND ($2::uuid IS NULL OR id <> $2::uuid)",
      [name, excludeId ?? null]
    );
    return row ? toCategory(row) : null;
  },

  async slugExists(slug: string): Promise<boolean> {
    const rows = await query("SELECT 1 FROM categories WHERE slug = $1 LIMIT 1", [slug]);
    return rows.length > 0;
  },

  async create(input: { name: string; slug: string }): Promise<Category> {
    const [row] = await query(
      "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *",
      [input.name, input.slug.trim().toLowerCase()]
    );
    return toCategory(row);
  },

  // Renomme la catégorie et les articles qui la portent, de façon atomique.
  async rename(category: Category, name: string): Promise<Category> {
    return withTransaction(async (client) => {
      const { rows } = await client.query(
        "UPDATE categories SET name = $2 WHERE id = $1 RETURNING *",
        [category.id, name]
      );
      if (category.name !== name) {
        await articles.renameCategory(client, category.name, name);
      }
      return toCategory(rows[0]);
    });
  },

  // Supprime la catégorie et la retire des articles, de façon atomique.
  async deleteById(id: string): Promise<Category | null> {
    return withTransaction(async (client) => {
      const { rows } = await client.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);
      if (!rows[0]) return null;
      const category = toCategory(rows[0]);
      await articles.clearCategory(client, category.name);
      return category;
    });
  },

  async count(): Promise<number> {
    const [row] = await query("SELECT count(*) AS n FROM categories");
    return count(row.n);
  },
};
