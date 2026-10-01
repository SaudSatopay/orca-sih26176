/** The elements wider than the viewport, widest first: "412 div.m-app flex". */
export function overWide(root: ParentNode, viewportWidth: number, limit = 5): string[] {
  return [...root.querySelectorAll("*")]
    .map((el) => ({ el, w: el.getBoundingClientRect().width }))
    .filter((x) => x.w > viewportWidth + 1)
    .sort((a, b) => b.w - a.w)
    .slice(0, limit)
    .map(
      (x) =>
        `${Math.round(x.w)} ${x.el.tagName.toLowerCase()}.${String((x.el as HTMLElement).className).slice(0, 44)}`,
    );
}
