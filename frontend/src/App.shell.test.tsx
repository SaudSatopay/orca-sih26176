import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pageTitle } from "./documentMeta";
import { ERRORS } from "./i18n/errors";
import { UI } from "./i18n/app";
import { T as CHAT } from "./i18n/chat";
import type { ChatResponse } from "./types";

// The chart needs a real layout engine; the shell does not need the chart.
vi.mock("./components/MarineMap", () => ({ default: () => null }));
vi.mock("./api");
// The first test imports the whole console cold; on a busy machine that alone
// can take several seconds.
vi.setConfig({ testTimeout: 20_000 });

const response = {
  answer: "Go with caution. Risk score: 28/100. Sources: ORCA demo dataset · Updated 15:00 IST.",
  language: "en",
  mode: "DEMO",
  suggestions: ["What about 12 PM?"],
  pfz: [],
  routes: [],
  geofence: [],
  alerts: [],
  risk: null,
  evidence: [],
  trace: [],
  intent: { location: null },
  disclaimer: "Decision support, not an official advisory.",
  elapsed_ms: 12,
} as unknown as ChatResponse;

async function openApp(search: string) {
  vi.resetModules(); // the deep link is read when App is first imported
  window.history.replaceState({}, "", `/${search}`);
  const api = vi.mocked(await import("./api"));
  vi.clearAllMocks(); // call counts start from zero in every test
  api.zones.mockResolvedValue({ features: [], note: "" });
  api.health.mockResolvedValue({ data_mode: "DEMO" } as Awaited<ReturnType<typeof api.health>>);
  api.resetSession.mockResolvedValue({} as Awaited<ReturnType<typeof api.resetSession>>);
  api.authority.mockRejectedValue(new Error("not under test"));
  api.config.mockRejectedValue(new Error("not under test"));
  api.forecast.mockRejectedValue(new Error("not under test"));
  api.fishingOutlook.mockRejectedValue(new Error("offline"));
  api.ask.mockResolvedValue(response);
  const { default: App } = await import("./App");
  render(<App />);
  return api;
}

const tick = (ms = 20) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

function ask(text: string) {
  const field = screen.getByRole("textbox", { name: CHAT.en.question });
  fireEvent.change(field, { target: { value: text } });
  fireEvent.submit(field.closest("form")!);
}

beforeEach(() => {
  document.title = "ORCA";
  document.documentElement.lang = "en";
});
afterEach(() => {
  window.history.replaceState({}, "", "/");
});

describe("the document follows the console", () => {
  it("names the view in the tab title and keeps <html lang> on the chosen language", async () => {
    await openApp("?tab=ask");
    expect(document.title).toBe("Ask — ORCA");
    expect(document.documentElement.lang).toBe("en");

    fireEvent.click(screen.getByRole("button", { name: "मराठी" }));
    expect(document.documentElement.lang).toBe("mr");
    expect(document.title).toBe("विचारा — ORCA");

    fireEvent.click(screen.getByRole("button", { name: "हिन्दी" }));
    expect(document.documentElement.lang).toBe("hi");
    expect(document.title).toBe("पूछें — ORCA");
  });

  it("renames the title when the view changes", async () => {
    await openApp("?tab=ask");
    const nav = screen.getByRole("navigation", { name: UI.en.views });
    const system = within(nav).getByRole("link", { name: "System" });
    expect(system).toHaveAttribute("href", "?tab=system");
    fireEvent.click(system);
    expect(document.title).toBe("System — ORCA");
    expect(system).toHaveAttribute("aria-current", "page");
    expect(window.location.search).toBe("?tab=system");
  });

  it("leaves the landing page its own title", () => {
    expect(pageTitle(null, "ORCA — marine decision support")).toBe("ORCA — marine decision support");
    expect(pageTitle("Today", "anything")).toBe("Today — ORCA");
  });
});

describe("the shell's landmarks", () => {
  it("has one banner, one named navigation, one main and one h1", async () => {
    await openApp("?tab=ask");
    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getByRole("navigation", { name: UI.en.views })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ask");
  });

  it("gives every button an accessible name, in each language", async () => {
    await openApp("?tab=ask");
    for (const name of ["English", "हिन्दी", "मराठी"]) {
      fireEvent.click(screen.getByRole("button", { name }));
      for (const b of screen.getAllByRole("button"))
        expect(b, b.outerHTML.slice(0, 120)).toHaveAccessibleName();
    }
  });
});

