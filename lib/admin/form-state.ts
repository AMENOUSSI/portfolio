import { z } from "zod";

/** What an admin Server Action returns to its form when it does not redirect. */
export type FormState = {
  message?: string;
  errors?: Record<string, string[] | undefined>;
  /** Submitted values, so the form keeps what was typed after an error. */
  values?: Record<string, string>;
};

export const initialFormState: FormState = {};

/**
 * React resets a form after its action runs, and a <select> resets to the value
 * it had when first mounted. Keying the form on the submitted values remounts
 * it with those values as defaults, so nothing typed is lost after an error.
 */
export function formKey(state: FormState): string {
  return state.values ? JSON.stringify(state.values) : "initial";
}

export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  }
  return values;
}

export function invalid(error: z.ZodError, values: Record<string, string>): FormState {
  return {
    message: "Certains champs sont à corriger.",
    errors: z.flattenError(error).fieldErrors as FormState["errors"],
    values,
  };
}

/** Prisma unique-constraint violation (e.g. a slug or skill name already taken). */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}
