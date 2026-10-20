"use server";

import { redirect } from "next/navigation";
import { refreshContent } from "./refresh-content";
import { requireAdmin } from "@/lib/auth/dal";
import { contentTags } from "@/lib/content";
import { db } from "@/lib/db";
import { formValues, invalid, isUniqueViolation, type FormState } from "@/lib/admin/form-state";
import { categorySchema, slugify } from "@/lib/admin/schemas";

function parse(formData: FormData) {
  const values = formValues(formData);
  if (!values.slug?.trim()) values.slug = slugify(values.nameEn || values.nameFr || "");
  return { values, result: categorySchema.safeParse(values) };
}

const slugTaken: FormState["errors"] = { slug: ["Une autre catégorie utilise déjà ce slug"] };

export async function createCategory(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { values, result } = parse(formData);
  if (!result.success) return invalid(result.error, values);

  try {
    await db.projectCategory.create({ data: result.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { errors: slugTaken, values };
    throw error;
  }
  refreshContent(contentTags.projects);
  redirect("/admin/categories");
}

export async function updateCategory(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const { values, result } = parse(formData);
  if (!result.success) return invalid(result.error, values);

  try {
    await db.projectCategory.update({ where: { id }, data: result.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { errors: slugTaken, values };
    throw error;
  }
  refreshContent(contentTags.projects);
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  // Projects stay; they simply lose this category.
  await db.projectCategory.delete({ where: { id } });
  refreshContent(contentTags.projects);
  redirect("/admin/categories");
}
