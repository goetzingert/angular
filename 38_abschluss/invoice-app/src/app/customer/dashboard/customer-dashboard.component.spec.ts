import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';
import { CustomerStore, LOAD_TEST_SIZE } from '../customer.store';
import { CustomerDashboardComponent } from './customer-dashboard.component';

const DAY = 1000 * 60 * 60 * 24;

function customer(firstname: string, city: string | undefined, daysAgo: number | undefined, id: string): Customer {
  return {
    ...new Customer(firstname, 'Test', undefined, undefined, city, undefined, false,
      daysAgo === undefined ? undefined : new Date(Date.now() - daysAgo * DAY)),
    id
  };
}

describe('CustomerDashboardComponent', () => {
  const getAll = vi.fn();
  let fixture: ComponentFixture<CustomerDashboardComponent>;

  const el = () => fixture.nativeElement as HTMLElement;
  const kpi = (name: string) => el().querySelector(`[data-kpi="${name}"]`)?.textContent?.trim();
  const cityRows = () => Array.from(el().querySelectorAll('tbody tr')).map(row =>
    Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim()));

  async function create(customers: Customer[]): Promise<CustomerDashboardComponent> {
    getAll.mockReturnValue(of(customers));
    fixture = TestBed.createComponent(CustomerDashboardComponent);
    // store.load() ist async: Promise-Kette abwarten, dann rendern lassen
    await new Promise<void>(resolve => setTimeout(resolve));
    await fixture.whenStable();
    return fixture.componentInstance;
  }

  beforeEach(() => {
    localStorage.clear();
    getAll.mockReset();
    TestBed.configureTestingModule({
      imports: [CustomerDashboardComponent],
      providers: [
        provideRouter([]),
        { provide: CustomerService, useValue: { getAll } },
        { provide: LOAD_TEST_SIZE, useValue: 0 }
      ]
    });
  });

  it('should count all customers', async () => {
    const dashboard = await create([
      customer('Hans', 'Springfield', 10, '0'),
      customer('Lisa', 'Springfield', 2, '1'),
      customer('Burns', 'Shelbyville', 365, '2')
    ]);

    expect(dashboard.total()).toBe(3);
    expect(kpi('total')).toBe('3');
  });

  it('should count customers with an order in the last 7 days', async () => {
    const dashboard = await create([
      customer('Heute', 'A', 0, '0'),
      customer('Gestern', 'A', 1, '1'),
      customer('Knapp', 'A', 6, '2'),
      customer('Zu alt', 'A', 8, '3'),
      customer('Nie bestellt', 'A', undefined, '4')
    ]);

    expect(dashboard.activeLast7Days()).toBe(3);
    expect(kpi('active')).toBe('3');
  });

  it('should count customers per city, largest city first', async () => {
    const dashboard = await create([
      customer('A', 'Shelbyville', 1, '0'),
      customer('B', 'Springfield', 1, '1'),
      customer('C', 'Springfield', 1, '2'),
      customer('D', 'Ogdenville', 1, '3')
    ]);

    expect(dashboard.customersPerCity()).toEqual([
      { city: 'Springfield', count: 2 },
      { city: 'Ogdenville', count: 1 },
      { city: 'Shelbyville', count: 1 }
    ]);
    expect(cityRows()).toEqual([['Springfield', '2'], ['Ogdenville', '1'], ['Shelbyville', '1']]);
  });

  it('should group customers without a city under "Unbekannt"', async () => {
    const dashboard = await create([customer('A', undefined, 1, '0'), customer('B', '  ', 1, '1'), customer('C', 'Berlin', 1, '2')]);

    expect(dashboard.customersPerCity()).toEqual([
      { city: 'Unbekannt', count: 2 },
      { city: 'Berlin', count: 1 }
    ]);
  });

  it('should show zeros and a hint for an empty customer list', async () => {
    const dashboard = await create([]);

    expect(dashboard.total()).toBe(0);
    expect(dashboard.activeLast7Days()).toBe(0);
    expect(dashboard.customersPerCity()).toEqual([]);
    expect(el().textContent).toContain('Keine Kunden vorhanden.');
  });

  it('should update the figures when the store gets new data', async () => {
    const dashboard = await create([customer('A', 'Berlin', 1, '0')]);
    expect(kpi('total')).toBe('1');

    getAll.mockReturnValue(of([customer('A', 'Berlin', 1, '0'), customer('B', 'Berlin', 20, '1')]));
    await TestBed.inject(CustomerStore).load();
    await fixture.whenStable();

    expect(dashboard.total()).toBe(2);
    expect(kpi('total')).toBe('2');
    expect(kpi('active')).toBe('1');
  });

  it('should show an error message when loading fails', async () => {
    getAll.mockReturnValue(throwError(() => new Error('Netzwerk')));
    fixture = TestBed.createComponent(CustomerDashboardComponent);
    await new Promise<void>(resolve => setTimeout(resolve));
    await fixture.whenStable();

    expect(el().querySelector('.error')?.textContent).toContain('Fehler beim Laden');
    expect(kpi('total')).toBe('0');
  });
});
