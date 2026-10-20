import { locale as rootLocale } from "next/root-params";
import { notFound } from "next/navigation";
import { About } from "@/components/about";
import { Certificates } from "@/components/certificates";
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
import { sectionHead } from "@/lib/site/sections";

export default async function HomePage() {
  const locale = await rootLocale();
  if (!hasLocale(locale)) notFound();

  const [t, content] = await Promise.all([getDictionary(locale), getHomeContent()]);
  const { site } = content;
  const { journey, contact } = site.sections;

  return (
    <>
      <SiteNav locale={locale} t={t.nav} />
      <main id="top">
        <Hero locale={locale} t={t.hero} profile={content.profile} milestones={content.milestones} />
        <FocusBand items={content.focusAreas[locale]} />
        <Domains locale={locale} t={t.domains} head={sectionHead(site.domains, locale)} domains={content.domains} />
        <About locale={locale} t={t.about} head={sectionHead(site.about, locale)} profile={content.profile} />
        <Projects
          locale={locale}
          t={t.projects}
          head={sectionHead(site.sections.projects, locale)}
          featured={content.featuredProject}
          others={content.otherProjects}
          categories={content.projectCategories}
        />
        <Journey
          locale={locale}
          head={sectionHead(journey, locale)}
          labels={{ experience: journey.experience[locale], education: journey.education[locale] }}
          experience={content.experience}
          education={content.education}
        />
        <Certificates
          locale={locale}
          t={t.certificates}
          head={sectionHead(site.sections.certificates, locale)}
          certificates={content.certificates}
        />
        <Toolbox head={sectionHead(site.sections.tools, locale)} tools={content.tools} />
        <Contact
          t={t.contact}
          head={sectionHead(contact, locale)}
          body={contact.body[locale]}
          email={content.profile.email}
        />
      </main>
      <SiteFooter t={t.footer} profile={content.profile} />
    </>
  );
}
