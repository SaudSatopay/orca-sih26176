import { describe, expect, it } from "vitest";
import {
  COURSE_AT,
  COURSE_MS,
  CREW_AT,
  CREW_SIZE,
  CREW_STEP,
  END,
  NOTE_AT,
  STAMP_AT,
  TYPE_MS,
  WHY_AT,
  WHY_SIZE,
  heroStage,
} from "./heroSequence";

const ASK = 52;

describe("the landing hero's sequence", () => {
  it("starts with an empty sheet and nothing reported", () => {
    const s = heroStage(0, ASK);
    expect(s).toMatchObject({
      typed: 0,
      crew: 0,
      course: false,
      arrived: false,
      stamped: false,
      why: 0,
      note: false,
      settled: false,
    });
  });

  it("ends as the poster: every part present, nothing mid-flight", () => {
    const s = heroStage(END, ASK);
    expect(s).toMatchObject({
      typed: ASK,
      crew: CREW_SIZE,
      course: true,
      arrived: true,
      stamped: true,
      why: WHY_SIZE,
      note: true,
      settled: true,
    });
    // a timer that fires late lands on the same poster
    expect(heroStage(END + 60_000, ASK).key).toBe(s.key);
  });

  it("runs in the order the product works: question, crew, course, verdict, reasons", () => {
    expect(TYPE_MS).toBeGreaterThan(CREW_AT); // the crew starts while the question is still being written
    expect(CREW_AT + CREW_STEP * (CREW_SIZE - 1)).toBeLessThanOrEqual(COURSE_AT);
    expect(COURSE_AT + COURSE_MS).toBeLessThanOrEqual(STAMP_AT);
    expect(STAMP_AT).toBeLessThan(WHY_AT);
    expect(NOTE_AT).toBeLessThan(END);
    expect(STAMP_AT).toBeLessThanOrEqual(600); // the verdict is down by 0.6 s
    expect(END).toBeLessThanOrEqual(1000); // the whole moment is one second
  });

  it("writes the question out evenly and never past its end", () => {
    expect(heroStage(TYPE_MS / 2, ASK).typed).toBe(ASK / 2);
    expect(heroStage(TYPE_MS, ASK).typed).toBe(ASK);
    expect(heroStage(TYPE_MS * 3, ASK).typed).toBe(ASK);
    expect(heroStage(TYPE_MS / 2, 0).typed).toBe(0);
  });

  it("reports the crew one at a time", () => {
    expect(heroStage(CREW_AT - 1, ASK).crew).toBe(0);
    expect(heroStage(CREW_AT, ASK).crew).toBe(1);
    expect(heroStage(CREW_AT + CREW_STEP * 4, ASK).crew).toBe(5);
    expect(heroStage(CREW_AT + CREW_STEP * 40, ASK).crew).toBe(CREW_SIZE);
  });

  it("stamps the verdict only after the course has arrived", () => {
    const beforeArrival = heroStage(COURSE_AT + COURSE_MS - 1, ASK);
    expect(beforeArrival.course).toBe(true);
    expect(beforeArrival.arrived).toBe(false);
    expect(beforeArrival.stamped).toBe(false);
    expect(heroStage(STAMP_AT, ASK).stamped).toBe(true);
  });

  it("changes its key only when something visible changes", () => {
    // after the floor note and before the sheet settles, nothing moves
    const a = heroStage(NOTE_AT + 20, ASK);
    const b = heroStage(END - 20, ASK);
    expect(a.key).toBe(b.key);
    expect(heroStage(STAMP_AT - 1, ASK).key).not.toBe(heroStage(STAMP_AT, ASK).key);
  });

  it("treats a negative clock as the start", () => {
    expect(heroStage(-50, ASK).key).toBe(heroStage(0, ASK).key);
  });
});
