import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Customer } from './customer.model';
import { CustomerService } from './customer.service';

const FILTER_STORAGE_KEY = 'customerFilter';

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
      this._customers.set(await firstValueFrom(this.customerService.getAll()));
    } catch {
      this._error.set('Fehler beim Laden der Kunden.');
    } finally {
      this._loading.set(false);
    }
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
