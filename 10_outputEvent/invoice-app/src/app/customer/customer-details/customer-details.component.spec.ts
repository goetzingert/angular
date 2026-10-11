import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerDetailsComponent } from './customer-details.component';

describe('CustomerDetailsComponent', () => {
  let fixture: ComponentFixture<CustomerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailsComponent);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
