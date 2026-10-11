import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Customer } from './customer.model';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify()); // schlägt fehl, wenn ein Request offen geblieben ist

  it('should load all customers and convert lastOrderDate to a Date', () => {
    let result: Customer[] = [];
    service.getAll().subscribe(customers => (result = customers));

    httpMock.expectOne('api/customer').flush({
      data: [{ id: '1', firstname: 'Lisa', lastname: 'Simpson', lastOrderDate: '2026-03-15T00:00:00.000Z' }]
    });

    expect(result.length).toBe(1);
    expect(result[0].lastOrderDate).toBeInstanceOf(Date);
    expect(result[0].lastOrderDate?.toISOString()).toBe('2026-03-15T00:00:00.000Z');
  });

  it('should keep customers without lastOrderDate untouched', () => {
    let result: Customer[] = [];
    service.getAll().subscribe(customers => (result = customers));

    httpMock.expectOne('api/customer').flush({ data: [{ id: '2', firstname: 'Burns', lastname: 'Montgomery' }] });

    expect(result[0].lastOrderDate).toBeUndefined();
  });

  it('should load one customer by id', () => {
    let result: Customer | undefined;
    service.getById('1').subscribe(customer => (result = customer));

    httpMock.expectOne('api/customer/1').flush({ data: { id: '1', firstname: 'Lisa', lastname: 'Simpson' } });

    expect(result?.firstname).toBe('Lisa');
  });

  it('should encode the id before it becomes part of the url', () => {
    service.getById('1/../admin').subscribe();

    httpMock.expectOne('api/customer/1%2F..%2Fadmin').flush({ data: { id: '1', firstname: 'x', lastname: 'y' } });
  });

  it('should send the customer with PUT when updating', () => {
    const customer = { ...new Customer('Lisa', 'Simpson'), id: '1' };
    service.update(customer).subscribe();

    const request = httpMock.expectOne('api/customer/1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(customer);
    request.flush({ data: customer });
  });

  it('should propagate server errors', () => {
    let status = 0;
    service.getAll().subscribe({ error: error => (status = error.status) });

    httpMock.expectOne('api/customer').flush('Fehler', { status: 500, statusText: 'Server Error' });

    expect(status).toBe(500);
  });
});
