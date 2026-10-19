import type { Metadata } from "next";
import Link from "next/link";
import { createProject } from "../../../actions/projects";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Nouveau projet" };

export default async function NewProject() {
  await requireAdmin();
  return (
    <>
      <Link className="a-back" href="/admin/projets">
        ← Projets
      </Link>
      <div className="a-head">
        <h1>Nouveau projet</h1>
      </div>
      <ProjectForm action={createProject} />
    </>
  );
}
