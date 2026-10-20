import type { Metadata } from "next";
import Link from "next/link";
import { createCertificate } from "../../../actions/certificates";
import { CertificateForm } from "@/components/admin/certificate-form";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Nouveau certificat" };

export default async function NewCertificate() {
  await requireAdmin();
  return (
    <>
      <Link className="a-back" href="/admin/certificats">
        ← Certificats
      </Link>
      <div className="a-head">
        <h1>Nouveau certificat</h1>
      </div>
      <CertificateForm action={createCertificate} />
    </>
  );
}
