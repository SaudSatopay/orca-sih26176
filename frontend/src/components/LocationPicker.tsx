import { useEffect, useRef, useState } from "react";
import type { Language } from "../types";

export interface PickedLocation {
  latitude: number;
  longitude: number;
  label: string;
  source: "gps" | "map" | "port" | "default";
}

/** Landing centres a fisher can pick without typing coordinates. */
export const PORTS: { name: string; state: string; lat: number; lon: number }[] = [
  { name: "Mumbai", state: "Maharashtra", lat: 18.922, lon: 72.8347 },
  { name: "Ratnagiri", state: "Maharashtra", lat: 16.9902, lon: 73.312 },
  { name: "Panaji (Goa)", state: "Goa", lat: 15.4909, lon: 73.8278 },
  { name: "Veraval", state: "Gujarat", lat: 20.907, lon: 70.3679 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185 },
  { name: "Paradip", state: "Odisha", lat: 20.2648, lon: 86.6947 },
  { name: "Digha", state: "West Bengal", lat: 21.627, lon: 87.509 },
  { name: "Port Blair", state: "Andaman & Nicobar", lat: 11.6234, lon: 92.7265 },
];

const T: Record<Language, Record<string, string>> = {
  en: {
    yourLocation: "Your location",
    useGps: "Use my location",
    locating: "Finding you…",
    denied: "Location blocked — pick your harbour below",
    unavailable: "Location unavailable — pick your harbour below",
    pickPort: "Or choose your harbour",
    tapMap: "You can also tap anywhere on the map",
    gps: "GPS",
    search: "Search harbour",
  },
  hi: {
    yourLocation: "आपका स्थान",
    useGps: "मेरा स्थान लें",
    locating: "आपको खोज रहे हैं…",
    denied: "स्थान बंद है — नीचे अपना बंदरगाह चुनें",
    unavailable: "स्थान उपलब्ध नहीं — नीचे अपना बंदरगाह चुनें",
    pickPort: "या अपना बंदरगाह चुनें",
    tapMap: "आप नक्शे पर कहीं भी टैप कर सकते हैं",
    gps: "जीपीएस",
    search: "बंदरगाह खोजें",
  },
  mr: {
    yourLocation: "तुमचे ठिकाण",
    useGps: "माझे ठिकाण घ्या",
    locating: "तुम्हाला शोधत आहे…",
    denied: "ठिकाण बंद आहे — खाली तुमचे बंदर निवडा",
    unavailable: "ठिकाण उपलब्ध नाही — खाली तुमचे बंदर निवडा",
    pickPort: "किंवा तुमचे बंदर निवडा",
    tapMap: "तुम्ही नकाशावर कुठेही टॅप करू शकता",
    gps: "जीपीएस",
    search: "बंदर शोधा",
  },
};

export default function LocationPicker({
  current,
  language = "en",
  onPick,
}: {
  current: PickedLocation | null;
  language?: Language;
  onPick: (loc: PickedLocation) => void;
}) {
  const t = T[language] ?? T.en;
  const [status, setStatus] = useState<"idle" | "locating" | "denied" | "error">("idle");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const useGps = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus("idle");
        onPick({
          latitude: +pos.coords.latitude.toFixed(4),
          longitude: +pos.coords.longitude.toFixed(4),
          label: t.yourLocation,
          source: "gps",
        });
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    );
  };

  const matches = query
    ? PORTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.state.toLowerCase().includes(query.toLowerCase()),
      )
    : PORTS;

  return (
    <div ref={boxRef} className="card relative z-[600] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="label">{t.yourLocation}</div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="truncate text-[15px] font-bold text-white">
              {current?.label ?? "—"}
            </span>
            {current?.source === "gps" && (
              <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-200">
                {t.gps}
              </span>
            )}
            {current && (
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-ocean-300/70">
                {current.latitude.toFixed(3)}, {current.longitude.toFixed(3)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={useGps}
          disabled={status === "locating"}
          className="shrink-0 rounded-full bg-ocean-700 px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-ocean-600 disabled:opacity-55"
        >
          {status === "locating" ? `◌ ${t.locating}` : `◎ ${t.useGps}`}
        </button>

        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[12px] font-semibold text-ocean-100 transition hover:bg-white/10"
        >
          {t.pickPort} ▾
        </button>
      </div>

      {(status === "denied" || status === "error") && (
        <p className="mt-2 text-[11.5px] text-amber-200/90">
          {status === "denied" ? t.denied : t.unavailable}
        </p>
      )}
      <p className="mt-1.5 text-[10.5px] text-ocean-300/60">{t.tapMap}</p>

      {open && (
        <div className="absolute left-3 right-3 top-full z-[700] mt-2 overflow-hidden rounded-2xl border border-white/12 bg-ocean-950/97 shadow-2xl backdrop-blur-xl">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full border-b border-white/10 bg-transparent px-4 py-3 text-[13px] text-ocean-100 outline-none placeholder:text-ocean-300/50"
          />
          <div className="max-h-64 overflow-y-auto py-1">
            {matches.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  onPick({
                    latitude: p.lat,
                    longitude: p.lon,
                    label: p.name,
                    source: "port",
                  });
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-baseline gap-2 px-4 py-2.5 text-left transition hover:bg-white/[0.07]"
              >
                <span className="text-[13px] font-semibold text-ocean-100">{p.name}</span>
                <span className="text-[11px] text-ocean-300/70">{p.state}</span>
              </button>
            ))}
            {!matches.length && (
              <div className="px-4 py-3 text-[12px] text-ocean-300/70">—</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
