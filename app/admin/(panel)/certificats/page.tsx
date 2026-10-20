import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Certificats" };

const monthFormat = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric", timeZone: "UTC" });

export default async function CertificatesAdmin() {
  await requireAdmin();
  const certificates = await db.certificate.findMany({ orderBy: [{ position: "asc" }, { issuedAt: "desc" }] });

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Certificats</h1>
          <p>La section « Certifications » du site n&apos;apparaît que s&apos;il y a au moins un certificat publié.</p>
        </div>
        <Link className="a-btn a-btn-amber" href="/admin/certificats/nouveau">
          Ajouter un certificat
        </Link>
      </div>
      <div className="a-table-wrap">
        {certificates.length === 0 ? (
          <p className="a-empty">Aucun certificat pour l&apos;instant. Ajoutez le premier.</p>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                <th scope="col">Certificat</th>
                <th scope="col">Obtenu</th>
                <th scope="col">Statut</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/certificats/${c.id}`}>{c.titleFr}</Link>
                    <div className="muted">{c.issuer}</div>
                  </td>
                  <td className="muted">{monthFormat.format(c.issuedAt)}</td>
                  <td>
                    <span className={c.published ? "badge is-on" : "badge"}>{c.published ? "Publié" : "Brouillon"}</span>
                    {c.fileUrl && <span className="badge">Fichier</span>}
                    {c.credentialUrl && <span className="badge">Lien</span>}
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
