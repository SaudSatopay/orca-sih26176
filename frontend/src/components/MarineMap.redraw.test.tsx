/**
 * R1: the chart must not redraw on a render that changed nothing it shows.
 * Leaflet is mocked; what is pinned is that equal props produce exactly one
 * build of the layers (clearLayers counts the rebuilds).
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const counters = vi.hoisted(() => ({ cleared: 0 }));

vi.mock("leaflet", () => {
  const layer = () => ({
    addTo: vi.fn().mockReturnThis(),
    addLayer: vi.fn().mockReturnThis(),
    clearLayers: vi.fn(() => {
      counters.cleared += 1;
    }),
    removeLayer: vi.fn(),
    remove: vi.fn(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    bindPopup: vi.fn().mockReturnThis(),
    bindTooltip: vi.fn().mockReturnThis(),
    openPopup: vi.fn().mockReturnThis(),
    setLatLng: vi.fn().mockReturnThis(),
    getLatLng: vi.fn(() => ({ lat: 19, lng: 72 })),
    getElement: vi.fn(() => null),
    setStyle: vi.fn().mockReturnThis(),
    getBounds: vi.fn(() => ({ isValid: () => false, extend: vi.fn() })),
  });
  const map = {
    setView: vi.fn().mockReturnThis(),
    fitBounds: vi.fn(),
    flyTo: vi.fn(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    invalidateSize: vi.fn(),
    getZoom: vi.fn(() => 9),
    getCenter: vi.fn(() => ({ lat: 19, lng: 72 })),
    getBounds: vi.fn(() => ({ contains: () => true, getNorthEast: () => ({ lat: 20, lng: 73 }), getSouthWest: () => ({ lat: 18, lng: 71 }) })),
    getPanes: vi.fn(() => ({})),
    getPane: vi.fn(() => document.createElement("div")),
    createPane: vi.fn(() => document.createElement("div")),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    closePopup: vi.fn(),
    attributionControl: { setPrefix: vi.fn() },
    stop: vi.fn(),
    panTo: vi.fn(),
    once: vi.fn().mockReturnThis(),
    whenReady: vi.fn((fn: () => void) => fn()),
    latLngToContainerPoint: vi.fn(() => ({ x: 0, y: 0 })),
    containerPointToLatLng: vi.fn(() => ({ lat: 19, lng: 72 })),
    getContainer: vi.fn(() => document.createElement("div")),
    getSize: vi.fn(() => ({ x: 600, y: 400 })),
    distance: vi.fn(() => 1000),
  };
  const L = {
    map: vi.fn(() => map),
    tileLayer: vi.fn(() => layer()),
    layerGroup: vi.fn(() => layer()),
    featureGroup: vi.fn(() => layer()),
    marker: vi.fn(() => layer()),
    circle: vi.fn(() => layer()),
    circleMarker: vi.fn(() => layer()),
    polygon: vi.fn(() => layer()),
    polyline: vi.fn(() => layer()),
    divIcon: vi.fn(() => ({})),
    popup: vi.fn(() => ({ setLatLng: vi.fn().mockReturnThis(), setContent: vi.fn().mockReturnThis(), openOn: vi.fn() })),
    control: Object.assign(vi.fn(() => ({ onAdd: vi.fn(), addTo: vi.fn() })), {
      attribution: vi.fn(() => ({ addTo: vi.fn() })),
      zoom: vi.fn(() => ({ addTo: vi.fn() })),
      scale: vi.fn(() => ({ addTo: vi.fn() })),
    }),
    latLngBounds: vi.fn(() => ({ isValid: () => false, extend: vi.fn(), pad: vi.fn().mockReturnThis() })),
    svg: vi.fn(() => ({})),
    DomEvent: { disableClickPropagation: vi.fn(), disableScrollPropagation: vi.fn() },
  };
  return { default: L, ...L };
});

vi.mock("./FlowLayer", () => {
  class FlowStub {
    setMode() {}
    setField() {}
    destroy() {}
  }
  return { default: FlowStub, FlowLayer: FlowStub };
});

import MarineMap from "./MarineMap";

describe("the chart holds still", () => {
  it("does not rebuild its layers when a re-render changes nothing it shows", async () => {
    const origin = { name: "Mumbai", latitude: 19, longitude: 72.8, state: null };
    const props = {
      origin,
      zones: [],
      pfz: [],
      routes: [],
      geofence: [],
      language: "en" as const,
    };
    const { rerender } = render(<MarineMap {...props} />);
    await new Promise((r) => setTimeout(r, 50));
    const after = counters.cleared;
    rerender(<MarineMap {...props} />);
    rerender(<MarineMap {...props} />);
    await new Promise((r) => setTimeout(r, 50));
    expect(counters.cleared).toBe(after);
  });
});
