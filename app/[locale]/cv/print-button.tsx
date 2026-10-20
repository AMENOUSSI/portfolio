"use client";

import { Icon } from "@/components/icon";

/** Opens the browser's print dialog, where "Save as PDF" produces the CV file. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="btn btn-primary cv-print" onClick={() => window.print()}>
      {label}
      <span className="knob">
        <Icon name="download" />
      </span>
    </button>
  );
}
