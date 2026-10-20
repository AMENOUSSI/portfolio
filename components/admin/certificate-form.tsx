"use client";

import { useActionState } from "react";
import type { Certificate } from "@/generated/prisma/client";
import { formKey, initialFormState, type FormState } from "@/lib/admin/form-state";
import { CheckboxField, DocumentField, FormMessage, SubmitButton, TextField } from "./fields";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  certificate?: Certificate;
};

export function CertificateForm({ action, certificate: c }: Props) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form key={formKey(state)} action={formAction} className="a-form" noValidate>
      <FormMessage state={state} />
      <fieldset>
        <legend>Certificat</legend>
        <div className="grid-2">
          <TextField name="titleFr" label="Intitulé (FR)" hint="Ex. Certificat d'anglais CEFR C1" state={state} initial={c?.titleFr} required />
          <TextField name="titleEn" label="Intitulé (EN)" state={state} initial={c?.titleEn} required />
          <TextField name="issuer" label="Organisme" hint="Ex. International English Certificate Test" state={state} initial={c?.issuer} required />
          <TextField
            name="issuedAt"
            label="Mois d'obtention"
            type="month"
            state={state}
            initial={c ? c.issuedAt.toISOString().slice(0, 7) : undefined}
            required
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Preuve</legend>
        <p className="fieldset-hint">Un fichier, un lien de vérification, ou les deux.</p>
        <DocumentField
          name="file"
          label={c?.fileUrl ? "Remplacer le fichier" : "Fichier du certificat"}
          hint="PDF ou image (JPEG, PNG, WebP), 3,5 Mo maximum"
          accept="application/pdf,image/jpeg,image/png,image/webp,image/avif"
          state={state}
          currentUrl={c?.fileUrl}
        />
        <TextField
          name="credentialUrl"
          label="Lien de vérification"
          type="url"
          hint="Page de l'organisme qui permet de vérifier le certificat (optionnel)"
          state={state}
          initial={c?.credentialUrl}
        />
      </fieldset>

      <fieldset>
        <legend>Publication</legend>
        <div className="grid-2">
          <TextField
            name="position"
            label="Ordre d'affichage"
            type="number"
            hint="Les plus petits nombres s'affichent en premier"
            state={state}
            initial={String(c?.position ?? 0)}
          />
        </div>
        <div className="checks">
          <CheckboxField name="published" label="Publié sur le site" state={state} initial={c?.published ?? true} />
        </div>
      </fieldset>

      <div className="a-actions">
        <SubmitButton>{c ? "Enregistrer les modifications" : "Ajouter le certificat"}</SubmitButton>
      </div>
    </form>
  );
}
