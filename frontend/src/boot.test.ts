import { describe, expect, it, vi } from "vitest";
import {
  initialLanguage,
  isPhoneLayout,
  PHONE_QUERY,
  readBootParams,
  ROOT_LOADERS,
  rootKind,
} from "./boot";

describe("lazy boot selection", () => {
  it("names the app a visit gets by the same rule as isPhoneLayout", () => {
    expect(rootKind("", () => true)).toBe("phone");
    expect(rootKind("", () => false)).toBe("console");
    expect(rootKind("?m=1", () => false)).toBe("phone");
    expect(rootKind("?m=0", () => true)).toBe("console");
  });

  it("has one loader per app, and they are different chunks", () => {
    expect(Object.keys(ROOT_LOADERS).sort()).toEqual(["console", "phone"]);
    expect(ROOT_LOADERS.phone).not.toBe(ROOT_LOADERS.console);
  });

  it("loads each app with a dynamic import, so neither is in the entry chunk", async () => {
    const boot = (await import("./boot.ts?raw")).default as string;
    expect(boot).toMatch(/phone: \(\) => import\("\.\/components\/MobileApp"\)/);
    expect(boot).toMatch(/console: \(\) => import\("\.\/App"\)/);
    expect(boot).not.toMatch(/^import (?!type).*(MobileApp|\.\/App)["']/m);
  });

  it("main.tsx imports neither app statically", async () => {
    const main = (await import("./main.tsx?raw")).default as string;
    expect(main).not.toMatch(/^import .*["']\.\/App["']/m);
    expect(main).not.toMatch(/^import .*MobileApp/m);
    expect(main).toMatch(/ROOT_LOADERS\[kind\]\(\)/);
  });
});

describe("the language a visit opens in", () => {
  it("?lang= wins over the phone's own languages", () => {
    expect(initialLanguage("?lang=mr", ["hi-IN", "en"])).toBe("mr");
  });

  it("otherwise takes the first language ORCA speaks", () => {
    expect(initialLanguage("", ["hi-IN", "en-IN"])).toBe("hi");
    expect(initialLanguage("", ["ta-IN", "mr-IN", "en"])).toBe("mr");
    expect(initialLanguage("", ["en-GB", "hi"])).toBe("en");
  });

  it("falls back to English", () => {
    expect(initialLanguage("", ["ta-IN", "fr"])).toBe("en");
    expect(initialLanguage("")).toBe("en");
    expect(initialLanguage("?lang=fr", [])).toBe("en");
  });
});

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
