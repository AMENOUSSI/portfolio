import type { Dictionary } from "@/lib/dictionary";
import { AccentHeading } from "./accent-heading";
import { Icon } from "./icon";

export function Contact({ t, email }: { t: Dictionary["contact"]; email: string }) {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact-card on-dark">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <AccentHeading heading={t.heading} marked={false} id="contact-title" />
            <p className="contact-body">{t.body}</p>
          </div>
          <div className="contact-actions">
            <a className="btn btn-amber" href={`mailto:${email}`}>
              {t.write}
              <span className="knob">
                <Icon name="arrow" />
              </span>
            </a>
            <span className="mail">{email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
