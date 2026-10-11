import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CustomerListComponent } from './customer-list.component';

describe('CustomerListComponent', () => {
  let fixture: ComponentFixture<CustomerListComponent>;
  let component: CustomerListComponent;
  let httpMock: HttpTestingController;

  const customers = [
    { id: '0', firstname: 'Hans', lastname: 'Maulwurf', city: 'Springfield', discontinued: false },
    { id: '1', firstname: 'Lisa', lastname: 'Simpson', city: 'Springfield', discontinued: false },
    { id: '2', firstname: 'Burns', lastname: 'Montgomery', discontinued: true }
  ];

  const el = () => fixture.nativeElement as HTMLElement;
  // store.load() ist async (firstValueFrom): erst die Promise-Kette abwarten, dann rendern lassen
  const settle = async () => {
    await new Promise<void>(resolve => setTimeout(resolve));
    await fixture.whenStable();
  };

  const items = () => Array.from(el().querySelectorAll('li'));

  async function createList(): Promise<void> {
    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit ruft store.load() auf
    httpMock.expectOne('api/customer').flush({ data: customers });
    await settle();
  }

  async function type(text: string): Promise<void> {
    const input = el().querySelector('input')!;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CustomerListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should render the customers loaded from the backend', async () => {
    await createList();

    expect(items().length).toBe(3);
    expect(items()[1].textContent).toContain('Lisa');
    expect(items()[1].textContent).toContain(': Springfield');
    expect(items()[2].textContent).not.toContain(':');
  });

  it('should mark discontinued customers', async () => {
    await createList();

    expect(items().filter(li => li.classList.contains('discontinued')).length).toBe(1);
  });

  it('should emit and highlight the clicked customer', async () => {
    await createList();
    const selected: unknown[] = [];
    component.customerSelected.subscribe(customer => selected.push(customer));

    items()[0].click();
    await fixture.whenStable();

    expect(selected.length).toBe(1);
    expect(items()[0].classList.contains('selected')).toBe(true);
  });

  it('should filter by first name and clear the filter with focus', async () => {
    await createList();

    await type('li');
    expect(items().length).toBe(1);
    expect(items()[0].textContent).toContain('Lisa');

    el().querySelector('button')!.click();
    await fixture.whenStable();

    expect(items().length).toBe(3);
    expect(document.activeElement).toBe(el().querySelector('input'));
  });

  describe('state from the store', () => {
    it('should show total and selected name', async () => {
      await createList();
      expect(el().textContent).toContain('Treffer: 3 · Ausgewählt: -');

      await type('li');
      items()[0].click();
      await fixture.whenStable();

      expect(el().textContent).toContain('Treffer: 1 · Ausgewählt: Lisa');
    });

    it('should add a demo customer', async () => {
      await createList();

      el().querySelector<HTMLButtonElement>('p + button')!.click();
      await fixture.whenStable();

      expect(items().length).toBe(4);
    });

    it('should show an error message when loading fails', async () => {
      fixture = TestBed.createComponent(CustomerListComponent);
      fixture.detectChanges();
      httpMock.expectOne('api/customer').flush('Fehler', { status: 500, statusText: 'Server Error' });
      await settle();

      expect(el().querySelector('.error')?.textContent).toContain('Fehler beim Laden');
      expect(items().length).toBe(0);
    });
  });

  describe('filter persistence (effect)', () => {
    it('should write the filter to localStorage', async () => {
      await createList();

      await type('hans');

      expect(localStorage.getItem('customerFilter')).toBe('hans');
    });

    it('should restore the filter on start', async () => {
      localStorage.setItem('customerFilter', 'burns');

      await createList();

      expect(el().querySelector('input')!.value).toBe('burns');
      expect(items().length).toBe(1);
    });
  });
});
