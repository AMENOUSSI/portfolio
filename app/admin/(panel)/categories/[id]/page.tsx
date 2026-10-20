import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCategory, updateCategory } from "../../../actions/categories";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteButton } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Modifier la catégorie" };

export default async function EditCategory({ params }: PageProps<"/admin/categories/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const category = await db.projectCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <>
      <Link className="a-back" href="/admin/categories">
        ← Catégories
      </Link>
      <div className="a-head">
        <h1>{category.nameFr}</h1>
      </div>
      <CategoryForm action={updateCategory.bind(null, category.id)} category={category} />
      <div className="a-danger-zone">
        <p>Supprimer cette catégorie la retire des projets ; les projets restent publiés.</p>
        <DeleteButton action={deleteCategory.bind(null, category.id)} what="cette catégorie" />
      </div>
    </>
  );
}
