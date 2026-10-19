import { createInterface } from "node:readline/promises";
import bcrypt from "bcryptjs";

/*
 * Prints the ADMIN_PASSWORD_HASH value for a password you type.
 * Usage: npm run admin:hash
 */
async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const password = await rl.question("Nouveau mot de passe admin (12 caractères minimum) : ");
  rl.close();

  if (password.length < 12) {
    console.error("Mot de passe trop court : 12 caractères minimum.");
    process.exitCode = 1;
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  console.log("\nAjoutez cette ligne à .env (et aux variables d'environnement de production) :\n");
  console.log(`ADMIN_PASSWORD_HASH=${Buffer.from(hash, "utf8").toString("base64")}`);
}

main();
