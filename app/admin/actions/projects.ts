"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { refreshContent } from "./refresh-content";
import { requireAdmin } from "@/lib/auth/dal";
import { contentTags } from "@/lib/content";
import { db } from "@/lib/db";
import { formValues, isUniqueViolation, type FormState } from "@/lib/admin/form-state";
import { projectSchema, slugify } from "@/lib/admin/schemas";
import { checkImage, deleteStoredImage, tryUploadImage } from "@/lib/storage";

type Prepared =
  | { ok: false; state: FormState }
  | { ok: true; values: Record<string, string>; data: z.infer<typeof projectSchema>; upload: File | null };

/** Uploads the chosen file, or keeps the URL typed in the form; a failure becomes a form error. */
async function resolveImage(
  upload: File | null,
  data: z.infer<typeof projectSchema>,
  values: Record<string, string>,
): Promise<{ imageUrl: string } | { state: FormState }> {
  if (!upload) return { imageUrl: data.imageUrl! };
  const result = await tryUploadImage(upload, `projects/${data.slug}`);
  if ("url" in result) return { imageUrl: result.url };
  return { state: { message: result.error, errors: { imageFile: [result.error] }, values } };
}

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

  const image = await resolveImage(upload, data, values);
  if ("state" in image) return image.state;
  const { imageUrl } = image;
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
  const image = await resolveImage(upload, data, values);
  if ("state" in image) return image.state;
  const { imageUrl } = image;
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
