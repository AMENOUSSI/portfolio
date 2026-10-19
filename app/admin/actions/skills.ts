"use server";

import { refreshContent } from "./refresh-content";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { contentTags } from "@/lib/content";
import { db } from "@/lib/db";
import { formValues, invalid, isUniqueViolation, type FormState } from "@/lib/admin/form-state";
import { skillSchema } from "@/lib/admin/schemas";

const nameTaken: FormState["errors"] = { name: ["Cette compétence existe déjà"] };

export async function createSkill(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);
  const result = skillSchema.safeParse(values);
  if (!result.success) return invalid(result.error, values);

  try {
    await db.skill.create({ data: result.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { errors: nameTaken, values };
    throw error;
  }
  refreshContent(contentTags.skills);
  redirect("/admin/competences");
}

export async function updateSkill(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);
  const result = skillSchema.safeParse(values);
  if (!result.success) return invalid(result.error, values);

  try {
    await db.skill.update({ where: { id }, data: result.data });
  } catch (error) {
    if (isUniqueViolation(error)) return { errors: nameTaken, values };
    throw error;
  }
  refreshContent(contentTags.skills);
  redirect("/admin/competences");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await db.skill.delete({ where: { id } });
  refreshContent(contentTags.skills);
  redirect("/admin/competences");
}
