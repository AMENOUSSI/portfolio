"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/admin/form-state";

/*
 * Form building blocks for the admin. Each field shows the value typed before
 * a failed submit (state.values) or else the stored value (initial).
 */

type Common = {
  name: string;
  label: string;
  state: FormState;
  initial?: string | null;
  hint?: string;
  required?: boolean;
};

function valueOf(state: FormState, name: string, initial?: string | null) {
  return state.values ? (state.values[name] ?? "") : (initial ?? "");
}

function FieldShell({ name, label, hint, error, children }: { name: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className={error ? "field has-error" : "field"}>
      <label htmlFor={name}>{label}</label>
      {children}
      {error ? (
        <p className="field-error" id={`${name}-error`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="field-hint" id={`${name}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function TextField({
  type = "text",
  multiline = false,
  ...props
}: Common & { type?: "text" | "url" | "email" | "password" | "number" | "month"; multiline?: boolean }) {
  const { name, label, state, initial, hint, required } = props;
  const error = state.errors?.[name]?.[0];
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  const shared = {
    id: name,
    name,
    required,
    defaultValue: valueOf(state, name, initial),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  };
  return (
    <FieldShell name={name} label={label} hint={hint} error={error}>
      {multiline ? <textarea rows={3} {...shared} /> : <input type={type} {...shared} />}
    </FieldShell>
  );
}

export function SelectField({ options, ...props }: Common & { options: { value: string; label: string }[] }) {
  const { name, label, state, initial, hint, required } = props;
  const error = state.errors?.[name]?.[0];
  return (
    <FieldShell name={name} label={label} hint={hint} error={error}>
      <select id={name} name={name} required={required} defaultValue={valueOf(state, name, initial)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({ name, label, state, initial }: { name: string; label: string; state: FormState; initial: boolean }) {
  const checked = state.values ? state.values[name] === "on" : initial;
  return (
    <label className="check">
      <input type="checkbox" name={name} defaultChecked={checked} />
      {label}
    </label>
  );
}

/** File picker for a document (PDF or image), with a link to the current file. */
export function DocumentField({
  name,
  label,
  hint,
  state,
  currentUrl,
  accept,
}: {
  name: string;
  label: string;
  hint: string;
  state: FormState;
  currentUrl?: string | null;
  accept: string;
}) {
  const error = state.errors?.[name]?.[0];
  return (
    <FieldShell name={name} label={label} hint={hint} error={error}>
      <div className="image-field">
        {currentUrl && (
          <a className="a-file-link" href={currentUrl} target="_blank" rel="noreferrer">
            Voir le fichier actuel ↗
          </a>
        )}
        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : `${name}-hint`}
        />
      </div>
    </FieldShell>
  );
}

/** Several checkboxes sharing one name; submitted values are kept comma-joined in state.values. */
export function CheckboxGroup({
  name,
  legend,
  hint,
  options,
  state,
  initial,
}: {
  name: string;
  legend: string;
  hint?: string;
  options: { value: string; label: string }[];
  state: FormState;
  initial: string[];
}) {
  const selected = state.values ? (state.values[name] ?? "").split(",").filter(Boolean) : initial;
  return (
    <div className="field">
      <span className="field-label">{legend}</span>
      <div className="checks" role="group" aria-label={legend}>
        {options.map((o) => (
          <label className="check" key={o.value}>
            <input type="checkbox" name={name} value={o.value} defaultChecked={selected.includes(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p className="form-message" role="alert">
      {state.message}
    </p>
  );
}

/** File picker with a preview of the current image and of the newly chosen file. */
export function ImageField({
  name,
  label,
  hint,
  state,
  currentUrl,
  accept,
}: {
  name: string;
  label: string;
  hint: string;
  state: FormState;
  currentUrl?: string | null;
  accept: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const error = state.errors?.[name]?.[0];
  const shown = preview ?? currentUrl;
  return (
    <FieldShell name={name} label={label} hint={hint} error={error}>
      <div className="image-field">
        {shown && (
          <span className="image-preview">
            <Image src={shown} alt="" fill sizes="200px" unoptimized={Boolean(preview)} />
          </span>
        )}
        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : `${name}-hint`}
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
      </div>
    </FieldShell>
  );
}

export function SubmitButton({ children, pendingLabel = "Enregistrement…" }: { children: React.ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="a-btn a-btn-primary" disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Deletes after a browser confirmation; `action` is a bound Server Action. */
export function DeleteButton({ action, what }: { action: () => Promise<void>; what: string }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Supprimer ${what} ? Cette action est définitive.`)) event.preventDefault();
      }}
    >
      <button type="submit" className="a-btn a-btn-danger">
        Supprimer
      </button>
    </form>
  );
}
