import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className="login">
      <div className="login-card">
        <span className="monogram" aria-hidden="true">
          AJ
        </span>
        <div>
          <h1>Administration</h1>
          <p className="field-hint">Connectez-vous pour gérer les projets, compétences et expériences.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
