"use client";

import { useActionState } from "react";
import type { ProjectCategory } from "@/generated/prisma/client";
import { formKey, initialFormState, type FormState } from "@/lib/admin/form-state";
import { FormMessage, SubmitButton, TextField } from "./fields";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  category?: ProjectCategory;
};

export function CategoryForm({ action, category: c }: Props) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form key={formKey(state)} action={formAction} className="a-form" noValidate>
      <FormMessage state={state} />
      <fieldset>
        <legend>Catégorie</legend>
        <div className="grid-2">
          <TextField name="nameFr" label="Nom (FR)" hint="Ex. Web & mobile" state={state} initial={c?.nameFr} required />
          <TextField name="nameEn" label="Nom (EN)" state={state} initial={c?.nameEn} required />
          <TextField
            name="slug"
            label="Slug"
            hint="Laissez vide pour le générer depuis le nom anglais"
            state={state}
            initial={c?.slug}
          />
          <TextField
            name="position"
            label="Ordre des boutons"
            type="number"
            hint="Les plus petits nombres s'affichent en premier"
            state={state}
            initial={String(c?.position ?? 0)}
          />
        </div>
      </fieldset>
      <div className="a-actions">
        <SubmitButton>{c ? "Enregistrer les modifications" : "Créer la catégorie"}</SubmitButton>
      </div>
    </form>
  );
}
