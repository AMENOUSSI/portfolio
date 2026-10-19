"use client";

import { useActionState } from "react";
import type { Skill } from "@/generated/prisma/client";
import { formKey, initialFormState, type FormState } from "@/lib/admin/form-state";
import { skillCategoryLabels } from "@/lib/admin/labels";
import { CheckboxField, FormMessage, SelectField, SubmitButton, TextField } from "./fields";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  skill?: Skill;
};

const categoryOptions = Object.entries(skillCategoryLabels).map(([value, label]) => ({ value, label }));

export function SkillForm({ action, skill }: Props) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form key={formKey(state)} action={formAction} className="a-form" noValidate>
      <FormMessage state={state} />
      <fieldset>
        <legend>Compétence</legend>
        <div className="grid-2">
          <TextField name="name" label="Nom" state={state} initial={skill?.name} required />
          <SelectField
            name="category"
            label="Catégorie"
            options={categoryOptions}
            state={state}
            initial={skill?.category ?? "LANGUAGE"}
            required
          />
          <TextField
            name="icon"
            label="Icône"
            hint="Identifiant sur simpleicons.org (ex. python, postgresql, nextdotjs)"
            state={state}
            initial={skill?.icon}
          />
          <TextField
            name="position"
            label="Ordre d'affichage"
            type="number"
            state={state}
            initial={String(skill?.position ?? 0)}
          />
        </div>
        <div className="checks">
          <CheckboxField
            name="showInToolbox"
            label="Afficher dans « Ma boîte à outils »"
            state={state}
            initial={skill?.showInToolbox ?? false}
          />
        </div>
      </fieldset>
      <div className="a-actions">
        <SubmitButton>{skill ? "Enregistrer les modifications" : "Ajouter la compétence"}</SubmitButton>
      </div>
    </form>
  );
}
