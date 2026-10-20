import type { SectionHead } from "@/lib/site/sections";

type Props = {
  heading: SectionHead["heading"];
  /** Highlight the accent word with an amber marker (light sections). */
  marked?: boolean;
  as?: "h1" | "h2";
  id?: string;
};

/** Section title with one word set in the italic accent face. */
export function AccentHeading({ heading, marked = true, as: Tag = "h2", id }: Props) {
  return (
    <Tag className="h2" id={id}>
      {heading.before}
      <span className={marked ? "it it-mark" : "it"}>{heading.accent}</span>
      {heading.after}
    </Tag>
  );
}
