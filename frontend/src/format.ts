/**
 * One format for every quantity (taste audit T5 + X5).
 *
 * The same reading was set four ways across the sheets: waves as 1.24, 1.2,
 * 0.94 and "5.50 m"; wind as 19, 18.7 and "91.2 km/h"; durations as
 * "3.5 hours", "137 min" and "2 h 24 min". Every view formats through this
 * file instead: waves one decimal, wind and distance whole numbers, durations
 * as hours and minutes, temperatures with the degree sign. Raw precision
 * belongs to the evidence ledger only.
 *
 * Everything here is language-neutral (unit symbols, Latin digits); the words
 * around a figure stay in `src/i18n/`.
 */

/** One decimal, as a bare number for cells that style their own unit. */
export function dec1(v: number): string {
  return v.toFixed(1);
}

/** A whole number, for cells that style their own unit. */
export function int(v: number): string {
  return String(Math.round(v));
}

/** Wave height: one decimal always — "1.2 m", "5.5 m". */
export function waveM(v: number): string {
  return `${dec1(v)} m`;
}

/** Wind speed: whole km/h — "19 km/h". */
export function windKmh(v: number): string {
  return `${int(v)} km/h`;
}

/** Distance: whole km — "47 km". */
export function distanceKm(v: number): string {
  return `${int(v)} km`;
}

/** Temperature: one decimal with the degree sign — "28.3 °C". */
export function tempC(v: number): string {
  return `${dec1(v)} °C`;
}

/** A duration given in minutes: "2 h 17 min", "48 min", "2 h". */
export function minutesMin(minutes: number): string {
  const whole = Math.round(minutes);
  const h = Math.floor(whole / 60);
  const m = whole % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** A duration given in hours: "3 h 30 min", never "3.5 hours". */
export function hoursMin(hours: number): string {
  return minutesMin(hours * 60);
}

/** Typewriter units the backend sends, mapped to the printed ones. */
const UNIT: Record<string, string> = {
  "deg C": "°C",
  "mg/m3": "mg/m³",
};

/**
 * A reading with its unit, for instrument readouts fed straight from the
 * API ("28.3 deg C" → "28.3 °C"); an absent value is an em dash.
 */
export function measurement(
  value: number | string | null | undefined,
  unit?: string | null,
): string {
  if (value == null) return "—";
  const u = unit ? (UNIT[unit] ?? unit) : "";
  return u ? `${value} ${u}` : String(value);
}
