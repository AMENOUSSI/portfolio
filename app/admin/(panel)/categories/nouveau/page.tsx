import type { Metadata } from "next";
import Link from "next/link";
import { createCategory } from "../../../actions/categories";
import { CategoryForm } from "@/components/admin/category-form";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Nouvelle catégorie" };

export default async function NewCategory() {
  await requireAdmin();
  return (
    <>
      <Link className="a-back" href="/admin/categories">
        ← Catégories
      </Link>
      <div className="a-head">
        <h1>Nouvelle catégorie</h1>
      </div>
      <CategoryForm action={createCategory} />
    </>
  );
}
