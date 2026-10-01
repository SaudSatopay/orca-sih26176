/**
 * When ORCA may read a position by itself.
 *
 * A permission prompt at page load arrives before the visitor knows what is
 * asking or why, and most people refuse it on reflex. So ORCA reads the
 * position on its own only when the browser says it is ALREADY allowed (a
 * returning fisher is found at once, with no prompt). Otherwise it opens on
 * the default harbour, which is a complete answer, and asks when the visitor
 * presses "Use my location": the prompt then appears in reply to their own
 * action.
 *
 * Browsers without the Permissions API answer "not yet allowed".
 */
export async function locationAlreadyAllowed(): Promise<boolean> {
  try {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return false;
    const status = await navigator.permissions?.query({ name: "geolocation" });
    return status?.state === "granted";
  } catch {
    return false;
  }
}
