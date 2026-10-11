import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';

import { CustomerDetailsComponent } from './customer-details.component';

describe('CustomerDetailsComponent', () => {
  let fixture: ComponentFixture<CustomerDetailsComponent>;
  let component: CustomerDetailsComponent;
  let httpMock: HttpTestingController;

  // So liefert der Server den Kunden (Datum als String)
  const serverCustomer = {
    id: '1', firstname: 'Lisa', lastname: 'Simpson', street: 'Evergreen Terrace 742',
    zip: '12345', city: 'Springfield', discontinued: false, lastOrderDate: '2026-03-15T00:00:00.000Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();

    // Der CustomerService lädt beim Start die Liste, die Komponente den einzelnen Kunden
    httpMock.expectOne('api/customer').flush({ data: [] });
    httpMock.expectOne('api/customer/1').flush({ data: { ...serverCustomer } });
    await fixture.whenStable();
  });

  const input = (name: string) =>
    (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(`input[name="${name}"]`)!;

  async function type(name: string, value: string): Promise<void> {
    const element = input(name);
    element.value = value;
    element.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('should show the loaded customer in the form', () => {
    expect(input('firstname').value).toBe('Lisa');
    expect(input('lastname').value).toBe('Simpson');
    expect(input('zip').value).toBe('12345');
    expect(input('lastOrderDate').value).toBe('2026-03-15');
  });

  it('should edit a copy and leave the loaded customer untouched', async () => {
    await type('firstname', 'Maggie');

    expect(component.draft()?.firstname).toBe('Maggie');
    expect(component.customer()?.firstname).toBe('Lisa');
  });

  it('should show an error when the first name is empty', async () => {
    expect((fixture.nativeElement as HTMLElement).querySelector('.error')).toBeNull();

    await type('firstname', '');

    expect((fixture.nativeElement as HTMLElement).querySelector('.error')?.textContent).toContain('Vornamen');
  });

  it('should only accept digits in the zip code', async () => {
    await type('zip', '12a45');

    expect((fixture.nativeElement as HTMLElement).querySelector('.error')?.textContent).toContain('Ziffern');
  });

  it('should disable the save button while the form is invalid', async () => {
    const save = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(save.disabled).toBe(false);

    await type('lastname', '');

    expect(save.disabled).toBe(true);
  });

  it('should save the edited customer and go back to the list', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await type('firstname', 'Maggie');

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();

    const put = httpMock.expectOne(request => request.method === 'PUT');
    expect(put.request.url).toBe('api/customer/1');
    expect(put.request.body.firstname).toBe('Maggie');
    put.flush({ data: { ...serverCustomer, firstname: 'Maggie' } });
    httpMock.expectOne('api/customer').flush({ data: [] }); // der Service lädt die Liste neu

    expect(navigate).toHaveBeenCalledWith(['/customer']);
  });
});
