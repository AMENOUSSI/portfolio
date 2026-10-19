"use client";

import { useActionState } from "react";
import type { Project } from "@/generated/prisma/client";
import { formKey, initialFormState, type FormState } from "@/lib/admin/form-state";
import { CheckboxField, FormMessage, SubmitButton, TextField } from "./fields";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  project?: Project;
};

export function ProjectForm({ action, project }: Props) {
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
        <TextField
          name="imageUrl"
          label="Image"
          hint="Chemin dans public/ (ex. /images/projects/mon-projet.png) ou adresse https"
          state={state}
          initial={p?.imageUrl}
          required
        />
        <div className="grid-2">
          <TextField name="imageAltFr" label="Description de l'image (FR)" state={state} initial={p?.imageAltFr} required />
          <TextField name="imageAltEn" label="Description de l'image (EN)" state={state} initial={p?.imageAltEn} required />
          <TextField name="captionFr" label="Légende (FR)" state={state} initial={p?.captionFr} />
          <TextField name="captionEn" label="Légende (EN)" state={state} initial={p?.captionEn} />
          <TextField name="repoUrl" label="Code source" type="url" state={state} initial={p?.repoUrl} />
          <TextField name="liveUrl" label="Site en ligne" type="url" state={state} initial={p?.liveUrl} />
        </div>
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
        </div>
      </fieldset>

      <div className="a-actions">
        <SubmitButton>{p ? "Enregistrer les modifications" : "Créer le projet"}</SubmitButton>
      </div>
    </form>
  );
}
