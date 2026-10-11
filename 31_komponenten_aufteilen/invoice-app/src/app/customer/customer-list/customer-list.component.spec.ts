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

  const items = () => Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('li'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock.expectOne('api/customer').flush({ data: customers });
    await fixture.whenStable();
  });

  it('should render the customers loaded from the backend', () => {
    expect(items().length).toBe(3);
    expect(items()[1].textContent).toContain('Lisa');
    expect(items()[1].textContent).toContain(': Springfield');
    expect(items()[2].textContent).not.toContain(':');
  });

  it('should mark discontinued customers', () => {
    expect(items().filter(li => li.classList.contains('discontinued')).length).toBe(1);
  });

  it('should emit and highlight the clicked customer', async () => {
    const selected: unknown[] = [];
    component.customerSelected.subscribe(customer => selected.push(customer));

    items()[0].click();
    await fixture.whenStable();

    expect(selected.length).toBe(1);
    expect(items()[0].classList.contains('selected')).toBe(true);
  });

  it('should filter by first name', async () => {
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    input.value = 'li';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(items().length).toBe(1);
    expect(items()[0].textContent).toContain('Lisa');
  });

  it('should clear the filter and focus the input', async () => {
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    input.value = 'li';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();
    await fixture.whenStable();

    expect(items().length).toBe(3);
    expect(document.activeElement).toBe(input);
  });
});
