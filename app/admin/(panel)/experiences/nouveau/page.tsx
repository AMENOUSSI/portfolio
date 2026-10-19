import type { Metadata } from "next";
import Link from "next/link";
import { createExperience } from "../../../actions/experiences";
import { ExperienceForm } from "@/components/admin/experience-form";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Nouvelle entrée de parcours" };

export default async function NewExperience() {
  await requireAdmin();
  return (
    <>
      <Link className="a-back" href="/admin/experiences">
        ← Parcours
      </Link>
      <div className="a-head">
        <h1>Nouvelle entrée de parcours</h1>
      </div>
      <ExperienceForm action={createExperience} />
    </>
  );
}
