import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should have as title 'invoice-app'", () => {
    expect(fixture.componentInstance.title).toEqual('invoice-app');
  });

  it('should render the heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Invoice Manager App');
  });

  it('should offer navigation to the customer list and the dashboard', () => {
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('nav a'));

    expect(links.map(link => link.getAttribute('href'))).toEqual(['/customer', '/dashboard']);
  });
});
