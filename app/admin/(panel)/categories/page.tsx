import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Catégories de projets" };

export default async function CategoriesAdmin() {
  await requireAdmin();
  const categories = await db.projectCategory.findMany({
    orderBy: [{ position: "asc" }, { nameFr: "asc" }],
    include: { _count: { select: { projects: true } } },
  });

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Catégories de projets</h1>
          <p>Les boutons de filtre au-dessus des projets. Une catégorie sans projet publié n&apos;apparaît pas sur le site.</p>
        </div>
        <Link className="a-btn a-btn-amber" href="/admin/categories/nouveau">
          Ajouter une catégorie
        </Link>
      </div>
      <div className="a-table-wrap">
        {categories.length === 0 ? (
          <p className="a-empty">Aucune catégorie : le filtre des projets est masqué.</p>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                <th scope="col">Ordre</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Projets</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="muted">{c.position}</td>
                  <td>
                    <Link href={`/admin/categories/${c.id}`}>{c.nameFr}</Link>
                    <div className="muted">{c.nameEn}</div>
                  </td>
                  <td className="muted">{c._count.projects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
