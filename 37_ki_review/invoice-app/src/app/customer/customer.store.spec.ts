import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Customer } from './customer.model';
import { CustomerService } from './customer.service';
import { CustomerStore, LOAD_TEST_SIZE } from './customer.store';

describe('CustomerStore', () => {
  // Die einzige Abhängigkeit des Stores wird per DI ersetzt: kein HTTP, kein Backend.
  const getAll = vi.fn();

  const hans = { ...new Customer('Hans', 'Maulwurf', undefined, undefined, 'Springfield'), id: '0' };
  const lisa = { ...new Customer('Lisa', 'Simpson', undefined, undefined, 'Springfield'), id: '1' };
  const burns = { ...new Customer('Burns', 'Montgomery'), id: '2' };

  function createStore(): CustomerStore {
    return TestBed.inject(CustomerStore);
  }

  async function loadedStore(customers: Customer[] = [hans, lisa, burns]): Promise<CustomerStore> {
    getAll.mockReturnValue(of(customers));
    const store = createStore();
    await store.load();
    return store;
  }

  beforeEach(() => {
    localStorage.clear();
    getAll.mockReset();
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomerService, useValue: { getAll } },
        { provide: LOAD_TEST_SIZE, useValue: 0 } // Lastgenerator aus
      ]
    });
  });

  describe('load', () => {
    it('should start empty and not loading', () => {
      const store = createStore();

      expect(store.customers()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeUndefined();
    });

    it('should provide the loaded customers', async () => {
      const store = await loadedStore();

      expect(store.customers()).toEqual([hans, lisa, burns]);
      expect(store.loading()).toBe(false);
    });

    it('should set loading while the request is running', () => {
      getAll.mockReturnValue(of());
      const store = createStore();

      store.load();

      expect(store.loading()).toBe(true);
    });

    it('should set an error and keep the old list when loading fails', async () => {
      const store = await loadedStore([hans]);
      getAll.mockReturnValue(throwError(() => new Error('Netzwerk')));

      await store.load();

      expect(store.error()).toBe('Fehler beim Laden der Kunden.');
      expect(store.loading()).toBe(false);
      expect(store.customers()).toEqual([hans]);
    });

    it('should clear the error after a successful reload', async () => {
      const store = createStore();
      getAll.mockReturnValue(throwError(() => new Error('Netzwerk')));
      await store.load();
      getAll.mockReturnValue(of([hans]));

      await store.load();

      expect(store.error()).toBeUndefined();
      expect(store.customers()).toEqual([hans]);
    });
  });

  describe('filtered', () => {
    it('should return all customers without a filter', async () => {
      const store = await loadedStore();

      expect(store.filtered()).toEqual([hans, lisa, burns]);
    });

    it('should ignore upper and lower case', async () => {
      const store = await loadedStore();

      store.setFilter('LISA');

      expect(store.filtered()).toEqual([lisa]);
    });

    it('should match inside the first name, not only at the start', async () => {
      const store = await loadedStore();

      store.setFilter('sa');

      expect(store.filtered()).toEqual([lisa]);
    });

    it('should return an empty list when nothing matches', async () => {
      const store = await loadedStore();

      store.setFilter('xyz');

      expect(store.filtered()).toEqual([]);
      expect(store.total()).toBe(0);
    });

    it('should handle an empty customer list', async () => {
      const store = await loadedStore([]);

      store.setFilter('a');

      expect(store.filtered()).toEqual([]);
    });

    it('should show everything again when the filter is cleared', async () => {
      const store = await loadedStore();
      store.setFilter('li');

      store.setFilter('');

      expect(store.total()).toBe(3);
    });
  });

  describe('selection', () => {
    it('should derive the selected customer from the id', async () => {
      const store = await loadedStore();

      store.select('1');

      expect(store.selected()).toEqual(lisa);
    });

    it('should have no selection for an unknown id', async () => {
      const store = await loadedStore();

      store.select('does-not-exist');

      expect(store.selected()).toBeUndefined();
    });

    it('should remove the selection', async () => {
      const store = await loadedStore();
      store.select('1');

      store.select(undefined);

      expect(store.selected()).toBeUndefined();
    });
  });

  describe('load test generator', () => {
    it('should append the configured number of test customers', async () => {
      TestBed.overrideProvider(LOAD_TEST_SIZE, { useValue: 3 });

      const store = await loadedStore([hans]);

      expect(store.customers().length).toBe(4);
      expect(store.customers()[1].firstname).toBe('Kunde 0');
    });

    it('should create test customers with unique ids', async () => {
      TestBed.overrideProvider(LOAD_TEST_SIZE, { useValue: 500 });

      const store = await loadedStore([]);

      expect(new Set(store.customers().map(c => c.id)).size).toBe(500);
    });
  });

  describe('addDemo', () => {
    it('should add a customer with a new array reference', async () => {
      const store = await loadedStore();
      const before = store.customers();

      store.addDemo();

      expect(store.customers()).not.toBe(before);
      expect(before.length).toBe(3);
      expect(store.customers().length).toBe(4);
    });
  });

  describe('filter persistence (effect)', () => {
    it('should write the filter to localStorage', () => {
      const store = createStore();

      store.setFilter('lisa');
      TestBed.tick(); // führt anstehende Effects aus

      expect(localStorage.getItem('customerFilter')).toBe('lisa');
    });

    it('should restore the filter on creation', () => {
      localStorage.setItem('customerFilter', 'burns');

      const store = createStore();

      expect(store.filter()).toBe('burns');
    });
  });
});
