import type { SectionKey } from "./sections";

/*
 * What the admin form shows for each section. `path` points into the section
 * data; `localized` fields get a FR and an EN input (`path.fr` / `path.en`).
 *
 * Kinds:
 * - text / textarea: a string
 * - heading: a string where *asterisks* mark the accent word
 * - lines: a list, one item per line
 * - csv: a list, comma-separated
 * - select: one of `options`
 * - image: a picture: file upload, or a path / URL (stored at `path.src`)
 */

export type FieldKind = "text" | "textarea" | "heading" | "lines" | "csv" | "select" | "image";

export type FieldSpec = {
  kind: FieldKind;
  path: string;
  label: string;
  hint?: string;
  localized?: boolean;
  options?: { value: string; label: string }[];
};

export type GroupSpec = { title: string; hint?: string; fields: FieldSpec[] };

export type SectionSpec = { title: string; description: string; groups: GroupSpec[] };

const HEADING_HINT = "Mettez le mot en italique entre astérisques : Ce que je *construis*";

function headingFields(prefix = ""): FieldSpec[] {
  return [
    { kind: "text", path: `${prefix}eyebrow`, label: "Surtitre", localized: true },
    { kind: "heading", path: `${prefix}heading`, label: "Titre", hint: HEADING_HINT, localized: true },
  ];
}

const ordinal = ["1re", "2e", "3e"];

