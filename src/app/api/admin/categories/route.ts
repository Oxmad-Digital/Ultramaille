import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/blog";
import Category from "@/models/Category";
import Article from "@/models/Article";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  const counts = await Article.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
  const countMap = new Map(counts.map((c) => [c._id as string, c.count as number]));

  return NextResponse.json({
    success: true,
    categories: categories.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      articleCount: countMap.get(c.name) ?? 0,
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

  const existing = await Category.findOne({ name });
  if (existing) {
    return NextResponse.json({ error: "Cette catégorie existe déjà" }, { status: 409 });
  }

  const base = slugify(name);
  let slug = base;
  let suffix = 1;
  while (await Category.findOne({ slug })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  const category = await Category.create({ name, slug });
  return NextResponse.json({ success: true, category }, { status: 201 });
}
