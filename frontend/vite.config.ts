import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import type { HtmlTagDescriptor, Plugin } from "vite";

type BundleChunk = {
  type: "chunk";
  fileName: string;
  facadeModuleId: string | null;
  isEntry: boolean;
  imports: string[];
  viteMetadata?: { importedCss: Set<string> };
};

/**
 * main.tsx picks the phone app or the console and imports only that chunk.
 * Left alone, the browser would learn the chunk's name only after the entry
 * has been downloaded and run. This plugin writes the two lists into
 * index.html so the right one starts downloading with the entry:
 *
 *   - a tiny inline script that applies the same rule as `isPhoneLayout` in
 *     src/boot.ts and adds `modulepreload` (and stylesheet) links for the
 *     chosen app only;
 *   - a `preload` link for the one face the first paint leans on (Fraunces
 *     roman, Latin: the wordmark, the headline, the verdict). Every other face
 *     waits for text that needs it; preloading a second one cost more in
 *     contention with the app chunk than it saved.
 */
function bootPreload(): Plugin {
  return {
    name: "orca-boot-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        const files = Object.values(ctx.bundle);
        const chunks = files.filter((f): f is typeof f & BundleChunk => f.type === "chunk");
        const byName = new Map(chunks.map((c) => [c.fileName, c]));
        const entry = chunks.find((c) => c.isEntry);
        const already = new Set<string>();
        const walk = (c: BundleChunk | undefined, into: Set<string>) => {
          if (!c || into.has(c.fileName)) return;
          into.add(c.fileName);
          c.imports.forEach((i) => walk(byName.get(i), into));
        };
        walk(entry, already);

        const listFor = (suffix: string) => {
          const root = chunks.find((c) => c.facadeModuleId?.endsWith(suffix));
          const js = new Set<string>();
          walk(root, js);
          const css = new Set<string>();
          for (const name of js)
            if (!already.has(name))
              byName.get(name)?.viteMetadata?.importedCss.forEach((f) => css.add(f));
          return {
            js: [...js].filter((f) => !already.has(f)).map((f) => `/${f}`),
            css: [...css].map((f) => `/${f}`),
          };
        };
        const phone = listFor("/src/components/MobileApp.tsx");
        const desk = listFor("/src/App.tsx");

        const fonts = files
          .map((f) => f.fileName)
          .filter((f) => /fraunces-latin-wght-normal-[^.]+\.woff2$/.test(f));

        // Mirrors isPhoneLayout() and PHONE_QUERY in src/boot.ts.
        const script =
          `(function(){var d=document,m=new URLSearchParams(location.search).get("m"),` +
          `p=m==="1"||(m!=="0"&&matchMedia("(max-width: 640px)").matches),` +
          `a=p?${JSON.stringify(phone)}:${JSON.stringify(desk)};` +
          `d.documentElement.classList.toggle("phone",p);` +
          `function k(r,h){var l=d.createElement("link");l.rel=r;l.href=h;` +
          `if(r==="modulepreload")l.crossOrigin="";d.head.appendChild(l)}` +
          `a.js.forEach(function(h){k("modulepreload",h)});` +
          `a.css.forEach(function(h){k("stylesheet",h)})})()`;

        const tags: HtmlTagDescriptor[] = [
          ...fonts.map(
            (f): HtmlTagDescriptor => ({
              tag: "link",
              attrs: { rel: "preload", as: "font", type: "font/woff2", href: `/${f}`, crossorigin: true },
              injectTo: "head",
            }),
          ),
          { tag: "script", children: script, injectTo: "head" },
        ];
        return tags;
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), bootPreload()],
  server: {
    port: 5173,
    // Dev server talks to the FastAPI backend without CORS friction.
    proxy: {
      "/api": { target: "http://127.0.0.1:8000", changeOrigin: true },
    },
  },
  build: { outDir: "dist", emptyOutDir: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
