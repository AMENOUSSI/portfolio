"use server";

import { refreshContent } from "./refresh-content";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { contentTags } from "@/lib/content";
import { db } from "@/lib/db";
import { formValues, invalid, isUniqueViolation, type FormState } from "@/lib/admin/form-state";
import { projectSchema, slugify } from "@/lib/admin/schemas";

function parse(formData: FormData) {
  const values = formValues(formData);
  if (!values.slug?.trim()) values.slug = slugify(values.titleEn || values.titleFr || "");
  return { values, result: projectSchema.safeParse(values) };
}

const slugTaken: FormState["errors"] = { slug: ["Ce slug est déjà utilisé par un autre projet"] };

export async function createProject(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { values, result } = parse(formData);
  if (!result.success) return invalid(result.error, values);

  try {
    await db.project.create({ data: result.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { errors: slugTaken, values };
    throw error;
  }
  refreshContent(contentTags.projects);
  redirect("/admin/projets");
}

export async function updateProject(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { values, result } = parse(formData);
  if (!result.success) return invalid(result.error, values);

  try {
    await db.project.update({ where: { id }, data: result.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { errors: slugTaken, values };
    throw error;
  }
  refreshContent(contentTags.projects);
  redirect("/admin/projets");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await db.project.delete({ where: { id } });
  refreshContent(contentTags.projects);
  redirect("/admin/projets");
}
