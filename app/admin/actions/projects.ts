"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { refreshContent } from "./refresh-content";
import { requireAdmin } from "@/lib/auth/dal";
import { contentTags } from "@/lib/content";
import { db } from "@/lib/db";
import { formValues, isUniqueViolation, type FormState } from "@/lib/admin/form-state";
import { projectSchema, slugify } from "@/lib/admin/schemas";
import { checkImage, deleteStoredImage, uploadProjectImage } from "@/lib/storage";

type Prepared =
  | { ok: false; state: FormState }
  | { ok: true; values: Record<string, string>; data: z.infer<typeof projectSchema>; upload: File | null };

/** Validates the form; the image comes either from an uploaded file or the imageUrl field. */
function prepare(formData: FormData): Prepared {
  const values = formValues(formData);
  if (!values.slug?.trim()) values.slug = slugify(values.titleEn || values.titleFr || "");

  const result = projectSchema.safeParse(values);
  const errors: Record<string, string[] | undefined> = result.success ? {} : z.flattenError(result.error).fieldErrors;

  const file = formData.get("imageFile");
  const upload = file instanceof File && file.size > 0 ? file : null;
  if (upload) {
    const problem = checkImage(upload);
    if (problem) errors.imageFile = [problem];
  } else if (result.success && !result.data.imageUrl) {
    errors.imageFile = ["Ajoutez une image : un fichier, ou un chemin dans le champ ci-dessous"];
  }

  if (!result.success || Object.keys(errors).length > 0) {
    const message = upload
      ? "Certains champs sont à corriger. Sélectionnez à nouveau l'image avant d'enregistrer."
      : "Certains champs sont à corriger.";
    return { ok: false, state: { message, errors, values } };
  }
  return { ok: true, values, data: result.data, upload };
}

const slugTaken: FormState["errors"] = { slug: ["Ce slug est déjà utilisé par un autre projet"] };

export async function createProject(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const prepared = prepare(formData);
  if (!prepared.ok) return prepared.state;
  const { values, data, upload } = prepared;

  const imageUrl = upload ? await uploadProjectImage(upload, data.slug) : data.imageUrl!;
  try {
    await db.project.create({ data: { ...data, imageUrl } });
  } catch (error) {
    if (upload) await deleteStoredImage(imageUrl);
    if (isUniqueViolation(error)) return { errors: slugTaken, values };
    throw error;
  }
  refreshContent(contentTags.projects);
  redirect("/admin/projets");
}

export async function updateProject(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const prepared = prepare(formData);
  if (!prepared.ok) return prepared.state;
  const { values, data, upload } = prepared;

  const previous = await db.project.findUnique({ where: { id }, select: { imageUrl: true } });
  const imageUrl = upload ? await uploadProjectImage(upload, data.slug) : data.imageUrl!;
  try {
    await db.project.update({ where: { id }, data: { ...data, imageUrl } });
  } catch (error) {
    if (upload) await deleteStoredImage(imageUrl);
    if (isUniqueViolation(error)) return { errors: slugTaken, values };
    throw error;
  }
  // The old file is no longer referenced once the row points at the new one.
  if (previous && previous.imageUrl !== imageUrl) await deleteStoredImage(previous.imageUrl);
  refreshContent(contentTags.projects);
  redirect("/admin/projets");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const deleted = await db.project.delete({ where: { id } });
  await deleteStoredImage(deleted.imageUrl);
  refreshContent(contentTags.projects);
  redirect("/admin/projets");
}
