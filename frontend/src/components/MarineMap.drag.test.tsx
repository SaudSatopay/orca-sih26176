/**
 * Moving the boat re-centres the outlook the way a tap on the water does
 * (owner report: "when the boat is dragged the fishing zones don't appear
 * on the boat"). A drop runs the geofence probe first; on water it then
 * hands the new position to `onPickLocation`, on land it keeps the probe's
 * message and stays put. Views without `onPickLocation` (the Ask chart) only
 * probe. Arrow keys probe on every press and re-centre once they settle.
 * Leaflet is mocked; the boat's own event handlers are captured and fired.
 */
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PositionCheck } from "../types";

type Handler = () => void;

const seen = vi.hoisted(() => ({
  boats: [] as {
    el: HTMLElement;
    handlers: Record<string, () => void>;
    pos: { lat: number; lng: number };
  }[],
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
  const marker = (at: [number, number], opts: Record<string, unknown> = {}) => {
    const el = document.createElement("div");
    const pos = { lat: at[0], lng: at[1] };
    const handlers: Record<string, () => void> = {};
    const self = {
      ...layer(),
      on: vi.fn((ev: string, fn: () => void) => {
        handlers[ev] = fn;
        return self;
      }),
      setLatLng: vi.fn((p: [number, number]) => {
        pos.lat = p[0];
        pos.lng = p[1];
        return self;
      }),
      getLatLng: vi.fn(() => ({ ...pos })),
      getElement: vi.fn(() => el),
    };
    if (opts.draggable === true) seen.boats.push({ el, handlers, pos });
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
    divIcon: vi.fn(() => ({})),
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

const check = (over: Partial<PositionCheck> = {}): PositionCheck => ({
  latitude: 0,
  longitude: 0,
  status: "clear",
  headline: "Clear water",
  distance_from_shore_km: 20,
  nearest_landing_centre: "Mumbai",
  nearest_zone_km: null,
  nearest_zone_name: null,
  inside_restricted_zone: false,
  geofence_alerts: [],
  official_warning_active: false,
  checked_at: "2026-10-01T14:00:00",
  on_land: false,
  ...over,
});

const checkPosition = vi.hoisted(() =>
  vi.fn<(lat: number, lon: number, lang?: string) => Promise<PositionCheck>>(),
);
vi.mock("../api", () => ({ checkPosition }));

import MarineMap from "./MarineMap";

const origin = { name: "Mumbai", latitude: 19, longitude: 72.8, state: null };
const base = {
  origin,
  zones: [],
  pfz: [],
  routes: [],
  geofence: [],
  language: "en" as const,
};

const flush = () => act(async () => {
  await new Promise((r) => setTimeout(r, 20));
});

/** The boat the latest redraw put on the chart. */
const boat = () => seen.boats[seen.boats.length - 1];

const dropAt = async (lat: number, lng: number) => {
  const b = boat();
  b.pos.lat = lat;
  b.pos.lng = lng;
  await act(async () => {
    (b.handlers.dragstart as Handler | undefined)?.();
    b.handlers.dragend();
  });
  await flush();
};

beforeEach(() => {
  seen.boats.length = 0;
  checkPosition.mockReset();
  checkPosition.mockResolvedValue(check());
});

afterEach(() => {
  vi.useRealTimers();
});

describe("dropping the boat re-centres the outlook", () => {
  it("on water, hands the rounded drop position to onPickLocation after the probe", async () => {
    const pick = vi.fn();
    render(<MarineMap {...base} onPickLocation={pick} />);
    await flush();
    await dropAt(19.12345678, 72.98765432);
    expect(checkPosition).toHaveBeenCalledWith(19.1235, 72.9877, "en");
    expect(pick).toHaveBeenCalledTimes(1);
    expect(pick).toHaveBeenCalledWith(19.1235, 72.9877);
  });

  it("on land, keeps the probe's message and does not re-centre", async () => {
    checkPosition.mockResolvedValue(
      check({ status: "warning", headline: "That position is on land", on_land: true }),
    );
    const pick = vi.fn();
    render(<MarineMap {...base} onPickLocation={pick} />);
    await flush();
    await dropAt(19.3, 73.2);
    expect(checkPosition).toHaveBeenCalled();
    expect(pick).not.toHaveBeenCalled();
    expect(screen.getByText("That position is on land")).toBeTruthy();
  });

  it("without onPickLocation (the Ask chart), only probes", async () => {
    const pick = vi.fn();
    const { rerender } = render(<MarineMap {...base} onPickLocation={pick} />);
    await flush();
    // The same boat, now on a view that does not re-centre.
    rerender(<MarineMap {...base} />);
    await dropAt(18.6, 72.2);
    expect(checkPosition).toHaveBeenCalledTimes(1);
    expect(pick).not.toHaveBeenCalled();
  });

  it("calls the latest onPickLocation, not the one the boat was built with", async () => {
    const first = vi.fn();
    const latest = vi.fn();
    const { rerender } = render(<MarineMap {...base} onPickLocation={first} />);
    await flush();
    rerender(<MarineMap {...base} onPickLocation={latest} />);
    await dropAt(18.6, 72.2);
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledWith(18.6, 72.2);
  });

  it("keeps the geofence banner when the chart re-centres on the drop point", async () => {
    checkPosition.mockResolvedValue(
      check({ status: "critical", headline: "Inside BARC exclusion zone", inside_restricted_zone: true }),
    );
    const pick = vi.fn();
    const { rerender } = render(<MarineMap {...base} onPickLocation={pick} />);
    await flush();
    await dropAt(19.0123, 72.9123);
    expect(pick).toHaveBeenCalledWith(19.0123, 72.9123);
    // The parent moves the origin to the drop point, which redraws the chart.
    rerender(
      <MarineMap
        {...base}
        origin={{ ...origin, latitude: 19.0123, longitude: 72.9123 }}
        onPickLocation={pick}
      />,
    );
    await flush();
    expect(screen.getByText("Inside BARC exclusion zone")).toBeTruthy();
  });

  it("probes on every arrow press and re-centres once the keys settle", async () => {
    vi.useFakeTimers();
    const pick = vi.fn();
    render(<MarineMap {...base} onPickLocation={pick} />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    const b = boat();
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        b.el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        await vi.advanceTimersByTimeAsync(100);
      });
    }
    expect(checkPosition).toHaveBeenCalledTimes(3);
    expect(pick).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });
    expect(pick).toHaveBeenCalledTimes(1);
    expect(pick).toHaveBeenCalledWith(19.06, 72.8);
  });
});
