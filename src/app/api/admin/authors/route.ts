import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/blog";
import Author from "@/models/Author";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const authors = await Author.find({}).sort({ name: 1 }).lean();

  return NextResponse.json({
    success: true,
    authors: authors.map((a) => ({
      id: a._id.toString(),
      name: a.name,
      slug: a.slug,
      email: a.email,
      bio: a.bio,
      avatarUrl: a.avatarUrl,
      avatarPublicId: a.avatarPublicId,
    })),
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const name = (body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  await connectDB();

  const existing = await Author.findOne({ name });
  if (existing) {
    return NextResponse.json({ error: "Cet auteur existe déjà" }, { status: 409 });
  }

  const base = slugify(name);
  let slug = base;
  let suffix = 1;
  while (await Author.findOne({ slug })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  const author = await Author.create({
    name,
    slug,
    email: (body.email || "").trim(),
    bio: (body.bio || "").trim(),
    avatarUrl: body.avatarUrl || null,
    avatarPublicId: body.avatarPublicId || null,
  });

  return NextResponse.json({ success: true, author }, { status: 201 });
}
