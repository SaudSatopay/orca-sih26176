/**
 * Small drawn marks used by the working views. Same hand as glyphs.tsx:
 * inline SVG, one stroke weight, currentColor, never a typed character
 * standing in for an icon.
 */

type G = { size?: number; className?: string };

/** The chart's "no entry" sign: a ring with a bar across it. */
export function NoEntryGlyph({ size = 16, className = "" }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="7.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5.4 10 H14.6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** A chevron pointing down; rotate it for the other directions. */
export function ChevronGlyph({ size = 10, className = "" }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path
        d="M2.2 4.2 L6 8 L9.8 4.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CrossGlyph({ size = 11, className = "" }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/** Sort direction: the arrow points down for descending; CSS turns it over. */
export function SortGlyph({ size = 9, className = "" }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className={className} aria-hidden>
      <path d="M1.2 3 H8.8 L5 8.4 Z" fill="currentColor" />
    </svg>
  );
}

/** A sheet leaving the chart table: export as a file. */
export function DownloadGlyph({ size = 12, className = "" }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden>
      <path
        d="M7 1.8 V8.6 M4.2 6 L7 8.8 L9.8 6 M2 11.6 H12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** An empty search circle: the radius ORCA swept, with nothing in it. */
export function EmptySweepGlyph({ size = 44, className = "" }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className} aria-hidden>
      <circle cx="22" cy="22" r="19" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 5" />
      <circle cx="22" cy="22" r="10.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />
      <path d="M22 16.5 V27.5 M16.5 22 H27.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
