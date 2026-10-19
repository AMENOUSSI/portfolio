import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "./session";

/**
 * Data Access Layer check. Call it at the top of every admin page and every
 * admin Server Action: the proxy redirect is only a first, optimistic gate.
 */
export async function requireAdmin(): Promise<{ email: string }> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const email = await verifySession(token);
  if (!email) redirect("/admin/login");
  return { email };
}
