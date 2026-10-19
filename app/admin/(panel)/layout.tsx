import Link from "next/link";
import { logout } from "../actions/auth";
import { requireAdmin } from "@/lib/auth/dal";

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/projets", label: "Projets" },
  { href: "/admin/competences", label: "Compétences" },
  { href: "/admin/experiences", label: "Parcours" },
];

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const { email } = await requireAdmin();

  return (
    <div className="a-shell">
      <aside className="a-side">
        <Link className="brand" href="/admin">
          <span className="monogram" aria-hidden="true">
            AJ
          </span>
          <span>Admin</span>
        </Link>
        <nav aria-label="Administration">
          <ul className="a-nav">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="a-side-foot">
          <a href="/" target="_blank" rel="noreferrer">
            Voir le site ↗
          </a>
          <span title={email}>{email}</span>
          <form action={logout}>
            <button type="submit" className="a-link-button">
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>
      <main className="a-main">{children}</main>
    </div>
  );
}
