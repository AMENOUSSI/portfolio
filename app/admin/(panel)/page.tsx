import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export default async function AdminHome() {
  await requireAdmin();
  const [projects, skills, experiences] = await Promise.all([
    db.project.count(),
    db.skill.count(),
    db.experience.count(),
  ]);

  const cards = [
    { count: projects, label: "projets", href: "/admin/projets/nouveau", cta: "Ajouter un projet" },
    { count: skills, label: "compétences", href: "/admin/competences/nouveau", cta: "Ajouter une compétence" },
    { count: experiences, label: "entrées de parcours", href: "/admin/experiences/nouveau", cta: "Ajouter une expérience" },
  ];

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Tableau de bord</h1>
          <p>Chaque enregistrement met le site public à jour immédiatement.</p>
        </div>
      </div>
      <div className="a-cards">
        {cards.map((c) => (
          <div className="a-card" key={c.label}>
            <b>{c.count}</b>
            <span>{c.label}</span>
            <Link href={c.href}>{c.cta}</Link>
          </div>
        ))}
      </div>
    </>
  );
}
