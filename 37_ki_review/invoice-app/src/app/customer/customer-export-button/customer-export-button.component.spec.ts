import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Customer } from '../customer.model';
import { CustomerExportButtonComponent } from './customer-export-button.component';

describe('CustomerExportButtonComponent', () => {
  let fixture: ComponentFixture<CustomerExportButtonComponent>;
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.spyOn>;
  let downloadName: string | undefined;

  const el = () => fixture.nativeElement as HTMLElement;
  const button = () => el().querySelector('button')!;

  const hans = { ...new Customer('Hans', 'Meyer', undefined, undefined, 'Berlin, Mitte'), id: '1' };
  const lisa = { ...new Customer('Lisa', 'Simpson'), id: '2' };

  beforeEach(async () => {
    // jsdom kennt URL.createObjectURL nicht und kann keine Downloads ausführen: beides ersetzen
    createObjectURL = vi.fn(() => 'blob:test');
    revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true, writable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true, writable: true });
    downloadName = undefined;
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloadName = this.download;
    });

    await TestBed.configureTestingModule({
      imports: [CustomerExportButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerExportButtonComponent);
    fixture.componentRef.setInput('customers', [hans, lisa]);
    await fixture.whenStable();
  });

  afterEach(() => clickSpy.mockRestore());

  it('should download the customers as a csv file', async () => {
    button().click();
    await fixture.whenStable();

    expect(downloadName).toBe('kunden.csv');
    const blob = createObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('text/csv;charset=utf-8');
    const text = await blob.text();
    expect(text).toContain('id,firstname,lastname,street,zip,city,lastOrderDate');
    expect(text).toContain('1,Hans,Meyer,,,"Berlin, Mitte",');
    expect(text).toContain('2,Lisa,Simpson');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');
  });

  it('should show how many customers were exported as plain text', async () => {
    expect(el().querySelector('.export-info')).toBeNull();

    button().click();
    await fixture.whenStable();

    expect(el().querySelector('.export-info')?.textContent).toContain('2 Kunden exportiert');
  });

  it('should be disabled when there is nothing to export', async () => {
    fixture.componentRef.setInput('customers', []);
    await fixture.whenStable();

    expect(button().disabled).toBe(true);
  });
});
