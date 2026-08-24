import type { CatchRating, FishingOutlook, Language } from "../types";

export const RATING_COLOR: Record<CatchRating, string> = {
  very_good: "#2FBF71",
  good: "#7FC96B",
  fair: "#D9A63C",
  poor: "#B06A5A",
};

const RATING_WORD: Record<Language, Record<CatchRating, string>> = {
  en: { very_good: "Very good", good: "Good", fair: "Some chance", poor: "Low chance" },
  hi: { very_good: "बहुत अच्छा", good: "अच्छा", fair: "कुछ उम्मीद", poor: "कम उम्मीद" },
  mr: { very_good: "खूप चांगली", good: "चांगली", fair: "थोडी शक्यता", poor: "कमी शक्यता" },
};

const T: Record<Language, Record<string, string>> = {
  en: {
    advice: "What you should do",
    areas: "Best places to fish",
    within: "within",
    away: "away",
    chance: "chance of fish",
    trip: "Your trip",
    stay: "Stay there",
    travel: "Travel each way",
    total: "Whole trip",
    hours: "hours",
    min: "min",
    bestTime: "Best time to fish",
    avoid: "Stay out of these areas",
    closedNow: "closed now",
    closedBetween: "closed",
    always: "always closed",
    forecast: "Next days",
    today: "Today",
    tomorrow: "Tomorrow",
    dayAfter: "Day after",
    bestAt: "best around",
    notWorth: "Not enough safe time today for this trip.",
  },
  hi: {
    advice: "आपको क्या करना चाहिए",
    areas: "मछली पकड़ने की सबसे अच्छी जगहें",
    within: "के अंदर",
    away: "दूर",
    chance: "मछली की उम्मीद",
    trip: "आपकी यात्रा",
    stay: "वहाँ रुकें",
    travel: "एक तरफ़ का सफ़र",
    total: "पूरी यात्रा",
    hours: "घंटे",
    min: "मिनट",
    bestTime: "मछली पकड़ने का सबसे अच्छा समय",
    avoid: "इन जगहों से दूर रहें",
    closedNow: "अभी बंद",
    closedBetween: "बंद",
    always: "हमेशा बंद",
    forecast: "अगले दिन",
    today: "आज",
    tomorrow: "कल",
    dayAfter: "परसों",
    bestAt: "सबसे अच्छा समय",
    notWorth: "आज इतना सुरक्षित समय नहीं है।",
  },
  mr: {
    advice: "तुम्ही काय करावे",
    areas: "मासेमारीसाठी सर्वोत्तम जागा",
    within: "च्या आत",
    away: "अंतरावर",
    chance: "मासे मिळण्याची शक्यता",
    trip: "तुमची फेरी",
    stay: "तिथे थांबा",
    travel: "एका बाजूचा प्रवास",
    total: "संपूर्ण फेरी",
    hours: "तास",
    min: "मिनिटे",
    bestTime: "मासेमारीसाठी सर्वोत्तम वेळ",
    avoid: "या जागांपासून दूर राहा",
    closedNow: "आत्ता बंद",
    closedBetween: "बंद",
    always: "नेहमी बंद",
    forecast: "पुढील दिवस",
    today: "आज",
    tomorrow: "उद्या",
    dayAfter: "परवा",
    bestAt: "सर्वोत्तम वेळ",
    notWorth: "आज पुरेसा सुरक्षित वेळ नाही.",
  },
};

function clock12(h: number): string {
  const hh = h % 24;
  return `${hh % 12 || 12} ${hh < 12 ? "AM" : "PM"}`;
}

function dayName(offset: number, t: Record<string, string>): string {
  return offset === 0 ? t.today : offset === 1 ? t.tomorrow : t.dayAfter;
}

