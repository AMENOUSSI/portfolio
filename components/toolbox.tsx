import * as simpleIcons from "simple-icons";
import type { Tool } from "@/lib/content";
import type { SectionHead } from "@/lib/site/sections";
import { AccentHeading } from "./accent-heading";

/** Looks up a simple-icons slug ("nextdotjs" → `siNextdotjs`). Server-only, so the icon set never ships to the browser. */
function iconPath(slug: string): string | undefined {
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
  const icon = (simpleIcons as Record<string, { path?: string } | undefined>)[key];
  return icon?.path;
}

export function Toolbox({ head, tools }: { head: SectionHead; tools: Tool[] }) {
  const items = tools.flatMap((tool) => {
    const path = iconPath(tool.icon);
    return path ? [{ ...tool, path }] : [];
  });
  if (items.length === 0) return null;

  return (
    <section className="section is-tight" aria-labelledby="outils-title">
      <div className="wrap">
        <div className="tools-head">
          <p className="eyebrow">{head.eyebrow}</p>
          <AccentHeading heading={head.heading} id="outils-title" />
        </div>
        <ul className="tools">
          {items.map((tool) => (
            <li key={tool.name}>
              <span className="tool-disc">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={tool.path} />
                </svg>
              </span>
              {tool.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
