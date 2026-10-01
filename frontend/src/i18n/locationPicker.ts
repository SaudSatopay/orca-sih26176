import type { Language } from "../types";

export const T: Record<Language, Record<string, string>> = {
  en: {
    yourLocation: "Your location",
    useGps: "Use my location",
    locating: "Finding you…",
    denied: "Location blocked — pick your harbour below",
    unavailable: "Location unavailable — pick your harbour below",
    pickPort: "Choose harbour",
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
    pickPort: "बंदरगाह चुनें",
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
    pickPort: "बंदर निवडा",
    tapMap: "तुम्ही नकाशावर कुठेही टॅप करू शकता",
    gps: "जीपीएस",
    search: "बंदर शोधा",
  },
};
