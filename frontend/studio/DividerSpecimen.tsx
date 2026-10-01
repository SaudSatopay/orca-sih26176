/**
 * Dev-only preview of the two chart dividers on the real sheet. Open
 * /studio/dividers.html on the studio server (see InkStudio.tsx for the command).
 */
import "@fontsource-variable/archivo";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/spline-sans-mono";
import "../src/index.css";
import { ContourDivider, WaveDivider } from "../src/components/ChartDividers";

export default function DividerSpecimen() {
  return (
    <main className="mx-auto max-w-[1240px] px-5 py-8">
      <p className="label">WaveDivider · between sections</p>
      <div className="panel mt-3 px-4 py-5">
        <span className="font-display text-heading font-bold text-ink-900">A panel above</span>
        <div className="wave-rule mt-3 max-w-[360px]" />
      </div>
      <WaveDivider className="mt-8" />
      <div className="panel px-4 py-5">
        <span className="font-display text-heading font-bold text-ink-900">A panel below</span>
      </div>

      <p className="label mt-14">ContourDivider · the quieter break</p>
      <div className="panel mt-3 px-4 py-5">
        <span className="font-display text-heading font-bold text-ink-900">A panel above</span>
      </div>
      <ContourDivider className="my-6" />
      <div className="panel px-4 py-5">
        <span className="font-display text-heading font-bold text-ink-900">A panel below</span>
      </div>

      <p className="label mt-14">Haikei · Layered Waves · the raw export (studio/haikei/layered-waves.svg)</p>
      <img
        src="./haikei/layered-waves.svg"
        alt=""
        className="mt-3 block w-full"
        style={{ height: 96 }}
      />
    </main>
  );
}
