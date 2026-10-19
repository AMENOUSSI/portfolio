import type { Dictionary } from "@/lib/dictionary";
import type { HomeContent } from "@/lib/content";

type Props = { t: Dictionary["footer"]; profile: HomeContent["profile"] };

export function SiteFooter({ t, profile }: Props) {
  return (
    <footer className="footer">
      <div className="wrap foot">
        <span>
          © {profile.firstName} {profile.lastName}
        </span>
        <nav aria-label={t.social}>
          <a href={profile.github}>GitHub</a>
          <a href={profile.linkedin}>LinkedIn</a>
          <a href={`mailto:${profile.email}`}>{t.email}</a>
        </nav>
      </div>
    </footer>
  );
}
