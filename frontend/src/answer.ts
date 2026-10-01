/**
 * ORCA's answer arrives as one string: the advice, then where the readings
 * came from, then (in demo mode) the line that says the data is simulated.
 * The conversation sets those apart, so the advice reads as advice and the
 * provenance reads as a footnote. The wording is the backend's
 * (`backend/app/services/i18n.py`); only the markers are known here.
 */
export interface AnswerParts {
  /** The first sentence: the verdict in words. Empty when there is no clean break. */
  lead: string;
  /** The rest of the advice. */
  body: string;
  /** "Sources: … · Updated …" — empty when the answer carries none. */
  sources: string;
  /** "Demo / simulated data — not a live government feed." — empty outside demo mode. */
  note: string;
}

const SOURCES = /(?:^|\s)(Sources:|स्रोत:)/;
const NOTE = /(?:^|\s)(Demo \/ |डेमो \/ )/;
/** A sentence end: a full stop or a danda followed by a space. Not "1.9 m". */
const SENTENCE_END = /[.।](?=\s)/;
/** A lead longer than this is a paragraph, not a headline. */
const LEAD_MAX = 90;

function cut(text: string, marker: RegExp): [string, string] {
  const m = marker.exec(text);
  if (!m) return [text, ""];
  const at = m.index + m[0].length - m[1].length;
  return [text.slice(0, at).trim(), text.slice(at).trim()];
}

export function splitAnswer(text: string): AnswerParts {
  const [beforeNote, note] = cut(text.trim(), NOTE);
  const [advice, sources] = cut(beforeNote, SOURCES);

  const end = SENTENCE_END.exec(advice);
  const hasLead = end !== null && end.index + 1 <= LEAD_MAX && end.index + 1 < advice.length;
  return {
    lead: hasLead ? advice.slice(0, end.index + 1) : "",
    body: hasLead ? advice.slice(end.index + 1).trim() : advice,
    sources,
    note,
  };
}