describe("the Ask sheet's states", () => {
  it("opens on an empty state that says what can be asked and offers the rehearsed questions", async () => {
    await openApp("?tab=ask");
    expect(screen.getByRole("heading", { name: UI.en.deckLead })).toBeInTheDocument();
    expect(screen.getByText(CHAT.en.emptyMain)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: UI.en.pendingTitle })).toBeInTheDocument();
    // the question is shown in the language it is asked in
    expect(
      screen.getByRole("button", { name: /Is it safe to go fishing tomorrow morning near Goa\?/ }),
    ).toBeInTheDocument();
  });

  it("shows the crew working while the question is out, then the answer in three parts", async () => {
    const api = await openApp("?tab=ask");
    let land: (r: ChatResponse) => void = () => {};
    api.ask.mockReset().mockImplementationOnce(() => new Promise<ChatResponse>((r) => (land = r)));

    ask("Can I go at 6 AM?");
    await tick();
    expect(screen.getByText("Can I go at 6 AM?")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The crew is reading the sea" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: UI.en.pendingTitle })).not.toBeInTheDocument();

    await act(async () => {
      land(response);
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(screen.queryByRole("heading", { name: "The crew is reading the sea" })).not.toBeInTheDocument();
    expect(screen.getByText("Go with caution.")).toBeInTheDocument();
    expect(screen.getByText("Risk score: 28/100.")).toBeInTheDocument();
    expect(screen.getByText("Sources: ORCA demo dataset · Updated 15:00 IST.")).toBeInTheDocument();
  });

  it("keeps the last answer when /api/chat fails, says so, and asks the same question again on retry", async () => {
    const api = await openApp("?tab=ask");
    ask("Can I go at 6 AM?");
    expect(await screen.findByText("Go with caution.")).toBeInTheDocument();

    api.ask.mockReset().mockRejectedValueOnce(new Error("Failed to fetch")).mockResolvedValueOnce({
      ...response,
      answer: "Conditions look safe. Risk score: 9/100.",
    });
    ask("What about 12 PM?");

    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText(ERRORS.en.offlineTitle)).toBeInTheDocument();
    expect(within(alert).getByText(ERRORS.en.offlineBody)).toBeInTheDocument();
    // the last answer is still on screen, and nothing raw leaks from the error
    expect(screen.getByText("Go with caution.")).toBeInTheDocument();
    expect(screen.queryByText(/Failed to fetch|uvicorn/)).not.toBeInTheDocument();

    fireEvent.click(within(alert).getByRole("button", { name: ERRORS.en.retry }));
    expect(await screen.findByText("Conditions look safe.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(api.ask).toHaveBeenCalledTimes(2);
    expect(api.ask).toHaveBeenLastCalledWith(expect.objectContaining({ message: "What about 12 PM?" }));
    // the retried question is on screen once, not twice
    expect(screen.getAllByText("What about 12 PM?", { selector: "p" })).toHaveLength(1);
  });

  it("says the error in Marathi when the console is in Marathi", async () => {
    const api = await openApp("?tab=ask&lang=mr");
    api.ask.mockReset().mockRejectedValue(new Error("offline"));
    const field = screen.getByRole("textbox", { name: CHAT.mr.question });
    fireEvent.change(field, { target: { value: "मी जाऊ शकतो का?" } });
    fireEvent.submit(field.closest("form")!);
    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText(ERRORS.mr.offlineTitle)).toBeInTheDocument();
    expect(within(alert).getByRole("button", { name: ERRORS.mr.retry })).toBeInTheDocument();
  });
});

describe("the Today frame", () => {
  it("says what went wrong when the plan does not load, and reads it again on request", async () => {
    const api = await openApp("?tab=home&at=18.95,72.75");
    const alert = await screen.findByRole("alert");
    expect(within(alert).getByRole("heading", { name: UI.en.outlookFailTitle })).toBeInTheDocument();
    expect(api.fishingOutlook).toHaveBeenCalledTimes(1);

    fireEvent.click(within(alert).getByRole("button", { name: UI.en.outlookRetry }));
    await tick();
    expect(api.fishingOutlook).toHaveBeenCalledTimes(2);
  });
});
