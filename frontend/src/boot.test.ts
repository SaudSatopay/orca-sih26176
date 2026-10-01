import { describe, expect, it, vi } from "vitest";
import { isPhoneLayout, PHONE_QUERY, readBootParams } from "./boot";

describe("phone versus desktop selection", () => {
  const narrow = () => true;
  const wide = () => false;

  it("?m=1 forces the phone app, even on a wide window", () => {
    expect(isPhoneLayout("?m=1", wide)).toBe(true);
    expect(isPhoneLayout("?lang=mr&m=1", wide)).toBe(true);
  });

  it("?m=0 forces the desktop console, even on a narrow window", () => {
    expect(isPhoneLayout("?m=0", narrow)).toBe(false);
  });

  it("does not consult the media query when ?m decides", () => {
    const probe = vi.fn(() => true);
    isPhoneLayout("?m=0", probe);
    isPhoneLayout("?m=1", probe);
    expect(probe).not.toHaveBeenCalled();
  });

  it("otherwise follows the 640 px media query", () => {
    expect(PHONE_QUERY).toBe("(max-width: 640px)");
    expect(isPhoneLayout("", narrow)).toBe(true);
    expect(isPhoneLayout("", wide)).toBe(false);
    expect(isPhoneLayout("?tab=home", narrow)).toBe(true);
    // any other value of m is not a decision
    expect(isPhoneLayout("?m=yes", wide)).toBe(false);
    expect(isPhoneLayout("?m=yes", narrow)).toBe(true);
  });

  it("hands the real query to matchMedia the way main.tsx does", () => {
    const matchMedia = vi.fn((q: string) => ({ matches: q === PHONE_QUERY }));
    expect(isPhoneLayout("", () => matchMedia(PHONE_QUERY).matches)).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith("(max-width: 640px)");
  });
});

describe("deep links", () => {
  it("reads nothing from a bare URL", () => {
    expect(readBootParams("")).toEqual({ tab: null, at: null, lang: null, demo: null, tour: false });
  });

  it("reads the rehearsed demo links", () => {
    expect(readBootParams("?demo=danger").demo).toBe("danger");
    expect(readBootParams("?tab=home&at=18.95,72.75")).toMatchObject({
      tab: "home",
      at: { latitude: 18.95, longitude: 72.75 },
    });
    expect(readBootParams("?tour=1").tour).toBe(true);
    expect(readBootParams("?lang=mr").lang).toBe("mr");
  });

  it("ignores values it does not know", () => {
    expect(readBootParams("?tab=admin&lang=fr&at=north,east&tour=yes")).toEqual({
      tab: null,
      at: null,
      lang: null,
      demo: null,
      tour: false,
    });
    expect(readBootParams("?at=18.95").at).toBeNull();
  });
});
