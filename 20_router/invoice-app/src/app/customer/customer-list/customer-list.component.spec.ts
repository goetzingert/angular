import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerListComponent } from './customer-list.component';

describe('CustomerListComponent', () => {
  let fixture: ComponentFixture<CustomerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListComponent);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
