/**
 * ORCA studio: the night bands, in landing order, on the landing's ground.
 * DEV ONLY; not an input of the production build. Entry: bands.tsx.
 *
 *   cd frontend && npx vite --port 5181 --strictPort
 *   http://localhost:5181/studio/bands.html?fx=all&fxdebug=1
 *
 * Query: `lang=en|hi|mr`, `fx=` as on the landing (`none` for posters only),
 * `fxdebug=1` to count WebGL contexts in `window.__orcaFx`.
 */
import { useState } from "react";
import type { Language } from "../src/types";
import { L10N } from "../src/i18n/landing";
import {
  CallBand,
  HalftoneSea,
  NightWatchBand,
  ThreadsBand,
  WarningBand,
} from "../src/components/landing/NightBands";

export default function BandsStudio({ lang }: { lang: Language }) {
  const [said, setSaid] = useState("");
  const t = L10N[lang];
  return (
    <main tabIndex={-1} className="mx-auto flex min-h-full max-w-[1240px] flex-col px-5 py-5">
      <div className="sheet-ground" aria-hidden />
      {/* a paper section, as the landing's sheets sit above the first band */}
      <section className="panel rule-double my-10 overflow-hidden" aria-label="paper">
        <div className="hd">
          <span className="label">{t.indexTitle}</span>
        </div>
        <div className="p-6">
          <h1 className="font-display text-hero font-semibold leading-tight tracking-tight text-ink-900">
            {t.tag1}
          </h1>
          <p className="mt-4 max-w-[520px] text-lead leading-relaxed text-ink-500">{t.sub}</p>
        </div>
      </section>
      <NightWatchBand language={lang} />
      <HalftoneSea language={lang} />
      <WarningBand language={lang} />
      <ThreadsBand language={lang} />
      <CallBand language={lang} onEnter={(tab) => setSaid(`enter:${tab}`)} onTour={() => setSaid("tour")} />
      <p className="my-10 font-mono text-label uppercase tracking-[0.14em] text-ink-400" data-said={said}>
        {t.footer} {said && `· ${said}`}
      </p>
    </main>
  );
}
