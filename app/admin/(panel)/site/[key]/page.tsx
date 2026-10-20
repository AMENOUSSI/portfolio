import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveSection } from "../../../actions/site";
import { SectionForm } from "@/components/admin/section-form";
import { requireAdmin } from "@/lib/auth/dal";
import { getSite } from "@/lib/content";
import { sectionSpecs } from "@/lib/site/form-spec";
import { isSectionKey } from "@/lib/site/sections";

export const metadata: Metadata = { title: "Modifier les textes" };

export default async function EditSection({ params }: PageProps<"/admin/site/[key]">) {
  await requireAdmin();
  const { key } = await params;
  if (!isSectionKey(key)) notFound();
  const site = await getSite();
  const spec = sectionSpecs[key];

  return (
    <>
      <Link className="a-back" href="/admin/site">
        ← Textes du site
      </Link>
      <div className="a-head">
        <div>
          <h1>{spec.title}</h1>
          <p>{spec.description}</p>
        </div>
      </div>
      <SectionForm spec={spec} data={site[key]} action={saveSection.bind(null, key)} />
    </>
  );
}
