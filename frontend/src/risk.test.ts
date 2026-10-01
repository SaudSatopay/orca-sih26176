import { describe, expect, it } from "vitest";
import { RISK_BANDS, RISK_COLOR, riskBand, riskColor } from "./risk";

describe("risk bands", () => {
  it.each([
    [0, "LOW"],
    [9, "LOW"], // Goa, the rehearsed safe scenario
    [25, "LOW"],
    [26, "MODERATE"],
    [50, "MODERATE"],
    [51, "HIGH"],
    [70, "HIGH"], // Mumbai 06:00, the fishermen-warning floor
    [79, "HIGH"],
    [80, "EXTREME"],
    [92, "EXTREME"], // Paradip, the severe-warning floor
    [100, "EXTREME"],
  ] as const)("%i is %s", (score, band) => {
    expect(riskBand(score)).toBe(band);
    expect(riskColor(score)).toBe(RISK_COLOR[band]);
  });

  it("rounds before banding, as the backend does", () => {
    expect(riskBand(25.4)).toBe("LOW");
    expect(riskBand(25.5)).toBe("MODERATE");
    expect(riskBand(79.4)).toBe("HIGH");
  });

  it("covers 0 to 100 without a gap, in rising order", () => {
    expect(RISK_BANDS.map((b) => b.category)).toEqual(["LOW", "MODERATE", "HIGH", "EXTREME"]);
    expect(RISK_BANDS[0].from).toBe(0);
    expect(RISK_BANDS[RISK_BANDS.length - 1].max).toBe(100);
    RISK_BANDS.slice(1).forEach((b, i) => expect(b.from).toBe(RISK_BANDS[i].max));
  });

  it("gives every band its own colour", () => {
    expect(new Set(Object.values(RISK_COLOR)).size).toBe(4);
  });
});
