import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { skillCategoryLabels } from "@/lib/admin/labels";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Compétences" };

export default async function SkillsAdmin() {
  await requireAdmin();
  const skills = await db.skill.findMany({ orderBy: [{ category: "asc" }, { position: "asc" }, { name: "asc" }] });

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Compétences</h1>
          <p>Celles marquées « Boîte à outils » apparaissent sur la page d&apos;accueil.</p>
        </div>
        <Link className="a-btn a-btn-amber" href="/admin/competences/nouveau">
          Ajouter une compétence
        </Link>
      </div>
      <div className="a-table-wrap">
        {skills.length === 0 ? (
          <p className="a-empty">Aucune compétence pour l&apos;instant.</p>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                <th scope="col">Compétence</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Icône</th>
                <th scope="col">Accueil</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link href={`/admin/competences/${s.id}`}>{s.name}</Link>
                  </td>
                  <td className="muted">{skillCategoryLabels[s.category]}</td>
                  <td className="muted">{s.icon ?? "—"}</td>
                  <td>{s.showInToolbox && <span className="badge is-on">Boîte à outils</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
