import type { Dictionary } from "@/lib/dictionary";
import type { SectionHead } from "@/lib/site/sections";
import { AccentHeading } from "./accent-heading";
import { Icon } from "./icon";

type Props = { t: Dictionary["contact"]; head: SectionHead; body: string; email: string };

export function Contact({ t, head, body, email }: Props) {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact-card on-dark">
          <div>
            <p className="eyebrow">{head.eyebrow}</p>
            <AccentHeading heading={head.heading} marked={false} id="contact-title" />
            {body && <p className="contact-body">{body}</p>}
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
