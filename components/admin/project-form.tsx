"use client";

import { useActionState } from "react";
import type { Project, ProjectCategory } from "@/generated/prisma/client";
import { formKey, initialFormState, type FormState } from "@/lib/admin/form-state";
import { CheckboxField, CheckboxGroup, FormMessage, ImageField, SubmitButton, TextField } from "./fields";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  project?: Project & { categories: ProjectCategory[] };
  categories: ProjectCategory[];
};

export function ProjectForm({ action, project, categories }: Props) {
  const [state, formAction] = useActionState(action, initialFormState);
  const p = project;

  return (
    <form key={formKey(state)} action={formAction} className="a-form" noValidate>
      <FormMessage state={state} />

      <fieldset>
        <legend>Présentation</legend>
        <div className="grid-2">
          <TextField name="titleFr" label="Titre (FR)" state={state} initial={p?.titleFr} required />
          <TextField name="titleEn" label="Titre (EN)" state={state} initial={p?.titleEn} required />
          <TextField
            name="kickerFr"
            label="Surtitre (FR)"
            hint="Ex. Data engineering · Projet personnel · 2026"
            state={state}
            initial={p?.kickerFr}
            required
          />
          <TextField name="kickerEn" label="Surtitre (EN)" state={state} initial={p?.kickerEn} required />
          <TextField name="summaryFr" label="Résumé (FR)" multiline state={state} initial={p?.summaryFr} required />
          <TextField name="summaryEn" label="Résumé (EN)" multiline state={state} initial={p?.summaryEn} required />
        </div>
        <CheckboxGroup
          name="categoryIds"
          legend="Catégories"
          hint={categories.length ? "Boutons de filtre au-dessus des projets ; plusieurs choix possibles." : "Aucune catégorie : créez-en dans « Catégories »."}
          options={categories.map((c) => ({ value: c.id, label: c.nameFr }))}
          state={state}
          initial={p?.categories.map((c) => c.id) ?? []}
        />
        <TextField
          name="stack"
          label="Technologies"
          hint="Séparées par des virgules : Python, pandas, PostgreSQL"
          state={state}
          initial={p?.stack.join(", ")}
        />
      </fieldset>

      <fieldset>
        <legend>Étude de cas (optionnel)</legend>
        <p className="fieldset-hint">
          Affichée sur le projet mis en avant quand les trois lignes sont remplies dans les deux langues.
        </p>
        <div className="grid-2">
          <TextField name="problemFr" label="Problème (FR)" multiline state={state} initial={p?.problemFr} />
          <TextField name="problemEn" label="Problème (EN)" multiline state={state} initial={p?.problemEn} />
          <TextField name="approachFr" label="Approche (FR)" multiline state={state} initial={p?.approachFr} />
          <TextField name="approachEn" label="Approche (EN)" multiline state={state} initial={p?.approachEn} />
          <TextField name="outcomeFr" label="Résultat (FR)" multiline state={state} initial={p?.outcomeFr} />
          <TextField name="outcomeEn" label="Résultat (EN)" multiline state={state} initial={p?.outcomeEn} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Image et liens</legend>
        <ImageField
          name="imageFile"
          label={p ? "Remplacer l'image" : "Image"}
          hint="JPEG, PNG, WebP ou AVIF, 3,5 Mo maximum. Une capture large (16:9) s'affiche le mieux."
          accept="image/jpeg,image/png,image/webp,image/avif"
          state={state}
          currentUrl={p?.imageUrl}
        />
        <TextField
          name="imageUrl"
          label="… ou chemin / adresse de l'image"
          hint="Utilisé seulement si aucun fichier n'est choisi : /images/… ou https://…"
          state={state}
          initial={p?.imageUrl}
        />
        <div className="grid-2">
          <TextField name="imageAltFr" label="Description de l'image (FR)" state={state} initial={p?.imageAltFr} required />
          <TextField name="imageAltEn" label="Description de l'image (EN)" state={state} initial={p?.imageAltEn} required />
          <TextField name="captionFr" label="Légende (FR)" state={state} initial={p?.captionFr} />
          <TextField name="captionEn" label="Légende (EN)" state={state} initial={p?.captionEn} />
          <TextField name="repoUrl" label="Code source" type="url" state={state} initial={p?.repoUrl} />
          <TextField name="liveUrl" label="Site en ligne" type="url" state={state} initial={p?.liveUrl} />
        </div>
        <TextField
          name="videoUrl"
          label="Vidéo de démo (YouTube)"
          hint="Lien youtube.com/watch?v=… ou youtu.be/… ; une vidéo « Non répertoriée » suffit. Ajoute un bouton « Voir la démo » et un lecteur sur la page du projet."
          type="url"
          state={state}
          initial={p?.videoUrl}
        />
      </fieldset>

      <fieldset>
        <legend>Publication</legend>
        <div className="grid-2">
          <TextField
            name="slug"
            label="Slug"
            hint="Laissez vide pour le générer depuis le titre anglais"
            state={state}
            initial={p?.slug}
          />
          <TextField
            name="position"
            label="Ordre d'affichage"
            type="number"
            hint="Les plus petits nombres s'affichent en premier"
            state={state}
            initial={String(p?.position ?? 0)}
          />
        </div>
        <div className="checks">
          <CheckboxField name="published" label="Publié sur le site" state={state} initial={p?.published ?? true} />
          <CheckboxField name="featured" label="Mis en avant (grande carte)" state={state} initial={p?.featured ?? false} />
          <CheckboxField name="showOnCv" label="Afficher sur le CV" state={state} initial={p?.showOnCv ?? true} />
        </div>
      </fieldset>

      <div className="a-actions">
        <SubmitButton>{p ? "Enregistrer les modifications" : "Créer le projet"}</SubmitButton>
      </div>
    </form>
  );
}
