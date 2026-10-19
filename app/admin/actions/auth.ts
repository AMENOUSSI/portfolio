"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { checkCredentials } from "@/lib/auth/credentials";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth/session";
import type { FormState } from "@/lib/admin/form-state";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Adresse e-mail requise"),
  password: z.string().min(1, "Mot de passe requis"),
});

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values: { email } };
  }

  if (!(await checkCredentials(parsed.data.email, parsed.data.password))) {
    // Slow down repeated guesses a little.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { message: "Adresse e-mail ou mot de passe incorrect.", values: { email } };
  }

  const { token, expiresAt } = await signSession(parsed.data.email);
  (await cookies()).set(SESSION_COOKIE, token, { ...sessionCookieOptions, expires: expiresAt });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: sessionCookieOptions.path });
  redirect("/admin/login");
}
