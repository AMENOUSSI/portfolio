import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { sectionSpecs } from "@/lib/site/form-spec";
import { isSectionKey, sectionKeys } from "@/lib/site/sections";

export const metadata: Metadata = { title: "Textes du site" };

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

export default async function SiteTextsAdmin({ searchParams }: PageProps<"/admin/site">) {
  await requireAdmin();
  const [{ saved }, rows] = await Promise.all([
    searchParams,
    db.siteSection.findMany({ select: { key: true, updatedAt: true } }),
  ]);
  const updated = new Map(rows.map((row) => [row.key, row.updatedAt]));
  const savedKey = typeof saved === "string" && isSectionKey(saved) ? saved : null;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Textes du site</h1>
          <p>Chaque section de la page d&apos;accueil, en français et en anglais. Le CV utilise aussi ces textes.</p>
        </div>
      </div>
      {savedKey && (
        <p className="form-message is-success" role="status">
          « {sectionSpecs[savedKey].title} » est enregistré et en ligne.
        </p>
      )}
      <div className="a-table-wrap">
        <table className="a-table">
          <thead>
            <tr>
              <th scope="col">Section</th>
              <th scope="col">Dernière modification</th>
            </tr>
          </thead>
          <tbody>
            {sectionKeys.map((key) => {
              const date = updated.get(key);
              return (
                <tr key={key}>
                  <td>
                    <Link href={`/admin/site/${key}`}>{sectionSpecs[key].title}</Link>
                    <div className="muted">{sectionSpecs[key].description}</div>
                  </td>
                  <td className="muted">{date ? dateFormat.format(date) : "Textes d'origine"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
