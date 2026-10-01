/**
 * The chart reads at every scale (taste T4/PM1/PM3, impeccable C4',
 * guidelines W5): buoy hierarchy, the severe day's quiet rings, a key built
 * from what is drawn, and a boat that answers the arrow keys. Leaflet is
 * mocked; what is pinned is what the component asks Leaflet to draw and what
 * the key beside it says.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RATING_WORD } from "../i18n/fishing";
import { LEGEND } from "../i18n/marineMap";
import type { FishingArea } from "../types";

const seen = vi.hoisted(() => ({
  icons: [] as string[],
  iconSizes: [] as [number, number][],
  markers: [] as { opts: Record<string, unknown>; el: HTMLElement; setLatLng: ReturnType<typeof vi.fn> }[],
}));

vi.mock("leaflet", () => {
  const layer = () => ({
    addTo: vi.fn().mockReturnThis(),
    addLayer: vi.fn().mockReturnThis(),
    removeLayer: vi.fn(),
    hasLayer: vi.fn(() => false),
    clearLayers: vi.fn(),
    remove: vi.fn(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    bindTooltip: vi.fn().mockReturnThis(),
    openPopup: vi.fn().mockReturnThis(),
    getElement: vi.fn(() => null),
    setStyle: vi.fn().mockReturnThis(),
  });
  const marker = (_: unknown, opts: Record<string, unknown> = {}) => {
    const el = document.createElement("div");
    const self = {
      ...layer(),
      setLatLng: vi.fn().mockReturnThis(),
      getLatLng: vi.fn(() => ({ lat: 19, lng: 72.8 })),
      getElement: vi.fn(() => el),
    };
    seen.markers.push({ opts, el, setLatLng: self.setLatLng });
    return self;
  };
  const map = {
    setView: vi.fn().mockReturnThis(),
    fitBounds: vi.fn(),
    flyTo: vi.fn(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    stop: vi.fn(),
    invalidateSize: vi.fn(),
    getZoom: vi.fn(() => 9),
    getBounds: vi.fn(() => ({
      getNorthEast: () => ({ lat: 20, lng: 73.5 }),
      getSouthWest: () => ({ lat: 18, lng: 71.5 }),
    })),
    getPanes: vi.fn(() => ({})),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    closePopup: vi.fn(),
    latLngToContainerPoint: vi.fn(() => ({ x: 0, y: 0 })),
    getContainer: vi.fn(() => document.createElement("div")),
    getSize: vi.fn(() => ({ x: 600, y: 400 })),
  };
  const L = {
    map: vi.fn(() => map),
    tileLayer: vi.fn(() => layer()),
    layerGroup: vi.fn(() => layer()),
    marker: vi.fn(marker),
    circle: vi.fn(() => layer()),
    polygon: vi.fn(() => layer()),
    polyline: vi.fn(() => layer()),
    divIcon: vi.fn((spec: { html?: string; iconSize?: [number, number] }) => {
      seen.icons.push(spec.html ?? "");
      if (spec.iconSize) seen.iconSizes.push(spec.iconSize);
      return {};
    }),
    popup: vi.fn(() => ({
      setLatLng: vi.fn().mockReturnThis(),
      setContent: vi.fn().mockReturnThis(),
      openOn: vi.fn(),
    })),
    control: Object.assign(vi.fn(() => ({ addTo: vi.fn() })), {
      zoom: vi.fn(() => ({ addTo: vi.fn() })),
    }),
    latLngBounds: vi.fn(() => ({ pad: vi.fn().mockReturnThis() })),
  };
  return { default: L, ...L };
});

vi.mock("./FlowLayer", () => {
  class FlowStub {
    setMode() {}
    destroy() {}
  }
  return { default: FlowStub, FlowLayer: FlowStub };
});

const checkPosition = vi.hoisted(() => vi.fn(async () => ({ status: "clear" as const, headline: "Clear water" })));
vi.mock("../api", () => ({ checkPosition }));

import MarineMap from "./MarineMap";

const origin = { name: "Mumbai", latitude: 19, longitude: 72.8, state: null };

const area = (rank: number, over: Partial<FishingArea> = {}): FishingArea => ({
  id: `a${rank}`,
  rank,
  latitude: 18.2 + rank * 0.3,
  longitude: 71.8,
  distance_km: 30 + rank,
  bearing: "WSW",
  sst_c: 29,
  chlorophyll_mg_m3: 1.2,
  wave_height_m: 1,
  probability: 80 - rank,
  value_score: 60,
  rating: rank <= 2 ? "very_good" : "good",
  confidence: 0.8,
  rationale: "",
  factors: {},
  ...over,
});

const base = {
  origin,
  zones: [],
  pfz: [],
  routes: [],
  geofence: [],
  language: "en" as const,
};

const buoyIcons = () => seen.icons.filter((h) => h.includes("buoy"));

beforeEach(() => {
  seen.icons.length = 0;
  seen.iconSizes.length = 0;
  seen.markers.length = 0;
  checkPosition.mockClear();
});

describe("the chart reads at every scale", () => {
  it("draws ranks above 3 at 28 px with the number only", async () => {
    render(<MarineMap {...base} areas={[area(1), area(2), area(3), area(4), area(5)]} />);
    await new Promise((r) => setTimeout(r, 30));
    const small = seen.iconSizes.filter(([w]) => w === 28);
    expect(small.length).toBe(2); // ranks 4 and 5
    const withPercent = buoyIcons().filter((h) => h.includes("%</span>"));
    expect(withPercent.length).toBe(3); // only ranks 1..3 keep the sounding
  });

  it("on a severe day draws quiet rings: no percentage, no bob", async () => {
    render(<MarineMap {...base} severe areas={[area(1), area(2)]} />);
    await new Promise((r) => setTimeout(r, 30));
    const buoys = buoyIcons();
    expect(buoys.length).toBeGreaterThan(0);
    for (const h of buoys.filter((x) => !x.includes("roll"))) {
      expect(h).not.toContain("%</span>");
      expect(h).not.toContain("bob");
    }
    // and the key says so
    expect(screen.getByText(LEGEND.en.severeDay)).toBeTruthy();
  });

  it("builds the key from what is drawn, not a fixed list", async () => {
    render(<MarineMap {...base} areas={[area(1), area(3)]} radiusKm={100} />);
    await new Promise((r) => setTimeout(r, 30));
    // ratings present on the chart
    expect(screen.getByText(RATING_WORD.en.very_good)).toBeTruthy();
    expect(screen.getByText(RATING_WORD.en.good)).toBeTruthy();
    // marks not drawn are not named
    expect(screen.queryByText(RATING_WORD.en.poor)).toBeNull();
    expect(screen.queryByText(LEGEND.en.some)).toBeNull();
    expect(screen.queryByText(LEGEND.en.noEntry)).toBeNull();
    expect(screen.queryByText(LEGEND.en.course)).toBeNull();
    expect(screen.queryByText(LEGEND.en.storm)).toBeNull();
    // the search radius is drawn, so it is named
    expect(screen.getByText(LEGEND.en.radius)).toBeTruthy();
  });

  it("moves the boat with the arrow keys and runs the same position check", async () => {
    render(<MarineMap {...base} />);
    await new Promise((r) => setTimeout(r, 30));
    const boat = seen.markers.find((m) => m.opts.draggable === true);
    expect(boat).toBeTruthy();
    expect(boat!.el.getAttribute("role")).toBe("button");
    expect(boat!.el.getAttribute("aria-label")).toContain("Mumbai");
    boat!.el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    await new Promise((r) => setTimeout(r, 30));
    expect(boat!.setLatLng).toHaveBeenCalled();
    expect(checkPosition).toHaveBeenCalled();
  });
});
