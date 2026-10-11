import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFilterComponent } from './customer-filter.component';

describe('CustomerFilterComponent', () => {
  let fixture: ComponentFixture<CustomerFilterComponent>;

  const input = () => (fixture.nativeElement as HTMLElement).querySelector('input')!;
  const button = () => (fixture.nativeElement as HTMLElement).querySelector('button')!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFilterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFilterComponent);
    await fixture.whenStable();
  });

  it('should show the given value', async () => {
    fixture.componentRef.setInput('value', 'lisa');
    await fixture.whenStable();

    expect(input().value).toBe('lisa');
  });

  it('should emit the typed text', () => {
    const changed: string[] = [];
    fixture.componentInstance.changed.subscribe(text => changed.push(text));

    input().value = 'han';
    input().dispatchEvent(new Event('input'));

    expect(changed).toEqual(['han']);
  });

  it('should emit cleared and focus the input when the button is clicked', () => {
    const cleared = vi.fn();
    fixture.componentInstance.cleared.subscribe(cleared);

    button().click();

    expect(cleared).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input());
  });
});
