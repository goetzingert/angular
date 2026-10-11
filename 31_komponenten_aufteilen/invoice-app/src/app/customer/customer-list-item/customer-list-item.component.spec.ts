import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Customer } from '../customer.model';
import { CustomerListItemComponent } from './customer-list-item.component';

describe('CustomerListItemComponent', () => {
  let fixture: ComponentFixture<CustomerListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListItemComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListItemComponent);
    // customer ist ein Pflicht-Input und muss vor dem ersten Rendern gesetzt werden
    fixture.componentRef.setInput('customer', new Customer('Hans', 'Meyer'));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
