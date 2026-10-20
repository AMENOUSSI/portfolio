"use server";

import { redirect } from "next/navigation";
import type { z } from "zod";
import { refreshContent } from "./refresh-content";
import { requireAdmin } from "@/lib/auth/dal";
import { contentTags } from "@/lib/content";
import { db } from "@/lib/db";
import { formValues, invalid, type FormState } from "@/lib/admin/form-state";
import { certificateSchema } from "@/lib/admin/schemas";
import { checkDocument, deleteStoredFile, tryUploadFile } from "@/lib/storage";

type CertificateData = z.infer<typeof certificateSchema> & { fileUrl?: string };

/** Validates the form and uploads the certificate file when one was chosen. */
async function prepare(formData: FormData): Promise<{ ok: true; data: CertificateData } | { ok: false; state: FormState }> {
  const values = formValues(formData);
  const result = certificateSchema.safeParse(values);

  const file = formData.get("file");
  const upload = file instanceof File && file.size > 0 ? file : null;
  const fileProblem = upload ? checkDocument(upload) : null;

  if (!result.success || fileProblem) {
    const errors = result.success ? {} : invalid(result.error, values).errors;
    return {
      ok: false,
      state: {
        message: upload
          ? "Certains champs sont à corriger. Sélectionnez à nouveau le fichier avant d'enregistrer."
          : "Certains champs sont à corriger.",
        errors: { ...errors, ...(fileProblem ? { file: [fileProblem] } : {}) },
        values,
      },
    };
  }

  if (!upload) return { ok: true, data: result.data };
  const uploaded = await tryUploadFile(upload, "certificates");
  if (!("url" in uploaded)) return { ok: false, state: { message: uploaded.error, errors: { file: [uploaded.error] }, values } };
  return { ok: true, data: { ...result.data, fileUrl: uploaded.url } };
}

export async function createCertificate(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const prepared = await prepare(formData);
  if (!prepared.ok) return prepared.state;

  await db.certificate.create({ data: prepared.data });
  refreshContent(contentTags.certificates);
  redirect("/admin/certificats");
}

export async function updateCertificate(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const prepared = await prepare(formData);
  if (!prepared.ok) return prepared.state;

  const previous = await db.certificate.findUnique({ where: { id }, select: { fileUrl: true } });
  await db.certificate.update({ where: { id }, data: prepared.data });
  // A new file replaces the old one in storage.
  if (prepared.data.fileUrl && previous?.fileUrl !== prepared.data.fileUrl) await deleteStoredFile(previous?.fileUrl);
  refreshContent(contentTags.certificates);
  redirect("/admin/certificats");
}

/** Removes only the file; the certificate stays (e.g. when it has a verification link). */
export async function removeCertificateFile(id: string) {
  await requireAdmin();
  const previous = await db.certificate.findUnique({ where: { id }, select: { fileUrl: true } });
  await db.certificate.update({ where: { id }, data: { fileUrl: null } });
  await deleteStoredFile(previous?.fileUrl);
  refreshContent(contentTags.certificates);
  redirect(`/admin/certificats/${id}`);
}

export async function deleteCertificate(id: string) {
  await requireAdmin();
  const deleted = await db.certificate.delete({ where: { id } });
  await deleteStoredFile(deleted.fileUrl);
  refreshContent(contentTags.certificates);
  redirect("/admin/certificats");
}
