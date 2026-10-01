import { describe, expect, it } from "vitest";
import { splitAnswer } from "./answer";

describe("splitAnswer", () => {
  it("sets the sources and the simulated-data line apart from the advice (en)", () => {
    const parts = splitAnswer(
      "Go with caution. Risk score: 28/100. Main reasons: Wave height 1.3 m; Wind speed 20 km/h. " +
        "Sources: ORCA demo dataset — SIMULATED, not official data, ORCA geospatial layer (OpenStreetMap derived) · Updated 01 Oct 2026, 15:00 IST. " +
        "Demo / simulated data — not a live government feed.",
    );
    expect(parts.lead).toBe("Go with caution.");
    expect(parts.body).toBe(
      "Risk score: 28/100. Main reasons: Wave height 1.3 m; Wind speed 20 km/h.",
    );
    expect(parts.sources).toBe(
      "Sources: ORCA demo dataset — SIMULATED, not official data, ORCA geospatial layer (OpenStreetMap derived) · Updated 01 Oct 2026, 15:00 IST.",
    );
    expect(parts.note).toBe("Demo / simulated data — not a live government feed.");
  });

  it("does the same in Marathi", () => {
    const parts = splitAnswer(
      "धोका जास्त आहे — जाऊ नका. धोका गुण: 70/100. लाटांची उंची 1.9 m. " +
        "स्रोत: ORCA डेमो माहितीसंच · अपडेट 02 Oct 2026, 06:00 IST. " +
        "डेमो / नमुना माहिती — हा सरकारी थेट स्रोत नाही.",
    );
    expect(parts.lead).toBe("धोका जास्त आहे — जाऊ नका.");
    expect(parts.body).toBe("धोका गुण: 70/100. लाटांची उंची 1.9 m.");
    expect(parts.sources).toBe("स्रोत: ORCA डेमो माहितीसंच · अपडेट 02 Oct 2026, 06:00 IST.");
    expect(parts.note).toBe("डेमो / नमुना माहिती — हा सरकारी थेट स्रोत नाही.");
  });

  it("ends a Hindi lead at the danda", () => {
    const parts = splitAnswer("सावधानी से जाएँ। जोखिम स्कोर: 28/100। स्रोत: ORCA · अपडेट 15:00 IST।");
    expect(parts.lead).toBe("सावधानी से जाएँ।");
    expect(parts.body).toBe("जोखिम स्कोर: 28/100।");
    expect(parts.sources).toBe("स्रोत: ORCA · अपडेट 15:00 IST।");
    expect(parts.note).toBe("");
  });

  it("does not break a decimal into a lead", () => {
    expect(splitAnswer("Waves are 1.9 m today").lead).toBe("");
    expect(splitAnswer("Waves are 1.9 m today").body).toBe("Waves are 1.9 m today");
  });

  it("keeps a one-sentence answer whole, and loses nothing from any answer", () => {
    expect(splitAnswer("second answer")).toEqual({
      lead: "",
      body: "second answer",
      sources: "",
      note: "",
    });
    const text = "Do not go. Too rough. Sources: A · Updated now. Demo / simulated data — x.";
    const p = splitAnswer(text);
    expect([p.lead, p.body, p.sources, p.note].join(" ")).toBe(text);
  });

  it("treats a long first sentence as prose, not a headline", () => {
    const long = `${"a very long opening clause ".repeat(5)}ends here. Then more.`;
    expect(splitAnswer(long).lead).toBe("");
  });
});