export const sectionSpecs: Record<SectionKey, SectionSpec> = {
  identity: {
    title: "Identité & contact",
    description: "Nom, titre et introduction de l'en-tête, coordonnées et portrait principal. Utilisés aussi par le CV.",
    groups: [
      {
        title: "En-tête",
        fields: [
          { kind: "text", path: "firstName", label: "Prénom(s)" },
          { kind: "text", path: "lastName", label: "Nom (en italique)" },
          { kind: "textarea", path: "role", label: "Titre professionnel", localized: true },
          { kind: "textarea", path: "lead", label: "Phrase d'introduction", localized: true },
        ],
      },
      {
        title: "Coordonnées",
        fields: [
          { kind: "text", path: "location", label: "Ville, pays" },
          { kind: "text", path: "languages", label: "Langues parlées", hint: "Séparées par « · »", localized: true },
          { kind: "text", path: "email", label: "E-mail" },
          { kind: "text", path: "github", label: "GitHub (adresse complète)" },
          { kind: "text", path: "linkedin", label: "LinkedIn (adresse complète)" },
          { kind: "text", path: "website", label: "Adresse du portfolio", hint: "Imprimée sur le CV" },
        ],
      },
      {
        title: "Portrait de l'en-tête",
        fields: [
          { kind: "image", path: "portrait", label: "Photo", hint: "Portrait vertical de préférence, sujet centré" },
          { kind: "text", path: "portrait.alt", label: "Description de la photo", localized: true },
        ],
      },
    ],
  },

  career: {
    title: "Courbe du parcours",
    description: "Les trois étiquettes posées sur la courbe à côté du portrait, de la plus ancienne à la plus récente.",
    groups: [0, 1, 2].map((i) => ({
      title: `${ordinal[i]} étape`,
      fields: [
        { kind: "text", path: `milestones.${i}.title`, label: "Intitulé", localized: true },
        { kind: "text", path: `milestones.${i}.detail`, label: "Détail", hint: "Ex. IAI-Togo · 2024", localized: true },
      ],
    })),
  },

  focus: {
    title: "Bandeau défilant",
    description: "Les domaines qui défilent sur le bandeau ambre sous l'en-tête.",
    groups: [
      {
        title: "Éléments",
        fields: [{ kind: "lines", path: "items", label: "Domaines", hint: "Un par ligne", localized: true }],
      },
    ],
  },

  domains: {
    title: "Domaines",
    description: "Le titre de la section et ses trois cartes.",
    groups: [
      { title: "Titre de la section", fields: headingFields() },
      ...[0, 1, 2].map((i) => ({
        title: `${ordinal[i]} carte`,
        fields: [
          {
            kind: "select" as const,
            path: `cards.${i}.icon`,
            label: "Icône",
            options: [
              { value: "code", label: "Code" },
              { value: "database", label: "Base de données" },
              { value: "board", label: "Tableau / gestion" },
            ],
          },
          {
            kind: "select" as const,
            path: `cards.${i}.target`,
            label: "Lien de la carte",
            options: [
              { value: "projets", label: "Vers les projets" },
              { value: "parcours", label: "Vers le parcours" },
            ],
          },
          { kind: "text" as const, path: `cards.${i}.title`, label: "Titre", localized: true },
          { kind: "textarea" as const, path: `cards.${i}.description`, label: "Description", localized: true },
          { kind: "csv" as const, path: `cards.${i}.stack`, label: "Technologies", hint: "Séparées par des virgules" },
        ],
      })),
    ],
  },

  about: {
    title: "À propos",
    description: "Le bloc sombre : titre, biographie, chiffres clés, photo et étiquettes autour de la photo.",
    groups: [
      { title: "Titre de la section", fields: headingFields() },
      {
        title: "Biographie",
        fields: [{ kind: "textarea", path: "bio", label: "Texte", localized: true }],
      },
      {
        title: "Chiffres clés",
        hint: "Uniquement des chiffres vérifiables.",
        fields: [0, 1, 2].flatMap((i) => [
          { kind: "text" as const, path: `stats.${i}.value`, label: `Chiffre ${i + 1}` },
          { kind: "text" as const, path: `stats.${i}.label`, label: `Légende ${i + 1}`, localized: true },
        ]),
      },
      {
        title: "Photo",
        fields: [
          { kind: "image", path: "photo", label: "Photo", hint: "Format carré, visage dans le tiers supérieur" },
          { kind: "text", path: "photo.alt", label: "Description de la photo", localized: true },
          { kind: "lines", path: "tags", label: "Étiquettes autour de la photo", hint: "Une par ligne, 4 maximum", localized: true },
        ],
      },
    ],
  },

  sections: {
    title: "Titres des autres sections",
    description: "Projets, Parcours, Boîte à outils, Certifications et Contact.",
    groups: [
      { title: "Projets", fields: headingFields("projects.") },
      {
        title: "Parcours",
        fields: [
          ...headingFields("journey."),
          { kind: "text", path: "journey.experience", label: "Titre de la colonne Expérience", localized: true },
          { kind: "text", path: "journey.education", label: "Titre de la colonne Formation", localized: true },
        ],
      },
      { title: "Boîte à outils", fields: headingFields("tools.") },
      { title: "Certifications", fields: headingFields("certificates.") },
      {
        title: "Contact",
        fields: [
          ...headingFields("contact."),
          { kind: "textarea", path: "contact.body", label: "Texte", localized: true },
        ],
      },
    ],
  },

  cv: {
    title: "CV",
    description: "Titre, profil et téléphone propres au CV, à adapter à chaque candidature sans toucher au site.",
    groups: [
      {
        title: "En-tête du CV",
        hint: "Laissez un champ vide pour reprendre le texte du site.",
        fields: [
          {
            kind: "textarea",
            path: "role",
            label: "Titre du CV",
            hint: "Reprenez l'intitulé du poste visé. Ex. Développeur full-stack · Next.js & PostgreSQL",
            localized: true,
          },
          {
            kind: "text",
            path: "phone",
            label: "Téléphone",
            hint: "Ex. +228 90 00 00 00. Affiché seulement sur le CV, qui est une page publique (/cv).",
          },
        ],
      },
      {
        title: "Profil",
        hint: "Trois lignes sur ce que vous apportez au poste. Vide : reprend le texte « À propos » du site.",
        fields: [{ kind: "textarea", path: "profile", label: "Profil", localized: true }],
      },
    ],
  },
};

/** Every form input name a field produces (localized fields produce two). */
export function fieldPaths(field: FieldSpec): string[] {
  return field.localized ? [`${field.path}.fr`, `${field.path}.en`] : [field.path];
}
