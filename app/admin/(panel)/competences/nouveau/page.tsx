import type { Metadata } from "next";
import Link from "next/link";
import { createSkill } from "../../../actions/skills";
import { SkillForm } from "@/components/admin/skill-form";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Nouvelle compétence" };

export default async function NewSkill() {
  await requireAdmin();
  return (
    <>
      <Link className="a-back" href="/admin/competences">
        ← Compétences
      </Link>
      <div className="a-head">
        <h1>Nouvelle compétence</h1>
      </div>
      <SkillForm action={createSkill} />
    </>
  );
}
