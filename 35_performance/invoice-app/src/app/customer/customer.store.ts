import { Injectable, InjectionToken, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Customer } from './customer.model';
import { CustomerService } from './customer.service';

const FILTER_STORAGE_KEY = 'customerFilter';

/**
 * Lastgenerator für Übung 35: Anzahl zusätzlicher Test-Kunden, die nach dem Laden angehängt werden.
 * 0 schaltet den Generator ab. Tests überschreiben den Wert per providers.
 */
export const LOAD_TEST_SIZE = new InjectionToken<number>('LOAD_TEST_SIZE', {
  providedIn: 'root',
  factory: () => 5000
});

const CITIES = ['Springfield', 'Shelbyville', 'Capital City', 'Ogdenville', 'North Haverbrook'];
const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

// localStorage kann fehlen oder gesperrt sein (z. B. privater Modus), deshalb try/catch.
function loadFilter(): string {
  try {
    return localStorage.getItem(FILTER_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function saveFilter(text: string): void {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, text);
  } catch {
    // ignorieren: Persistenz ist nur eine Annehmlichkeit
  }
}

/**
 * Zustand und Fachlogik der Kundenliste (Service mit Signals).
 *
 * - Schreibbare Signals sind privat, nach außen gibt es nur lesbare Signals (asReadonly).
 * - Abgeleitete Werte (filtered, selected, total) sind computed.
 * - Änderungen laufen nur über benannte Methoden (load, setFilter, select, addDemo).
 */
@Injectable({ providedIn: 'root' })
export class CustomerStore {

  private readonly customerService = inject(CustomerService);
  private readonly loadTestSize = inject(LOAD_TEST_SIZE);

  private readonly _customers = signal<Customer[]>([]);
  private readonly _filter = signal(loadFilter());
  private readonly _selectedId = signal<string | undefined>(undefined);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | undefined>(undefined);

  readonly customers = this._customers.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly filtered = computed(() => {
    const filter = this._filter().toLowerCase();
    if (!filter) {
      return this._customers();
    }
    return this._customers().filter(c => c.firstname?.toLowerCase().includes(filter));
  });

  readonly selected = computed(() => this._customers().find(c => c.id === this._selectedId()));
  readonly total = computed(() => this.filtered().length);

  constructor() {
    // Die Nebenwirkung (Browser-Speicher) gehört zum Zustand und wohnt deshalb im Store,
    // nicht in einer Komponente.
    effect(() => saveFilter(this._filter()));
  }

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(undefined);
    try {
      const loaded = await firstValueFrom(this.customerService.getAll());
      this._customers.set([...loaded, ...this.createLoadTestCustomers()]);
    } catch {
      this._error.set('Fehler beim Laden der Kunden.');
    } finally {
      this._loading.set(false);
    }
  }

  private createLoadTestCustomers(): Customer[] {
    const now = Date.now();
    return Array.from({ length: this.loadTestSize }, (_, i) => new Customer(
      'Kunde ' + i, 'Test', undefined, undefined, CITIES[i % CITIES.length], undefined,
      i % 10 === 0, new Date(now - (i % 30) * DAY_IN_MILLIS)
    ));
  }

  setFilter(text: string): void {
    this._filter.set(text);
  }

  select(id: string | undefined): void {
    this._selectedId.set(id);
  }

  // Demo aus Übung 32: Änderung über eine neue Referenz. Der nächste load() überschreibt die Demo-Kunden.
  addDemo(): void {
    this._customers.update(list => [...list, new Customer('Neu', 'Demo')]);
  }
}
