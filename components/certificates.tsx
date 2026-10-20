import Image from "next/image";
import type { Dictionary } from "@/lib/dictionary";
import type { Certificate } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { SectionHead } from "@/lib/site/sections";
import { AccentHeading } from "./accent-heading";
import { Icon } from "./icon";

type Props = {
  locale: Locale;
  t: Dictionary["certificates"];
  head: SectionHead;
  certificates: Certificate[];
};

/** Hidden until at least one certificate is published from /admin. */
export function Certificates({ locale, t, head, certificates }: Props) {
  if (certificates.length === 0) return null;
  const month = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <section className="section is-tight" id="certifications" aria-labelledby="certifications-title">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow">{head.eyebrow}</p>
            <AccentHeading heading={head.heading} id="certifications-title" />
          </div>
        </div>
        <ul className="certs">
          {certificates.map((c) => (
            <li className="cert" key={c.id}>
              <div className="cert-media" aria-hidden="true">
                {c.fileUrl && !c.fileIsPdf ? (
                  <Image src={c.fileUrl} alt="" fill sizes="(max-width: 680px) 92vw, 360px" />
                ) : (
                  <span className="cert-badge">
                    <Icon name="certificate" />
                  </span>
                )}
              </div>
              <div className="cert-body">
                <h3>{c.title[locale]}</h3>
                <p className="cert-issuer">{c.issuer}</p>
                <p className="cert-date">{month.format(new Date(c.issuedAt))}</p>
                <div className="links">
                  {c.fileUrl && (
                    <a href={c.fileUrl} target="_blank" rel="noreferrer">
                      <Icon name="external" />
                      {c.fileIsPdf ? t.viewPdf : t.view}
                    </a>
                  )}
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer">
                      <Icon name="external" />
                      {t.verify}
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
