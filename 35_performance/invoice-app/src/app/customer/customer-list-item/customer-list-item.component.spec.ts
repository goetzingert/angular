import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Customer } from '../customer.model';
import { CustomerListItemComponent } from './customer-list-item.component';

describe('CustomerListItemComponent', () => {
  let fixture: ComponentFixture<CustomerListItemComponent>;

  const el = () => fixture.nativeElement as HTMLElement;

  // Signal-Inputs setzt man in Tests über componentRef.setInput
  async function render(customer: Customer, selected = false): Promise<void> {
    fixture.componentRef.setInput('customer', customer);
    fixture.componentRef.setInput('selected', selected);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListItemComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListItemComponent);
  });

  it('should show the first name and the city', async () => {
    await render(new Customer('Hans', 'Meyer', 'Hauptstraße 21', '11111', 'Teststadt'));

    expect(el().textContent).toContain('Hans');
    expect(el().textContent).toContain(': Teststadt');
  });

  it('should omit the separator when there is no city', async () => {
    await render(new Customer('Silke', 'Mueller'));

    expect(el().textContent).toContain('Silke');
    expect(el().textContent).not.toContain(':');
  });

  it('should link to the details of the customer', async () => {
    const customer = new Customer('Hans', 'Meyer');
    await render(customer);

    expect(el().querySelector('a')?.getAttribute('href')).toBe('/' + customer.id);
  });

  it('should emit the customer when it is clicked', async () => {
    const customer = new Customer('Hans', 'Meyer');
    await render(customer);
    const chosen: Customer[] = [];
    fixture.componentInstance.chosen.subscribe(value => chosen.push(value));

    el().click();

    expect(chosen).toEqual([customer]);
  });

  it('should mark discontinued customers', async () => {
    await render(new Customer('Hans', 'Meyer', undefined, undefined, undefined, undefined, true));

    expect(el().classList).toContain('discontinued');
  });

  it('should mark the selected customer', async () => {
    await render(new Customer('Hans', 'Meyer'), true);
    expect(el().classList).toContain('selected');

    await render(new Customer('Hans', 'Meyer'), false);
    expect(el().classList).not.toContain('selected');
  });
});
