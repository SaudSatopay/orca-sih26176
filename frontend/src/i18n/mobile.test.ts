import { describe, expect, it } from "vitest";
import {
  ASK_EXAMPLES,
  clockLabel,
  parseClock,
  readAnswer,
  returnDay,
  returnLabel,
  sentences,
  T,
} from "./mobile";

describe("clock times on the phone", () => {
  it("uses the 12-hour clock in English", () => {
    expect(clockLabel("en", 14)).toBe("2 PM");
    expect(clockLabel("en", 0, 7)).toBe("12:07 AM");
    expect(clockLabel("en", 12)).toBe("12 PM");
    expect(clockLabel("en", 19, 30)).toBe("7:30 PM");
    expect(clockLabel("en", 24)).toBe("12 AM");
  });

  it("names the part of the day in Hindi and Marathi instead of AM and PM", () => {
    expect(clockLabel("hi", 14)).toBe("दोपहर 2");
    expect(clockLabel("hi", 19)).toBe("शाम 7");
    expect(clockLabel("hi", 0, 7)).toBe("रात 12:07");
    expect(clockLabel("hi", 6)).toBe("सुबह 6");
    expect(clockLabel("mr", 14)).toBe("दुपारी 2");
    expect(clockLabel("mr", 19)).toBe("संध्याकाळी 7");
    expect(clockLabel("mr", 0, 7)).toBe("रात्री 12:07");
    expect(clockLabel("mr", 5)).toBe("पहाटे 5");
  });

  it("reads a bare time and the time inside a timestamp", () => {
    expect(parseClock("00:07")).toEqual({ hour: 0, minute: 7 });
    expect(parseClock("2026-10-01T15:20:51+05:30")).toEqual({ hour: 15, minute: 20 });
    expect(parseClock("soon")).toBeNull();
    expect(parseClock("27:00")).toBeNull();
    expect(parseClock(null)).toBeNull();
  });
});

describe("the return-by time across midnight", () => {
  const readAt = "2026-10-01T15:07:00+05:30";

  it("knows which day the time belongs to", () => {
    expect(returnDay("21:30", readAt)).toBe("today");
    expect(returnDay("00:07", readAt)).toBe("tonight");
    expect(returnDay("04:59", readAt)).toBe("tonight");
    expect(returnDay("06:00", readAt)).toBe("tomorrow");
    // a full day's window comes back to the same clock time: that is tomorrow
    expect(returnDay("15:07", readAt)).toBe("tomorrow");
    expect(returnDay("later", readAt)).toBeNull();
  });

  it("labels a time after midnight as tonight, in English", () => {
    expect(returnLabel("en", "00:07", readAt)).toEqual({
      time: "12:07 AM",
      day: "tonight, after midnight",
      say: "Be back before 12:07 AM tonight. That is after midnight.",
    });
  });

  it("labels it in Hindi", () => {
    expect(returnLabel("hi", "00:07", readAt)).toEqual({
      time: "रात 12:07",
      day: "आज रात, आधी रात के बाद",
      say: "रात 12:07 बजे से पहले लौट आएँ। यह आधी रात के बाद है।",
    });
  });

  it("labels it in Marathi", () => {
    expect(returnLabel("mr", "00:07", readAt)).toEqual({
      time: "रात्री 12:07",
      day: "आज रात्री, मध्यरात्रीनंतर",
      say: "रात्री 12:07 च्या आधी परत या. ही वेळ मध्यरात्रीनंतरची आहे.",
    });
  });

  it("says today and tomorrow in all three languages", () => {
    expect(returnLabel("en", "21:30", readAt)).toMatchObject({ time: "9:30 PM", day: "today" });
    expect(returnLabel("hi", "21:30", readAt)).toMatchObject({ time: "रात 9:30", day: "आज" });
    expect(returnLabel("mr", "21:30", readAt)).toMatchObject({ time: "रात्री 9:30", day: "आज" });
    expect(returnLabel("en", "07:15", readAt)?.say).toBe("Be back before 7:15 AM tomorrow.");
    expect(returnLabel("hi", "07:15", readAt)?.say).toBe("कल सुबह 7:15 बजे से पहले लौट आएँ।");
    expect(returnLabel("mr", "07:15", readAt)?.say).toBe("उद्या सकाळी 7:15 च्या आधी परत या.");
  });

  it("never shows the raw 24-hour string", () => {
    for (const l of ["en", "hi", "mr"] as const)
      expect(returnLabel(l, "00:07", readAt)?.time).not.toContain("00:07");
    expect(returnLabel("en", "whenever", readAt)).toBeNull();
  });
});

describe("reading the crew's answer", () => {
  const en =
    "High risk — not recommended. Risk score: 70/100. Main reasons: Official warning active; Wave height 1.9 m; Wind speed 29 km/h. An official warning is in force.";
  const hi =
    "जोखिम अधिक है — जाने की सलाह नहीं. जोखिम स्कोर: 70/100. मुख्य कारण: आधिकारिक चेतावनी सक्रिय; लहरों की ऊँचाई 1.9 m; हवा की गति 29 km/h. आधिकारिक चेतावनी लागू है। कृपया निर्देशों का पालन करें।";

  it("does not break a sentence at a decimal point", () => {
    expect(sentences(en)).toHaveLength(4);
    expect(sentences(hi)).toHaveLength(5);
    expect(sentences("Wave height 1.9 m")).toEqual(["Wave height 1.9 m"]);
  });

  it("takes the verdict sentence and the listed reasons", () => {
    expect(readAnswer(en)).toEqual({
      headline: "High risk — not recommended",
      reasons: ["Official warning active", "Wave height 1.9 m", "Wind speed 29 km/h"],
    });
  });

  it("keeps the reasons in the answer's own language", () => {
    expect(readAnswer(hi)).toEqual({
      headline: "जोखिम अधिक है — जाने की सलाह नहीं",
      reasons: ["आधिकारिक चेतावनी सक्रिय", "लहरों की ऊँचाई 1.9 m", "हवा की गति 29 km/h"],
    });
  });

  it("returns no reasons when the answer lists none", () => {
    expect(readAnswer("Area 1 is 31 km to the south-west.")).toEqual({
      headline: "Area 1 is 31 km to the south-west",
      reasons: [],
    });
  });
});

describe("the phone's strings", () => {
  it("offers the same number of example questions in each language", () => {
    expect(ASK_EXAMPLES.en.length).toBeGreaterThanOrEqual(3);
    expect(ASK_EXAMPLES.hi).toHaveLength(ASK_EXAMPLES.en.length);
    expect(ASK_EXAMPLES.mr).toHaveLength(ASK_EXAMPLES.en.length);
  });

  it("keeps every placeholder in every language", () => {
    for (const key of Object.keys(T.en) as (keyof typeof T.en)[]) {
      const holes = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
      expect(holes(T.hi[key]), `hi.${key}`).toEqual(holes(T.en[key]));
      expect(holes(T.mr[key]), `mr.${key}`).toEqual(holes(T.en[key]));
    }
  });
});
