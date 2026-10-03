import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnimatedList } from "./animated-list";

const rows = [
  { id: "b", port: "Kochi" },
  { id: "a", port: "Mumbai" },
];

describe("animated list (Unlumen, adapted)", () => {
  it("keeps a log a real table: tbody of rows, newest first", () => {
    const { container } = render(
      <table>
        <AnimatedList
          as="tbody"
          items={rows}
          itemKey={(r) => r.id}
          renderItem={(r) => <td>{r.port}</td>}
        />
      </table>,
    );
    const trs = container.querySelectorAll("tbody > tr");
    expect(trs).toHaveLength(2);
    expect(trs[0]).toHaveTextContent("Kochi");
    expect(trs[1]).toHaveTextContent("Mumbai");
  });

  it("never starts an entry from opacity 0: a reading is legible from its first frame", () => {
    const { container, rerender } = render(
      <AnimatedList items={rows} itemKey={(r) => r.id} renderItem={(r) => r.port} />,
    );
    rerender(
      <AnimatedList
        items={[{ id: "c", port: "Paradip" }, ...rows]}
        itemKey={(r) => r.id}
        renderItem={(r) => r.port}
      />,
    );
    const first = container.firstElementChild!.firstElementChild as HTMLElement;
    expect(first).toHaveTextContent("Paradip");
    expect(first.style.opacity === "" || first.style.opacity === "1").toBe(true);
  });

  it("marks each entry with its place so a caller can pick out the newest", () => {
    const { container } = render(
      <AnimatedList
        items={rows}
        itemKey={(r) => r.id}
        renderItem={(r) => r.port}
        itemProps={(_, i) => ({ className: i === 0 ? "newest" : undefined, "data-port": "x" })}
      />,
    );
    expect(container.querySelector('[data-index="0"]')).toHaveClass("newest");
    expect(container.querySelector('[data-index="1"]')).not.toHaveClass("newest");
  });
});
