import Image from "next/image";
import type { Dictionary } from "@/lib/dictionary";
import type { ImageRef, Milestone } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/*
 * The hero's signature: the career drawn as a growth curve on a 500×600 plot.
 * Milestones sit on the curve at fixed points (percentages of the plot box),
 * so the curve path and POINTS must change together.
 */
const CURVE = "M30 560C120 540 130 200 260 130S440 70 480 60";
const POINTS = [
  { x: 13.2, y: 88.5, tag: { left: "calc(13.2% + 18px)", top: "calc(88.5% - 66px)" } },
  { x: 26, y: 60.7, tag: { left: "calc(26% + 18px)", top: "calc(60.7% - 22px)" } },
  { x: 84.6, y: 11.5, tag: { right: "calc(15.4% + 18px)", top: "calc(11.5% - 22px)" } },
];
const DELAYS = [0.75, 1.15, 1.75];

type Props = { locale: Locale; t: Dictionary["hero"]; milestones: Milestone[]; portrait: ImageRef };

export function CareerPlot({ locale, t, milestones, portrait }: Props) {
  return (
    <figure className="plot" aria-label={t.plotLabel}>
      <svg viewBox="0 0 500 600" aria-hidden="true">
        <defs>
          <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M25 0H0V25" fill="none" stroke="rgba(255,255,255,.055)" />
          </pattern>
          <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M100 0H0V100" fill="none" stroke="rgba(255,255,255,.09)" />
          </pattern>
          <linearGradient id="under" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F2A900" stopOpacity=".22" />
            <stop offset="1" stopColor="#F2A900" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="500" height="600" fill="url(#grid)" />
        <rect width="500" height="600" fill="url(#grid-major)" />
        <path d="M30 570H482M30 570V26" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" fill="none" />
        <path d="M476 565l7 5-7 5M25 32l5-7 5 7" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" fill="none" />
        <text x="42" y="592" fontFamily="var(--mono)" fontSize="12" fill="#9AA6BF">
          {t.axisX}
        </text>
        <text x="42" y="22" fontFamily="var(--mono)" fontSize="12" fill="#9AA6BF">
          {t.axisY}
        </text>
        <path className="area" d={`${CURVE}V570H30Z`} fill="url(#under)" />
        <path
          className="curve"
          d={CURVE}
          fill="none"
          stroke="#F2A900"
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength={1000}
        />
      </svg>

      <div className="portrait">
        <Image
          src={portrait.src}
          alt={portrait.alt[locale]}
          fill
          sizes="(max-width: 1000px) 52vw, 270px"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {milestones.map((m, i) => {
        const p = POINTS[i];
        if (!p) return null;
        const isLatest = i === milestones.length - 1;
        return (
          <div key={m.title.en}>
            <span
              className="point"
              style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${DELAYS[i]}s` }}
            />
            <div
              className={isLatest ? "tag is-latest" : "tag"}
              style={{ ...p.tag, animationDelay: `${DELAYS[i] + 0.2}s` }}
            >
              <strong>{m.title[locale]}</strong>
              <span>{m.detail[locale]}</span>
            </div>
          </div>
        );
      })}
    </figure>
  );
}
