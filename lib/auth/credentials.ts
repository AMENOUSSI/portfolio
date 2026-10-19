import "server-only";
import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

/*
 * Single admin account, configured through environment variables:
 *   ADMIN_EMAIL           the login email
 *   ADMIN_PASSWORD_HASH   base64 of a bcrypt hash (see `npm run admin:hash`);
 *                         base64 avoids `$` being expanded in .env files.
 */

function sameText(a: string, b: string): boolean {
  const left = Buffer.from(a.trim().toLowerCase());
  const right = Buffer.from(b.trim().toLowerCase());
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const encodedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedEmail || !encodedHash) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set");
  }
  const hash = Buffer.from(encodedHash, "base64").toString("utf8");
  // Always run bcrypt so a wrong email takes as long as a wrong password.
  const passwordOk = await bcrypt.compare(password, hash);
  return sameText(email, expectedEmail) && passwordOk;
}
