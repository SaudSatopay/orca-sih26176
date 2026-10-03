/** Tests only: pretend the reader's device answers these media queries. */
export function fakeMedia(opts: { reduce?: boolean; fine?: boolean }) {
  window.matchMedia = ((q: string) => ({
    matches: (q.includes("reduce") && !!opts.reduce) || (q.includes("pointer: fine") && !!opts.fine),
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
