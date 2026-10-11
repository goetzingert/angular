import { Customer } from '../customer.model';
import { escapeCsvField, toCsv } from './customer-csv';

function customer(overrides: Partial<Customer> = {}): Customer {
  return { ...new Customer('Hans', 'Meyer'), id: '1', ...overrides };
}

describe('escapeCsvField', () => {
  it('should leave plain text unchanged', () => {
    expect(escapeCsvField('Hans')).toBe('Hans');
  });

  it('should turn missing values into empty fields instead of "undefined"', () => {
    expect(escapeCsvField(undefined)).toBe('');
    expect(escapeCsvField(null)).toBe('');
  });

  it('should quote fields with a comma', () => {
    expect(escapeCsvField('Berlin, Mitte')).toBe('"Berlin, Mitte"');
  });

  it('should double quotes inside a field', () => {
    expect(escapeCsvField('Hans "der Maulwurf"')).toBe('"Hans ""der Maulwurf"""');
  });

  it('should quote fields with line breaks', () => {
    expect(escapeCsvField('Zeile 1\nZeile 2')).toBe('"Zeile 1\nZeile 2"');
  });

  it.each(['=1+1', '+49 30 1234', '-5', '@SUM(A1)'])('should neutralize the formula-like text %s', text => {
    expect(escapeCsvField(text)).toBe("'" + text);
  });

  it('should format dates as yyyy-mm-dd', () => {
    expect(escapeCsvField(new Date('2026-03-15T10:20:30.000Z'))).toBe('2026-03-15');
  });

  it('should not break on an invalid date', () => {
    expect(escapeCsvField(new Date('kein Datum'))).toBe('');
  });
});

describe('toCsv', () => {
  it('should return only the header for an empty list', () => {
    expect(toCsv([])).toBe('id,firstname,lastname,street,zip,city,lastOrderDate\r\n');
  });

  it('should write one line per customer', () => {
    const csv = toCsv([
      customer({ id: '1', firstname: 'Hans', lastname: 'Meyer', street: 'Hauptstraße 21', zip: '11111', city: 'Teststadt', lastOrderDate: new Date('2026-03-15T00:00:00.000Z') }),
      customer({ id: '2', firstname: 'Silke', lastname: 'Mueller' })
    ]);

    expect(csv.split('\r\n')).toEqual([
      'id,firstname,lastname,street,zip,city,lastOrderDate',
      '1,Hans,Meyer,Hauptstraße 21,11111,Teststadt,2026-03-15',
      '2,Silke,Mueller,,,,',
      ''
    ]);
  });

  it('should escape special characters in every column', () => {
    const csv = toCsv([customer({ lastname: 'O"Brien, Jr.', city: '=HYPERLINK("http://evil.example")' })]);

    expect(csv).toContain('"O""Brien, Jr."');
    expect(csv).toContain('"\'=HYPERLINK(""http://evil.example"")"');
  });
});
