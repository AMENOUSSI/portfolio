import { siGit, siLaravel, siNextdotjs, siPandas, siPostgresql, siPython } from "simple-icons";
import type { Dictionary } from "@/lib/dictionary";
import type { Tool, ToolIcon } from "@/lib/content";
import { AccentHeading } from "./accent-heading";

const icons: Record<ToolIcon, { path: string }> = {
  python: siPython,
  pandas: siPandas,
  postgresql: siPostgresql,
  laravel: siLaravel,
  nextjs: siNextdotjs,
  git: siGit,
};

export function Toolbox({ t, tools }: { t: Dictionary["tools"]; tools: Tool[] }) {
  return (
    <section className="section is-tight" aria-labelledby="outils-title">
      <div className="wrap">
        <div className="tools-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <AccentHeading heading={t.heading} id="outils-title" />
        </div>
        <ul className="tools">
          {tools.map((tool) => (
            <li key={tool.name}>
              <span className="tool-disc">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={icons[tool.icon].path} />
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
