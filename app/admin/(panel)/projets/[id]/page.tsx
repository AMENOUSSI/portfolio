import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject, updateProject } from "../../../actions/projects";
import { DeleteButton } from "@/components/admin/fields";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Modifier le projet" };

export default async function EditProject({ params }: PageProps<"/admin/projets/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [project, categories] = await Promise.all([
    db.project.findUnique({ where: { id }, include: { categories: true } }),
    db.projectCategory.findMany({ orderBy: [{ position: "asc" }, { nameFr: "asc" }] }),
  ]);
  if (!project) notFound();

  return (
    <>
      <Link className="a-back" href="/admin/projets">
        ← Projets
      </Link>
      <div className="a-head">
        <h1>{project.titleFr}</h1>
      </div>
      <ProjectForm action={updateProject.bind(null, project.id)} project={project} categories={categories} />
      <div className="a-danger-zone">
        <p>Supprimer ce projet le retire définitivement du site.</p>
        <DeleteButton action={deleteProject.bind(null, project.id)} what="ce projet" />
      </div>
    </>
  );
}
