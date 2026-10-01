import { describe, expect, it } from "vitest";
import {
  dec1,
  distanceKm,
  hoursMin,
  int,
  measurement,
  minutesMin,
  tempC,
  waveM,
  windKmh,
} from "./format";

/**
 * One format for every quantity (taste audit T5 + X5). Waves carry one
 * decimal, wind and distance are whole numbers, durations read "2 h 17 min"
 * (never "137 min" or "3.5 hours"), temperatures carry °C.
 */
describe("the one format for every quantity", () => {
  it("writes waves with one decimal", () => {
    expect(waveM(1.24)).toBe("1.2 m");
    expect(waveM(5.5)).toBe("5.5 m");
    expect(waveM(1)).toBe("1.0 m");
  });

  it("writes wind and distance as whole numbers", () => {
    expect(windKmh(18.7)).toBe("19 km/h");
    expect(windKmh(91.2)).toBe("91 km/h");
    expect(distanceKm(46.5)).toBe("47 km");
    expect(distanceKm(31.0)).toBe("31 km");
  });

  it("writes temperatures with the degree sign", () => {
    expect(tempC(28.3)).toBe("28.3 °C");
    expect(tempC(29)).toBe("29.0 °C");
  });

  it("writes durations as hours and minutes, never bare minutes or decimals", () => {
    expect(hoursMin(3.5)).toBe("3 h 30 min");
    expect(hoursMin(2.283)).toBe("2 h 17 min");
    expect(hoursMin(8)).toBe("8 h");
    expect(hoursMin(0.75)).toBe("45 min");
    expect(minutesMin(137)).toBe("2 h 17 min");
    expect(minutesMin(48)).toBe("48 min");
    expect(minutesMin(120)).toBe("2 h");
  });

  it("keeps the number primitives for cells that style their own unit", () => {
    expect(dec1(1.27)).toBe("1.3");
    expect(int(46.5)).toBe("47");
  });

  it("prints a reading with its unit and maps typewriter units to the printed ones", () => {
    expect(measurement(28.3, "deg C")).toBe("28.3 °C");
    expect(measurement(1.2, "mg/m3")).toBe("1.2 mg/m³");
    expect(measurement(1.5, "m")).toBe("1.5 m");
    expect(measurement(null, "m")).toBe("—");
    expect(measurement(undefined, undefined)).toBe("—");
    expect(measurement(0, "m")).toBe("0 m");
  });
});
