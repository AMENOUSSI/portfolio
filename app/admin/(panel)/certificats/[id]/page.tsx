import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCertificate, removeCertificateFile, updateCertificate } from "../../../actions/certificates";
import { CertificateForm } from "@/components/admin/certificate-form";
import { DeleteButton } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Modifier le certificat" };

export default async function EditCertificate({ params }: PageProps<"/admin/certificats/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const certificate = await db.certificate.findUnique({ where: { id } });
  if (!certificate) notFound();

  return (
    <>
      <Link className="a-back" href="/admin/certificats">
        ← Certificats
      </Link>
      <div className="a-head">
        <h1>{certificate.titleFr}</h1>
      </div>
      <CertificateForm action={updateCertificate.bind(null, certificate.id)} certificate={certificate} />
      {certificate.fileUrl && (
        <div className="a-danger-zone">
          <p>Retirer le fichier du certificat (le certificat reste affiché, avec son lien s&apos;il en a un).</p>
          <DeleteButton action={removeCertificateFile.bind(null, certificate.id)} what="le fichier de ce certificat" />
        </div>
      )}
      <div className="a-danger-zone">
        <p>Supprimer ce certificat et son fichier.</p>
        <DeleteButton action={deleteCertificate.bind(null, certificate.id)} what="ce certificat" />
      </div>
    </>
  );
}
