"use server";

import { redirect } from "next/navigation";
import { refreshContent } from "./refresh-content";
import { requireAdmin } from "@/lib/auth/dal";
import { contentTags } from "@/lib/content";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { formValues, type FormState } from "@/lib/admin/form-state";
import { fieldPaths, sectionSpecs, type FieldSpec } from "@/lib/site/form-spec";
import { DEFAULTS, getAt, sectionSchemas, setAt, type SectionKey } from "@/lib/site/sections";
import { checkImage, deleteStoredFile, tryUploadFile, type UploadFailure } from "@/lib/storage";

/** Turns one form value into what the section schema expects for that kind of field. */
function convert(kind: FieldSpec["kind"], raw: string): unknown {
  if (kind === "lines") return raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if (kind === "csv") return raw.split(",").map((s) => s.trim()).filter(Boolean);
  return raw;
}

/** Saves one section of the site texts; the form and its parsing come from sectionSpecs. */
export async function saveSection(key: SectionKey, _state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const fields = sectionSpecs[key].groups.flatMap((group) => group.fields);
  const values = formValues(formData);
  const errors: Record<string, string[]> = {};
  const data: Record<string, unknown> = {};
  const uploads: { path: string; file: File }[] = [];

  for (const field of fields) {
    if (field.kind === "image") {
      const file = formData.get(`${field.path}.file`);
      if (file instanceof File && file.size > 0) {
        const problem = checkImage(file);
        if (problem) errors[`${field.path}.file`] = [problem];
        else uploads.push({ path: field.path, file });
      }
      // Placeholder path so validation passes; replaced by the upload URL below.
      const src = uploads.some((u) => u.path === field.path) ? "/uploading" : (values[`${field.path}.src`] ?? "");
      setAt(data, `${field.path}.src`, src);
      continue;
    }
    for (const path of fieldPaths(field)) setAt(data, path, convert(field.kind, values[path] ?? ""));
  }

  const result = sectionSchemas[key].safeParse(data);
  if (!result.success) {
    // Map each issue to the input that produced it ("items.fr.2" → "items.fr").
    const names = new Set(fields.flatMap((field) => (field.kind === "image" ? [`${field.path}.src`] : fieldPaths(field))));
    for (const issue of result.error.issues) {
      const segments = issue.path.map(String);
      while (segments.length > 1 && !names.has(segments.join("."))) segments.pop();
      (errors[segments.join(".")] ??= []).push(issue.message);
    }
  }
  if (Object.keys(errors).length > 0) {
    const message = uploads.length
      ? "Certains champs sont à corriger. Sélectionnez à nouveau les images avant d'enregistrer."
      : "Certains champs sont à corriger.";
    return { message, errors, values };
  }

  const saved = result.data as Record<string, unknown>;
  const previous = await db.siteSection.findUnique({ where: { key } });

  // A failed upload must not lose the texts: keep the image that was there and warn.
  let imageFailed: UploadFailure["reason"] | null = null;
  for (const { path, file } of uploads) {
    const upload = await tryUploadFile(file, `site/${key}`);
    if ("url" in upload) {
      setAt(saved, `${path}.src`, upload.url);
    } else {
      imageFailed = upload.reason;
      const current = getAt(previous?.data, `${path}.src`) ?? getAt(DEFAULTS[key], `${path}.src`);
      setAt(saved, `${path}.src`, current);
    }
  }

  const json = saved as Prisma.InputJsonValue;
  await db.siteSection.upsert({ where: { key }, create: { key, data: json }, update: { data: json } });

  // Remove uploaded images that this save replaced.
  for (const field of fields.filter((f) => f.kind === "image")) {
    const before = getAt(previous?.data, `${field.path}.src`);
    if (typeof before === "string" && before !== getAt(saved, `${field.path}.src`)) await deleteStoredFile(before);
  }

  refreshContent(contentTags.site);
  redirect(`/admin/site?saved=${key}${imageFailed ? `&imageError=${imageFailed}` : ""}`);
}
