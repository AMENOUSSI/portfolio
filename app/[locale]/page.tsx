import { locale as rootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Domains } from "@/components/domains";
import { FocusBand } from "@/components/focus-band";
import { Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { Projects } from "@/components/projects";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Toolbox } from "@/components/toolbox";
import { getHomeContent } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale } from "@/lib/i18n";

export default async function HomePage() {
  const locale = await rootLocale();
  if (!hasLocale(locale)) notFound();

  const [t, content] = await Promise.all([getDictionary(locale), getHomeContent()]);

  return (
    <>
      <SiteNav locale={locale} t={t.nav} />
      <main id="top">
        <Hero locale={locale} t={t.hero} profile={content.profile} milestones={content.milestones} />
        <FocusBand items={content.focusAreas[locale]} />
        <Domains locale={locale} t={t.domains} domains={content.domains} />
        <About locale={locale} t={t.about} profile={content.profile} />
        <Projects
          locale={locale}
          t={t.projects}
          featured={content.featuredProject}
          others={content.otherProjects}
        />
        <Journey locale={locale} t={t.journey} experience={content.experience} education={content.education} />
        <Toolbox t={t.tools} tools={content.tools} />
        <Contact t={t.contact} email={content.profile.email} />
      </main>
      <SiteFooter t={t.footer} profile={content.profile} />
    </>
  );
}
