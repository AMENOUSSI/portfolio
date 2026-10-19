import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteSkill, updateSkill } from "../../../actions/skills";
import { DeleteButton } from "@/components/admin/fields";
import { SkillForm } from "@/components/admin/skill-form";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Modifier la compétence" };

export default async function EditSkill({ params }: PageProps<"/admin/competences/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const skill = await db.skill.findUnique({ where: { id } });
  if (!skill) notFound();

  return (
    <>
      <Link className="a-back" href="/admin/competences">
        ← Compétences
      </Link>
      <div className="a-head">
        <h1>{skill.name}</h1>
      </div>
      <SkillForm action={updateSkill.bind(null, skill.id)} skill={skill} />
      <div className="a-danger-zone">
        <p>Supprimer cette compétence la retire du site.</p>
        <DeleteButton action={deleteSkill.bind(null, skill.id)} what="cette compétence" />
      </div>
    </>
  );
}
