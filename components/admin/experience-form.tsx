"use client";

import { useActionState } from "react";
import type { Experience } from "@/generated/prisma/client";
import { formKey, initialFormState, type FormState } from "@/lib/admin/form-state";
import { timelineKindLabels } from "@/lib/admin/labels";
import { CheckboxField, FormMessage, SelectField, SubmitButton, TextField } from "./fields";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  experience?: Experience;
};

const kindOptions = Object.entries(timelineKindLabels).map(([value, label]) => ({ value, label }));

export function ExperienceForm({ action, experience: e }: Props) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form key={formKey(state)} action={formAction} className="a-form" noValidate>
      <FormMessage state={state} />
      <fieldset>
        <legend>Entrée du parcours</legend>
        <div className="grid-2">
          <SelectField name="kind" label="Type" options={kindOptions} state={state} initial={e?.kind ?? "EXPERIENCE"} required />
          <TextField
            name="startDate"
            label="Mois de début"
            type="month"
            hint="Sert uniquement à trier, du plus récent au plus ancien"
            state={state}
            initial={e ? e.startDate.toISOString().slice(0, 7) : undefined}
            required
          />
          <TextField name="titleFr" label="Intitulé (FR)" state={state} initial={e?.titleFr} required />
          <TextField name="titleEn" label="Intitulé (EN)" state={state} initial={e?.titleEn} required />
          <TextField
            name="organizationFr"
            label="Organisation (FR)"
            hint="Ex. SMART2D Services · secteur bancaire"
            state={state}
            initial={e?.organizationFr}
            required
          />
          <TextField name="organizationEn" label="Organisation (EN)" state={state} initial={e?.organizationEn} required />
          <TextField
            name="periodFr"
            label="Période affichée (FR)"
            hint="Ex. Depuis mars 2025"
            state={state}
            initial={e?.periodFr}
            required
          />
          <TextField
            name="periodEn"
            label="Période affichée (EN)"
            hint="Ex. Since March 2025"
            state={state}
            initial={e?.periodEn}
            required
          />
          <TextField
            name="highlightsFr"
            label="Réalisations (FR)"
            hint="Une par ligne, 2 ou 3 maximum. Affichées sous l'expérience, sur le CV seulement. Ex. Automatisé le rapprochement des transactions (−60 % de temps)"
            multiline
            state={state}
            initial={e?.highlightsFr.join("\n")}
          />
          <TextField
            name="highlightsEn"
            label="Réalisations (EN)"
            hint="One per line."
            multiline
            state={state}
            initial={e?.highlightsEn.join("\n")}
          />
        </div>
        <div className="checks">
          <CheckboxField name="current" label="En cours (affiché en premier, point ambre)" state={state} initial={e?.current ?? false} />
          <CheckboxField name="published" label="Publié sur le site" state={state} initial={e?.published ?? true} />
        </div>
      </fieldset>
      <div className="a-actions">
        <SubmitButton>{e ? "Enregistrer les modifications" : "Ajouter au parcours"}</SubmitButton>
      </div>
    </form>
  );
}
