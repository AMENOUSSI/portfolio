"use server";

import { refreshContent } from "./refresh-content";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/dal";
import { contentTags } from "@/lib/content";
import { db } from "@/lib/db";
import { formValues, invalid, type FormState } from "@/lib/admin/form-state";
import { experienceSchema } from "@/lib/admin/schemas";

export async function createExperience(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);
  const result = experienceSchema.safeParse(values);
  if (!result.success) return invalid(result.error, values);

  await db.experience.create({ data: result.data });
  refreshContent(contentTags.experiences);
  redirect("/admin/experiences");
}

export async function updateExperience(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const values = formValues(formData);
  const result = experienceSchema.safeParse(values);
  if (!result.success) return invalid(result.error, values);

  await db.experience.update({ where: { id }, data: result.data });
  refreshContent(contentTags.experiences);
  redirect("/admin/experiences");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await db.experience.delete({ where: { id } });
  refreshContent(contentTags.experiences);
  redirect("/admin/experiences");
}
