/**
 * The landing hero's sequence, as a pure function of elapsed time.
 * One second, start to finish, and the verdict is down by 0.6 s:
 *
 *     0    the question is written out          220 ms
 *    80    the crew reports, 20 ms apart        ten names
 *   260    the course (or the storm track) is drawn   340 ms
 *   600    it arrives: the buoy rings, the line is labelled,
 *          and the verdict is stamped
 *   640    the reasons, 50 ms apart             three rows
 *   790    the floor note
 *  1000    settled: nothing is mid-flight any more
 *
 * Kept apart from the component so the timings can be tested without a clock.
 */

export const TYPE_MS = 220;
export const CREW_AT = 80;
export const CREW_STEP = 20;
export const CREW_SIZE = 10;
export const COURSE_AT = 260;
export const COURSE_MS = 340;
export const STAMP_AT = 600;
export const WHY_AT = 640;
export const WHY_STEP = 50;
export const WHY_SIZE = 3;
export const NOTE_AT = WHY_AT + WHY_STEP * WHY_SIZE;
export const END = 1000;

export interface HeroStage {
  /** Characters of the question written so far. */
  typed: number;
  /** Crew members that have reported. */
  crew: number;
  /** The course has started to draw. */
  course: boolean;
  /** The course has reached its buoy. */
  arrived: boolean;
  stamped: boolean;
  /** Reasons shown. */
  why: number;
  note: boolean;
  /** The sequence is over; the sheet is the poster. */
  settled: boolean;
  /** Changes exactly when something visible does. */
  key: string;
}

export function heroStage(elapsed: number, askLength: number): HeroStage {
  const e = Math.max(0, elapsed);
  const typed = e >= TYPE_MS ? askLength : Math.floor((e / TYPE_MS) * askLength);
  const crew = e < CREW_AT ? 0 : Math.min(CREW_SIZE, Math.floor((e - CREW_AT) / CREW_STEP) + 1);
  const course = e >= COURSE_AT;
  const arrived = e >= COURSE_AT + COURSE_MS;
  const stamped = e >= STAMP_AT;
  const why = e < WHY_AT ? 0 : Math.min(WHY_SIZE, Math.floor((e - WHY_AT) / WHY_STEP) + 1);
  const note = e >= NOTE_AT;
  const settled = e >= END;
  return {
    typed,
    crew,
    course,
    arrived,
    stamped,
    why,
    note,
    settled,
    key: [typed, crew, +course, +arrived, +stamped, why, +note, +settled].join("."),
  };
}
