import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDemoComponent } from './note-demo.component';

describe('NoteDemoComponent', () => {
  let fixture: ComponentFixture<NoteDemoComponent>;

  const el = () => fixture.nativeElement as HTMLElement;
  const attack = `<b>wichtig</b> <img src=x onerror="window.xss = true">`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteDemoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NoteDemoComponent);
    fixture.componentRef.setInput('note', attack);
    await fixture.whenStable();
  });

  it('should show the note as plain text with interpolation', () => {
    const text = el().querySelector('.note-text')!;

    expect(text.textContent).toBe(attack);
    expect(text.querySelector('b')).toBeNull();
    expect(text.querySelector('img')).toBeNull();
  });

  it('should sanitize the note with innerHTML: formatting stays, event handlers go', () => {
    const sanitized = el().querySelector('.note-sanitized')!;

    expect(sanitized.querySelector('b')?.textContent).toBe('wichtig');
    expect(sanitized.querySelector('img')?.hasAttribute('onerror')).toBe(false);
  });

  it('should not render the unsafe variant by default', () => {
    expect(el().querySelector('.note-unsafe')).toBeNull();
  });

  it('should keep the event handler when Angular is bypassed (why bypassSecurityTrustHtml is dangerous)', async () => {
    el().querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
    await fixture.whenStable();

    expect(el().querySelector('.note-unsafe img')?.getAttribute('onerror')).toBe('window.xss = true');
  });
});
