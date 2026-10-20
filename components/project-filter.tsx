"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Option = { slug: string; label: string; count: number };

type Props = {
  options: Option[];
  allLabel: string;
  groupLabel: string;
  /** e.g. "{count} projets" — announced to screen readers after each change. */
  resultLabel: string;
  total: number;
  children: ReactNode;
};

/**
 * Category buttons above the projects. Cards carry `data-categories="slug slug"`
 * and are shown or hidden in place, so the server-rendered markup stays
 * complete (and fully visible) without JavaScript.
 */
export function ProjectFilter({ options, allLabel, groupLabel, resultLabel, total, children }: Props) {
  const [active, setActive] = useState("all");
  const list = useRef<HTMLDivElement>(null);
  const visible = active === "all" ? total : (options.find((o) => o.slug === active)?.count ?? 0);

  // Show or hide the server-rendered cards in place.
  useEffect(() => {
    list.current?.querySelectorAll<HTMLElement>("[data-categories]").forEach((card) => {
      card.hidden = active !== "all" && !(card.dataset.categories ?? "").split(" ").includes(active);
    });
  }, [active]);

  return (
    <>
      {options.length > 0 && (
        <div className="filters" role="group" aria-label={groupLabel}>
          {[{ slug: "all", label: allLabel, count: total }, ...options].map((option) => (
            <button
              key={option.slug}
              type="button"
              className="filter"
              aria-pressed={active === option.slug}
              onClick={() => setActive(option.slug)}
            >
              {option.label}
              <span className="filter-count">{option.count}</span>
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {resultLabel.replace("{count}", String(visible))}
      </p>
      <div ref={list}>{children}</div>
    </>
  );
}
