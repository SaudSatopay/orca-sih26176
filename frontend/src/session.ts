/**
 * One chat session per device.
 *
 * The backend keeps each session's last question so a follow-up ("what about
 * 4 PM?") keeps its place and time. A fixed id shared that memory between
 * every phone: one fisher asked about Paradip, the next one's follow-up was
 * answered for Paradip. Each device now draws its own id once and keeps it;
 * when storage is unavailable (private mode, blocked site data) it lasts for
 * the page's life, which is still never shared.
 */
type Store = Pick<Storage, "getItem" | "setItem">;

const KEY = "orca.session";

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to the timestamp id
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function browserStore(): Store | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** This device's session id for one of the two apps ("console" or "phone"). */
export function deviceSession(app: string, store: Store | null = browserStore()): string {
  const key = `${KEY}.${app}`;
  try {
    const kept = store?.getItem(key);
    if (kept) return kept;
    const id = `${app}-${randomId()}`;
    store?.setItem(key, id);
    return id;
  } catch {
    return `${app}-${randomId()}`;
  }
}
