import type { Language } from "../types";

/**
 * A fishing-ground row's swipe drawer on the phone: the two actions, the
 * row's name, and the keyboard's way in. Its own module so that it travels
 * with SwipeRow's lazy chunk (MobileApp.tsx loads both on the first touch of
 * a row) and the phone's first load carries none of it.
 */
export const SWIPE: Record<
  Language,
  { showOnMap: string; hearIt: string; row: string; more: string; opened: string }
> = {
  en: {
    showOnMap: "Show on map",
    hearIt: "Hear it",
    row: "Area {n}",
    more: "More for area {n}",
    opened: "Show on map, or hear it",
  },
  hi: {
    showOnMap: "नक्शे पर देखें",
    hearIt: "सुनें",
    row: "क्षेत्र {n}",
    more: "क्षेत्र {n} के लिए और",
    opened: "नक्शे पर देखें, या सुनें",
  },
  mr: {
    showOnMap: "नकाशावर पाहा",
    hearIt: "ऐका",
    row: "क्षेत्र {n}",
    more: "क्षेत्र {n} साठी आणखी",
    opened: "नकाशावर पाहा, किंवा ऐका",
  },
};
