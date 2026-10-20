"use client";

import { useActionState } from "react";
import { formKey, initialFormState, type FormState } from "@/lib/admin/form-state";
import type { FieldSpec, SectionSpec } from "@/lib/site/form-spec";
import { getAt } from "@/lib/site/sections";
import { FormMessage, ImageField, SelectField, SubmitButton, TextField } from "./fields";

type Props = {
  spec: SectionSpec;
  /** Current section data (saved or default). */
  data: unknown;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

/** Stored value → text shown in the input. */
function display(kind: FieldSpec["kind"], value: unknown): string {
  if (Array.isArray(value)) return value.join(kind === "csv" ? ", " : "\n");
  return typeof value === "string" ? value : "";
}

function Field({ field, data, state }: { field: FieldSpec; data: unknown; state: FormState }) {
  if (field.kind === "image") {
    return (
      <>
        <ImageField
          name={`${field.path}.file`}
          label={field.label}
          hint={field.hint ?? "JPEG, PNG, WebP ou AVIF, 3,5 Mo maximum"}
          accept="image/jpeg,image/png,image/webp,image/avif"
          state={state}
          currentUrl={display("text", getAt(data, `${field.path}.src`))}
        />
        <TextField
          name={`${field.path}.src`}
          label="… ou chemin / adresse de l'image"
          hint="Utilisé seulement si aucun fichier n'est choisi"
          state={state}
          initial={display("text", getAt(data, `${field.path}.src`))}
        />
      </>
    );
  }

  const variants = field.localized
    ? [
        { name: `${field.path}.fr`, label: `${field.label} (FR)` },
        { name: `${field.path}.en`, label: `${field.label} (EN)` },
      ]
    : [{ name: field.path, label: field.label }];

  return (
    <>
      {variants.map(({ name, label }) =>
        field.kind === "select" ? (
          <SelectField
            key={name}
            name={name}
            label={label}
            options={field.options ?? []}
            state={state}
            initial={display("text", getAt(data, name))}
          />
        ) : (
          <TextField
            key={name}
            name={name}
            label={label}
            hint={field.hint}
            multiline={field.kind === "textarea" || field.kind === "lines"}
            state={state}
            initial={display(field.kind, getAt(data, name))}
          />
        ),
      )}
    </>
  );
}

export function SectionForm({ spec, data, action }: Props) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form key={formKey(state)} action={formAction} className="a-form" noValidate>
      <FormMessage state={state} />
      {spec.groups.map((group) => (
        <fieldset key={group.title}>
          <legend>{group.title}</legend>
          {group.hint && <p className="fieldset-hint">{group.hint}</p>}
          <div className="grid-2">
            {group.fields.map((field) => (
              <Field key={field.path} field={field} data={data} state={state} />
            ))}
          </div>
        </fieldset>
      ))}
      <div className="a-actions">
        <SubmitButton>Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
