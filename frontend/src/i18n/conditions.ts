import type { Language } from "../types";

export const L: Record<Language, Record<string, string>> = {
  en: { wave: "Wave", wind: "Wind", sea: "Sea state", vis: "Visibility", sst: "Sea temp", rain: "Rain" },
  hi: { wave: "लहरें", wind: "हवा", sea: "समुद्र", vis: "दृश्यता", sst: "तापमान", rain: "वर्षा" },
  mr: { wave: "लाटा", wind: "वारा", sea: "समुद्र", vis: "दृश्यमानता", sst: "तापमान", rain: "पाऊस" },
};
