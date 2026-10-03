import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SpotlightCard from "./spotlight-card";
import { fakeMedia } from "./media.test-helper";

const original = window.matchMedia;
afterEach(() => {
  window.matchMedia = original;
});

describe("spotlight card", () => {
  it("lights a teal pool under a fine pointer, above the content, out of the pointer's way", () => {
    fakeMedia({ fine: true });
    const { container, getByRole } = render(
      <SpotlightCard>
        <a href="#x">Sheet 1</a>
      </SpotlightCard>,
    );
    const pool = container.querySelector(".spotlight-pool") as HTMLElement;
    expect(pool).toHaveAttribute("aria-hidden", "true");
    expect(pool.className).toContain("pointer-events-none");
    expect(pool.style.opacity).toBe("0");
    const card = container.firstElementChild!;
    fireEvent.pointerEnter(card, { pointerType: "mouse", clientX: 10, clientY: 10 });
    expect(pool.style.opacity).toBe("1");
    fireEvent.pointerLeave(card);
    expect(pool.style.opacity).toBe("0");
    expect(getByRole("link", { name: "Sheet 1" })).toBeInTheDocument();
  });

  it("draws nothing on a touch screen", () => {
    fakeMedia({ fine: false });
    const { container } = render(
      <SpotlightCard>
        <span>row</span>
      </SpotlightCard>,
    );
    expect(container.querySelector(".spotlight-pool")).toBeNull();
  });
});
