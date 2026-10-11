import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { CUSTOMER2 } from '../customer.mock';
import { CustomerDetailsComponent } from './customer-details.component';

describe('CustomerDetailsComponent', () => {
  let fixture: ComponentFixture<CustomerDetailsComponent>;
  let component: CustomerDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailsComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailsComponent);
    component = fixture.componentInstance;
    // Der Mock-Service liefert CUSTOMER2 (Hans Meyer) synchron
    fixture.componentRef.setInput('id', CUSTOMER2.id);
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
    expect(input('firstname').value).toBe('Hans');
    expect(input('lastname').value).toBe('Meyer');
    expect(input('zip').value).toBe('11111');
  });

  it('should edit a copy and leave the loaded customer untouched', async () => {
    await type('firstname', 'Maggie');

    expect(component.draft()?.firstname).toBe('Maggie');
    expect(component.customer()?.firstname).toBe('Hans');
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

  it('should report the form state', async () => {
    const text = () => (fixture.nativeElement as HTMLElement).textContent;
    expect(text()).toContain('gültig');

    await type('lastname', '');

    expect(text()).toContain('ungültig');
  });

  it('should navigate back to the list', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    component.goBack();

    expect(navigate).toHaveBeenCalledWith(['/customer']);
  });
});
