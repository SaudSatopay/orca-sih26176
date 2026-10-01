import { afterEach, describe, expect, it, vi } from "vitest";
import { locationAlreadyAllowed } from "./locate";

function setNavigator(geolocation: boolean, state?: PermissionState | "throws") {
  const nav: Record<string, unknown> = {};
  if (geolocation) nav.geolocation = { getCurrentPosition: vi.fn() };
  if (state === "throws") nav.permissions = { query: () => Promise.reject(new Error("no")) };
  else if (state) nav.permissions = { query: () => Promise.resolve({ state }) };
  vi.stubGlobal("navigator", nav);
}

afterEach(() => vi.unstubAllGlobals());

describe("reading the position without asking", () => {
  it("is allowed only when the browser already says granted", async () => {
    setNavigator(true, "granted");
    expect(await locationAlreadyAllowed()).toBe(true);
  });

  it("is not allowed while the answer would be a prompt, or was a refusal", async () => {
    setNavigator(true, "prompt");
    expect(await locationAlreadyAllowed()).toBe(false);
    setNavigator(true, "denied");
    expect(await locationAlreadyAllowed()).toBe(false);
  });

  it("is not allowed when the browser cannot say", async () => {
    setNavigator(true);
    expect(await locationAlreadyAllowed()).toBe(false);
    setNavigator(true, "throws");
    expect(await locationAlreadyAllowed()).toBe(false);
    setNavigator(false, "granted");
    expect(await locationAlreadyAllowed()).toBe(false);
  });
});
