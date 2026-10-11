import { Customer } from '../customer.model';

const HEADER = ['id', 'firstname', 'lastname', 'street', 'zip', 'city', 'lastOrderDate'] as const;

// Zeichen, mit denen Tabellenkalkulationen eine Zelle als Formel auswerten ("CSV-Injection").
const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

/**
 * Macht aus einem beliebigen Wert ein sicheres CSV-Feld (RFC 4180):
 * - fehlende Werte (undefined/null) werden zu einem leeren Feld, nicht zum Text "undefined"
 * - Felder mit Komma, Anführungszeichen oder Zeilenumbruch kommen in Anführungszeichen,
 *   enthaltene Anführungszeichen werden verdoppelt
 * - Texte, die wie eine Formel beginnen (=, +, -, @), bekommen ein Hochkomma vorangestellt,
 *   damit Excel & Co. sie nicht ausführen
 */
export function escapeCsvField(value: string | number | boolean | Date | null | undefined): string {
  if (value === undefined || value === null) {
    return '';
  }

  let text = value instanceof Date ? formatDate(value) : String(value);

  if (FORMULA_PREFIXES.some(prefix => text.startsWith(prefix))) {
    text = "'" + text;
  }

  if (/[",\r\n]/.test(text)) {
    text = '"' + text.replace(/"/g, '""') + '"';
  }

  return text;
}

function formatDate(date: Date): string {
  return isNaN(date.getTime()) ? '' : date.toISOString().substring(0, 10);
}

/** Erzeugt den CSV-Text für eine Kundenliste (Kopfzeile plus eine Zeile pro Kunde, Zeilenende CRLF). */
export function toCsv(customers: readonly Customer[]): string {
  const rows = customers.map(customer => HEADER.map(column => escapeCsvField(customer[column])).join(','));
  return [HEADER.join(','), ...rows].join('\r\n') + '\r\n';
}
