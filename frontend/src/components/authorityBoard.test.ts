import { describe, expect, it } from "vitest";
import type { AuthorityRow, RiskCategory } from "../types";
import {
  DEFAULT_SORT,
  ariaSort,
  bandCounts,
  boardChanges,
  coastOrder,
  nextSort,
  sortRows,
} from "./authorityBoard";

function row(
  name: string,
  risk_score: number,
  lat: number,
  lon: number,
  over: Partial<AuthorityRow> = {},
): AuthorityRow {
  const risk_category: RiskCategory =
    risk_score > 79 ? "EXTREME" : risk_score > 50 ? "HIGH" : risk_score > 25 ? "MODERATE" : "LOW";
  return {
    name,
    state: "",
    latitude: lat,
    longitude: lon,
    risk_score,
    risk_category,
    official_warning: false,
    wave_height_m: risk_score / 20,
    wind_speed_kmh: risk_score,
    headline: null,
    ...over,
  };
}

const COAST = [
  row("Paradip", 92, 20.26, 86.69),
  row("Digha", 80, 21.63, 87.51),
  row("Kochi", 35, 9.93, 76.27),
  row("Mumbai", 27, 18.92, 72.83),
  row("Veraval", 27, 20.91, 70.37),
  row("Chennai", 27, 13.08, 80.27),
  row("Ratnagiri", 22, 16.99, 73.31),
  row("Panaji (Goa)", 14, 15.49, 73.83),
  row("Visakhapatnam", 14, 17.69, 83.22),
  row("Port Blair", 14, 11.62, 92.73),
];

const names = (rows: AuthorityRow[]) => rows.map((r) => r.name);

describe("sortRows", () => {
  it("opens worst-first, ties broken by name", () => {
    expect(names(sortRows(COAST, DEFAULT_SORT))).toEqual([
      "Paradip",
      "Digha",
      "Kochi",
      "Chennai",
      "Mumbai",
      "Veraval",
      "Ratnagiri",
      "Panaji (Goa)",
      "Port Blair",
      "Visakhapatnam",
    ]);
  });

  it("orders by name both ways", () => {
    const up = names(sortRows(COAST, { key: "name", dir: "ascending" }));
    expect(up[0]).toBe("Chennai");
    expect(up[up.length - 1]).toBe("Visakhapatnam");
    expect(names(sortRows(COAST, { key: "name", dir: "descending" }))).toEqual([...up].reverse());
  });

  it("orders by wave and by wind", () => {
    expect(names(sortRows(COAST, { key: "wave", dir: "descending" }))[0]).toBe("Paradip");
    expect(names(sortRows(COAST, { key: "wind", dir: "ascending" }))[0]).toBe("Panaji (Goa)");
  });

  it("puts a missing reading last in either direction", () => {
    const rows = [
      row("Known calm", 10, 0, 0, { wave_height_m: 0.4 }),
      row("Unknown", 10, 0, 0, { wave_height_m: null }),
      row("Known rough", 10, 0, 0, { wave_height_m: 3 }),
    ];
    expect(names(sortRows(rows, { key: "wave", dir: "ascending" }))).toEqual([
      "Known calm",
      "Known rough",
      "Unknown",
    ]);
    expect(names(sortRows(rows, { key: "wave", dir: "descending" }))).toEqual([
      "Known rough",
      "Known calm",
      "Unknown",
    ]);
  });

  it("does not reorder the array it was given", () => {
    const before = names(COAST);
    sortRows(COAST, { key: "name", dir: "ascending" });
    expect(names(COAST)).toEqual(before);
  });
});

describe("nextSort and ariaSort", () => {
  it("turns the active column over", () => {
    expect(nextSort(DEFAULT_SORT, "risk")).toEqual({ key: "risk", dir: "ascending" });
    expect(nextSort({ key: "risk", dir: "ascending" }, "risk")).toEqual(DEFAULT_SORT);
  });
  it("starts a new column in its natural direction", () => {
    expect(nextSort(DEFAULT_SORT, "name")).toEqual({ key: "name", dir: "ascending" });
    expect(nextSort(DEFAULT_SORT, "wave")).toEqual({ key: "wave", dir: "descending" });
    expect(nextSort({ key: "name", dir: "ascending" }, "wind")).toEqual({ key: "wind", dir: "descending" });
  });
  it("reports aria-sort for the active column only", () => {
    expect(ariaSort(DEFAULT_SORT, "risk")).toBe("descending");
    expect(ariaSort(DEFAULT_SORT, "name")).toBe("none");
  });
});

describe("coastOrder", () => {
  it("walks the west coast south, the east coast north, then the islands", () => {
    const groups = coastOrder(COAST);
    expect(groups.map((g) => g.stretch)).toEqual(["west", "east", "islands"]);
    expect(names(groups[0].rows)).toEqual(["Veraval", "Mumbai", "Ratnagiri", "Panaji (Goa)", "Kochi"]);
    expect(names(groups[1].rows)).toEqual(["Chennai", "Visakhapatnam", "Paradip", "Digha"]);
    expect(names(groups[2].rows)).toEqual(["Port Blair"]);
  });
  it("leaves out a stretch with no centre", () => {
    expect(coastOrder(COAST.slice(2, 5)).map((g) => g.stretch)).toEqual(["west"]);
    expect(coastOrder([])).toEqual([]);
  });
});

describe("boardChanges", () => {
  it("reports nothing when no score moved", () => {
    expect(boardChanges(COAST, COAST)).toEqual([]);
  });
  it("lists the centres that moved, largest move first", () => {
    const after = COAST.map((r) =>
      r.name === "Mumbai" ? { ...r, risk_score: 31 } : r.name === "Digha" ? { ...r, risk_score: 68 } : r,
    );
    expect(boardChanges(COAST, after)).toEqual([
      { name: "Digha", from: 80, to: 68 },
      { name: "Mumbai", from: 27, to: 31 },
    ]);
  });
  it("ignores centres that appear or vanish", () => {
    expect(boardChanges(COAST.slice(0, 3), COAST)).toEqual([]);
  });
});

describe("bandCounts", () => {
  it("counts the centres in each band", () => {
    expect(bandCounts(COAST)).toEqual({ EXTREME: 2, HIGH: 0, MODERATE: 4, LOW: 4 });
  });
});
