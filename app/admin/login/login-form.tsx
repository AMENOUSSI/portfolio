"use client";

import { useActionState } from "react";
import { login } from "../actions/auth";
import { initialFormState } from "@/lib/admin/form-state";
import { FormMessage, SubmitButton, TextField } from "@/components/admin/fields";

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialFormState);
  return (
    <form action={formAction} className="a-form" noValidate>
      <FormMessage state={state} />
      <TextField name="email" label="Adresse e-mail" type="email" state={state} required />
      <TextField name="password" label="Mot de passe" type="password" state={{ ...state, values: undefined }} required />
      <SubmitButton pendingLabel="Connexion…">Se connecter</SubmitButton>
    </form>
  );
}
