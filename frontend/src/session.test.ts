import { describe, expect, it } from "vitest";
import { deviceSession } from "./session";

function memoryStore() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

describe("one chat session per device", () => {
  it("never shares a session between two devices", () => {
    expect(deviceSession("phone", memoryStore())).not.toBe(deviceSession("phone", memoryStore()));
  });

  it("keeps the same session on one device across visits", () => {
    const store = memoryStore();
    expect(deviceSession("phone", store)).toBe(deviceSession("phone", store));
  });

  it("keeps the two apps apart on one device", () => {
    const store = memoryStore();
    expect(deviceSession("phone", store)).not.toBe(deviceSession("console", store));
  });

  it("still gives a private id when storage is blocked", () => {
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    const a = deviceSession("phone", blocked);
    expect(a).toMatch(/^phone-/);
    expect(deviceSession("phone", blocked)).not.toBe(a);
    expect(deviceSession("phone", null)).toMatch(/^phone-/);
  });
});
