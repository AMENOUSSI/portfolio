import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { timelineKindLabels } from "@/lib/admin/labels";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Parcours" };

export default async function ExperiencesAdmin() {
  await requireAdmin();
  const entries = await db.experience.findMany({
    orderBy: [{ kind: "asc" }, { current: "desc" }, { startDate: "desc" }],
  });

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Parcours</h1>
          <p>Expériences, formations et certifications, dans l&apos;ordre du site.</p>
        </div>
        <Link className="a-btn a-btn-amber" href="/admin/experiences/nouveau">
          Ajouter une entrée
        </Link>
      </div>
      <div className="a-table-wrap">
        {entries.length === 0 ? (
          <p className="a-empty">Aucune entrée pour l&apos;instant.</p>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                <th scope="col">Intitulé</th>
                <th scope="col">Type</th>
                <th scope="col">Période</th>
                <th scope="col">Statut</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td>
                    <Link href={`/admin/experiences/${e.id}`}>{e.titleFr}</Link>
                    <div className="muted">{e.organizationFr}</div>
                  </td>
                  <td className="muted">{timelineKindLabels[e.kind]}</td>
                  <td className="muted">{e.periodFr}</td>
                  <td>
                    <span className={e.published ? "badge is-on" : "badge"}>{e.published ? "Publié" : "Brouillon"}</span>
                    {e.current && <span className="badge is-on">En cours</span>}
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