export default function FishingPanel({
  data,
  language = "en",
  onSelectArea,
}: {
  data: FishingOutlook;
  language?: Language;
  onSelectArea?: (rank: number) => void;
}) {
  const t = T[language] ?? T.en;
  const words = RATING_WORD[language] ?? RATING_WORD.en;
  const top = data.areas.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* ---------- plain-language advice: the most important panel ---------- */}
      <div className="card overflow-hidden">
        <div className="border-b border-white/10 px-5 py-3">
          <div className="label">{t.advice}</div>
        </div>
        <ul className="space-y-2.5 px-5 py-4">
          {data.advice.map((line, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: i === 0 ? "#2FBF71" : "rgba(127,178,229,.55)" }}
              />
              <span
                className={
                  i === 0
                    ? "text-[15px] font-bold leading-relaxed text-white"
                    : "text-[13.5px] leading-relaxed text-ocean-100/90"
                }
              >
                {line}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- best places ---------- */}
      {top.length > 0 && (
        <div className="card p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="label">{t.areas}</span>
            <span className="font-mono text-[10px] text-ocean-300">
              {t.within} {data.radius_km} km
            </span>
          </div>

          <div className="space-y-2">
            {top.map((a) => (
              <button
                key={a.id}
                onClick={() => onSelectArea?.(a.rank)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-left transition hover:border-ocean-500/50 hover:bg-white/[0.06]"
              >
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[15px] font-extrabold text-ocean-950"
                  style={{ background: RATING_COLOR[a.rating] }}
                >
                  {a.rank}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[14px] font-bold text-ocean-100">
                      {Math.round(a.distance_km)} km {t.away}
                    </span>
                    {a.recommended && (
                      <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-emerald-200">
                        {language === "mr" ? "सुचवलेली" : language === "hi" ? "सुझाई गई" : "Best trip"}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-ocean-300/85">
                    {words[a.rating]} {t.chance}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div
                    className="font-mono text-[20px] font-extrabold leading-none tabular-nums"
                    style={{ color: RATING_COLOR[a.rating] }}
                  >
                    {a.probability}%
                  </div>
                  <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${a.probability}%`,
                        background: RATING_COLOR[a.rating],
                      }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {data.best_window && (
            <div className="mt-3 rounded-xl bg-emerald-400/10 px-3.5 py-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300/80">
                {t.bestTime}
              </div>
              <div className="mt-0.5 text-[15px] font-bold text-emerald-200">
                {clock12(data.best_window.from_hour)} – {clock12(data.best_window.to_hour)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------- trip plan ---------- */}
      {data.duration && (
        <div className="card p-4">
          <div className="label mb-3">{t.trip}</div>
          {data.duration.feasible ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: t.stay, v: `${data.duration.recommended_hours}`, u: t.hours, hero: true },
                  {
                    k: t.travel,
                    v: `${data.duration.travel_each_way_minutes}`,
                    u: t.min,
                    hero: false,
                  },
                  { k: t.total, v: `${data.duration.total_trip_hours}`, u: t.hours, hero: false },
                ].map((x) => (
                  <div
                    key={x.k}
                    className={`rounded-xl border px-3 py-2.5 ${
                      x.hero
                        ? "border-emerald-400/40 bg-emerald-400/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="label truncate">{x.k}</div>
                    <div
                      className={`mt-0.5 font-mono text-[19px] font-extrabold tabular-nums ${
                        x.hero ? "text-emerald-200" : "text-ocean-100"
                      }`}
                    >
                      {x.v}
                      <span className="ml-1 text-[11px] font-semibold opacity-70">{x.u}</span>
                    </div>
                  </div>
                ))}
              </div>
              {data.duration.limited_by_weather && (
                <p className="mt-2.5 text-[12px] text-amber-200/90">
                  ⚠ {language === "mr"
                    ? "हवामानामुळे वेळ कमी आहे — लवकर परत या."
                    : language === "hi"
                      ? "मौसम के कारण समय कम है — जल्दी लौटें।"
                      : "Weather shortens your window — come back earlier."}
                </p>
              )}
            </>
          ) : (
            <p className="text-[13px] text-amber-200">{t.notWorth}</p>
          )}
        </div>
      )}

      {/* ---------- avoid ---------- */}
      {data.avoid.length > 0 && (
        <div className="card border-risk-extreme/35 bg-risk-extreme/[0.07] p-4">
          <div className="label mb-2.5 text-red-200/80">{t.avoid}</div>
          <div className="space-y-2">
            {data.avoid.map((z) => (
              <div key={z.name} className="flex items-start gap-2.5">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm bg-risk-extreme" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-red-100">{z.name}</div>
                  <div className="mt-0.5 text-[11.5px] text-red-200/75">
                    {Math.round(z.distance_km)} km {t.away} ·{" "}
                    {z.window ? (
                      <span className={z.active_now ? "font-bold text-red-100" : ""}>
                        {t.closedBetween} {z.window}
                        {z.active_now ? ` (${t.closedNow})` : ""}
                      </span>
                    ) : (
                      t.always
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- 3-day outlook ---------- */}
      {data.forecast.length > 1 && (
        <div className="card p-4">
          <div className="label mb-3">{t.forecast}</div>
          <div className="grid grid-cols-3 gap-2">
            {data.forecast.map((f) => (
              <div
                key={f.day_offset}
                className={`rounded-xl border px-3 py-3 text-center ${
                  f.day_offset === 0
                    ? "border-ocean-500/40 bg-ocean-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="label truncate">{dayName(f.day_offset, t)}</div>
                <div
                  className="mt-1 font-mono text-[24px] font-extrabold leading-none tabular-nums"
                  style={{ color: RATING_COLOR[f.rating] }}
                >
                  {f.probability}%
                </div>
                <div className="mt-1.5 text-[10.5px] leading-tight text-ocean-300/85">
                  {t.bestAt} {clock12(f.best_hour)}
                </div>
                <div className="mt-1 font-mono text-[10px] text-ocean-300/70">
                  {f.wave_height_m} m
                </div>
                {f.official_warning && (
                  <div className="mt-1.5 rounded-full bg-risk-extreme/25 px-1.5 py-0.5 text-[9px] font-bold text-red-200">
                    ⚠
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-[10.5px] leading-relaxed text-ocean-300/60">
            {data.method}
          </p>
        </div>
      )}
    </div>
  );
}
