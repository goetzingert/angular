// Erlaubte Ziele nach dem Login: nur interne Pfade unterhalb dieser Präfixe.
const ALLOWED_PREFIXES = ['/customer'];

/**
 * Prüft einen returnUrl-Wert (kommt aus der URL und ist damit Eingabe von außen) gegen eine Allowlist.
 * Liefert einen sicheren internen Pfad (inklusive Query) oder undefined.
 *
 * Abgewiesen werden: absolute URLs und fremde Hosts ("https://evil.example", "//evil.example",
 * "/\\evil.example"), "javascript:"-URLs sowie alle Pfade außerhalb der Allowlist.
 */
export function safeReturnUrl(value: string | null | undefined, origin: string = window.location.origin): string | undefined {
  if (!value) {
    return undefined;
  }

  let url: URL;
  try {
    // Relative Pfade werden gegen die eigene Origin aufgelöst, absolute URLs behalten ihre Origin.
    url = new URL(value, origin);
  } catch {
    return undefined;
  }

  if (url.origin !== origin) {
    return undefined;
  }

  const allowed = ALLOWED_PREFIXES.some(prefix => url.pathname === prefix || url.pathname.startsWith(prefix + '/'));
  return allowed ? url.pathname + url.search : undefined;
}
