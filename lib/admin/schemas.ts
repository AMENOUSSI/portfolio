import { z } from "zod";
import { youTubeId } from "@/lib/youtube";

/*
 * Validation for the admin forms. Inputs arrive as FormData strings, so each
 * schema also normalises them (empty → null, "a, b" → ["a", "b"], checkbox → boolean).
 */

const required = z.string().trim().min(1, "Champ requis");

const optional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^https?:\/\/\S+$/.test(v), "Adresse http(s) attendue")
  .transform((v) => (v ? v : null));

const checkbox = z
  .string()
  .optional()
  .transform((v) => v === "on");

/** Textarea → list, one item per line (leading "-", "•" or "*" removed). */
const lines = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(/\r?\n/)
      .map((s) => s.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean),
  );

const position = z.coerce.number().int("Nombre entier attendu").min(0, "Doit être positif").default(0);

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lettres minuscules, chiffres et tirets uniquement"),
  titleFr: required,
  titleEn: required,
  kickerFr: required,
  kickerEn: required,
  summaryFr: required,
  summaryEn: required,
  problemFr: optional,
  problemEn: optional,
  approachFr: optional,
  approachEn: optional,
  outcomeFr: optional,
  outcomeEn: optional,
  stack: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  // Optional here: the action requires either this or an uploaded file.
  imageUrl: optional.refine(
    (v) => v === null || v.startsWith("/") || /^https:\/\/\S+$/.test(v),
    "Chemin commençant par / ou adresse https",
  ),
  imageAltFr: required,
  imageAltEn: required,
  captionFr: optional,
  captionEn: optional,
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  videoUrl: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || youTubeId(v) !== null, "Lien YouTube attendu (youtube.com/watch?v=… ou youtu.be/…)")
    .transform((v) => (v ? v : null)),
  featured: checkbox,
  published: checkbox,
  showOnCv: checkbox,
  position,
});

export const skillCategories = ["LANGUAGE", "DATA", "WEB", "DATABASE", "TOOLING", "METHOD"] as const;

export const skillSchema = z
  .object({
    name: required,
    category: z.enum(skillCategories, "Catégorie inconnue"),
    icon: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .refine((v) => !v || /^[a-z0-9]+$/.test(v), "Identifiant simple-icons (ex. python, nextdotjs)")
      .transform((v) => (v ? v : null)),
    showInToolbox: checkbox,
    position,
  })
  .refine((s) => !s.showInToolbox || s.icon, {
    path: ["icon"],
    message: "Une icône est nécessaire pour apparaître dans la boîte à outils",
  });

export const categorySchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lettres minuscules, chiffres et tirets uniquement"),
  nameFr: required,
  nameEn: required,
  position,
});

export const certificateSchema = z.object({
  titleFr: required,
  titleEn: required,
  issuer: required,
  issuedAt: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Mois d'obtention requis")
    .transform((v) => new Date(`${v}-01T00:00:00Z`)),
  credentialUrl: optionalUrl,
  published: checkbox,
  position,
});

export const experienceSchema = z.object({
  kind: z.enum(["EXPERIENCE", "EDUCATION"], "Type inconnu"),
  titleFr: required,
  titleEn: required,
  organizationFr: required,
  organizationEn: required,
  periodFr: required,
  periodEn: required,
  highlightsFr: lines,
  highlightsEn: lines,
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Mois de début requis")
    .transform((v) => new Date(`${v}-01T00:00:00Z`)),
  current: checkbox,
  published: checkbox,
});

/** "Hello World — v2" → "hello-world-v2" */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
