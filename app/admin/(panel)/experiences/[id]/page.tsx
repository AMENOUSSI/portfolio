import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteExperience, updateExperience } from "../../../actions/experiences";
import { DeleteButton } from "@/components/admin/fields";
import { ExperienceForm } from "@/components/admin/experience-form";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Modifier l'entrée" };

export default async function EditExperience({ params }: PageProps<"/admin/experiences/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const entry = await db.experience.findUnique({ where: { id } });
  if (!entry) notFound();

  return (
    <>
      <Link className="a-back" href="/admin/experiences">
        ← Parcours
      </Link>
      <div className="a-head">
        <h1>{entry.titleFr}</h1>
      </div>
      <ExperienceForm action={updateExperience.bind(null, entry.id)} experience={entry} />
      <div className="a-danger-zone">
        <p>Supprimer cette entrée la retire définitivement du parcours.</p>
        <DeleteButton action={deleteExperience.bind(null, entry.id)} what="cette entrée" />
      </div>
    </>
  );
}
