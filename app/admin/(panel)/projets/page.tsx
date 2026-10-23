import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Projets" };

export default async function ProjectsAdmin() {
  await requireAdmin();
  const projects = await db.project.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Projets</h1>
          <p>Triés par ordre d&apos;affichage sur le site.</p>
        </div>
        <Link className="a-btn a-btn-amber" href="/admin/projets/nouveau">
          Ajouter un projet
        </Link>
      </div>
      <div className="a-table-wrap">
        {projects.length === 0 ? (
          <p className="a-empty">Aucun projet pour l&apos;instant. Ajoutez le premier.</p>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                <th scope="col">Ordre</th>
                <th scope="col">Projet</th>
                <th scope="col">Statut</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="muted">{p.position}</td>
                  <td>
                    <Link href={`/admin/projets/${p.id}`}>{p.titleFr}</Link>
                    <div className="muted">{p.kickerFr}</div>
                  </td>
                  <td>
                    <span className={p.published ? "badge is-on" : "badge"}>{p.published ? "Publié" : "Brouillon"}</span>
                    {p.featured && <span className="badge is-on">Mis en avant</span>}
                    {p.published && p.showOnCv && <span className="badge is-on">Sur le CV</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
