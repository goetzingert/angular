import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFilterComponent } from './customer-filter.component';

describe('CustomerFilterComponent', () => {
  let fixture: ComponentFixture<CustomerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFilterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFilterComponent);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
