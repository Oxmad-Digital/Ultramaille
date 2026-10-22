import { query, type Row } from "@/lib/db";
import { count, date, ids, text } from "./rows";

export type Media = {
  _id: string;
  id: string;
  url: string;
  publicId: string;
  filename: string;
  alt: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
};

export type MediaInput = Omit<Media, "_id" | "id" | "createdAt" | "updatedAt">;

function toMedia(r: Row): Media {
  return {
    ...ids(r.id),
    url: text(r.url),
    publicId: text(r.public_id),
    filename: text(r.filename),
    alt: text(r.alt),
    format: text(r.format),
    bytes: Number(r.bytes ?? 0),
    width: Number(r.width ?? 0),
    height: Number(r.height ?? 0),
    createdAt: date(r.created_at),
    updatedAt: date(r.updated_at),
  };
}

export const media = {
  async findAll(): Promise<Media[]> {
    const rows = await query("SELECT * FROM media ORDER BY created_at DESC");
    return rows.map(toMedia);
  },

  async findById(id: string): Promise<Media | null> {
    const [row] = await query("SELECT * FROM media WHERE id = $1", [id]);
    return row ? toMedia(row) : null;
  },

  async create(input: MediaInput): Promise<Media> {
    const [row] = await query(
      "INSERT INTO media (url, public_id, filename, alt, format, bytes, width, height) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        input.url, input.publicId, input.filename, input.alt, input.format,
        Math.round(input.bytes), Math.round(input.width), Math.round(input.height),
      ]
    );
    return toMedia(row);
  },

  // Équivalent de document.save() : seul alt est modifiable.
  async save(item: Media): Promise<Media> {
    const [row] = await query("UPDATE media SET alt = $2 WHERE id = $1 RETURNING *", [
      item.id,
      item.alt,
    ]);
    return toMedia(row);
  },

  async deleteById(id: string) {
    await query("DELETE FROM media WHERE id = $1", [id]);
  },

  async count(): Promise<number> {
    const [row] = await query("SELECT count(*) AS n FROM media");
    return count(row.n);
  },
};
