/** Tilted amber marquee of focus areas, between the hero and the domains. */
export function FocusBand({ items }: { items: string[] }) {
  const list = (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div className="band" role="region" aria-label={items.join(", ")}>
      <div className="band-track">
        {/* Rendered twice so the loop is seamless; screen readers get the label above. */}
        <div className="marquee" aria-hidden="true">
          {list}
          {list}
        </div>
      </div>
    </div>
  );
}
