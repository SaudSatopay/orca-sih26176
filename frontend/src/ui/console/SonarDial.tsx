import { Ripple } from "../magicui/ripple";
import { ink } from "../../tokens";

/**
 * The empty verdict slot's dial: the dashed ring the verdict will be stamped
 * into, with sonar rings going out from it while ORCA waits for a question.
 * The rings are the kit's Ripple (a CSS loop the ambient watcher pauses off
 * screen; still under reduced motion). Decoration only.
 */
export function SonarDial({ size = 76 }: { size?: number }) {
  const c = size / 2;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-hidden data-sonar>
      <Ripple mainCircleSize={size} step={34} numCircles={4} mainCircleOpacity={0.3} style={{ inset: -size }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative">
        <circle cx={c} cy={c} r={c - 8} fill="none" stroke={ink[300]} strokeWidth="5" strokeDasharray="3 5" />
        <circle cx={c} cy={c} r={c - 1.5} fill="none" stroke={ink[300]} strokeWidth="0.8" />
      </svg>
    </div>
  );
}
