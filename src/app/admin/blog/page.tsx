import Link from "next/link";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton";
import styles from "./ArticleTable.module.css";

export const dynamic = "force-dynamic";

type ArticleRow = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
};

async function getArticles(): Promise<ArticleRow[]> {
  await connectDB();
  const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
  return articles.map((a) => ({
    _id: a._id.toString(),
    title: a.title,
    slug: a.slug,
    status: a.status,
    updatedAt: new Date(a.updatedAt).toLocaleDateString("fr-FR"),
  }));
}

export default async function AdminBlogListPage() {
  const articles = await getArticles();

  return (
    <div>
      <h1 className={styles.pageTitle}>Articles</h1>

      {articles.length === 0 ? (
        <p className={styles.empty}>Aucun article pour le moment.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Statut</th>
              <th>Mis à jour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td className={styles.title}>{article.title}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      article.status === "published" ? styles.statusPublished : styles.statusDraft
                    }`}
                  >
                    {article.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td>{article.updatedAt}</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/blog/${article._id}/edit`} className={styles.link}>
                      Modifier
                    </Link>
                    <DeleteArticleButton id={article._id} title={article.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
