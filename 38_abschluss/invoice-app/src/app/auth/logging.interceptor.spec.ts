import { TestBed } from '@angular/core/testing';
import type { MockInstance } from 'vitest';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { loggingInterceptor } from './logging.interceptor';

describe('loggingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let log: MockInstance<typeof console.log>;

  const SECRET = 'Bearer geheimes-token-123';

  const loggedText = () => log.mock.calls.map(args => args.map(arg => String(arg)).join(' ')).join('\n');

  beforeEach(() => {
    log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([loggingInterceptor])), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => log.mockRestore());

  it('should log method and url of a successful request', () => {
    http.get('api/customer').subscribe();
    httpMock.expectOne('api/customer').flush({ data: [] });

    expect(loggedText()).toContain('GET api/customer gestartet');
    expect(loggedText()).toContain('GET api/customer erfolgreich');
  });

  it('should log the status of a failed request', () => {
    http.get('api/customer').subscribe({ error: () => undefined });
    httpMock.expectOne('api/customer').flush('nope', { status: 500, statusText: 'Server Error' });

    expect(loggedText()).toContain('fehlgeschlagen (Status 500');
  });

  it('should never log the Authorization header', () => {
    http.get('api/customer', { headers: { Authorization: SECRET } }).subscribe();
    httpMock.expectOne('api/customer').flush({ data: [] });

    expect(loggedText()).not.toContain('geheimes-token-123');
    expect(loggedText()).not.toContain('Authorization');
  });

  it('should not log the Authorization header on errors either', () => {
    http.get('api/customer', { headers: { Authorization: SECRET } }).subscribe({ error: () => undefined });
    httpMock.expectOne('api/customer').flush('nope', { status: 401, statusText: 'Unauthorized' });

    expect(loggedText()).not.toContain('geheimes-token-123');
    expect(loggedText()).not.toContain('Authorization');
  });

  it('should not log request or response bodies', () => {
    http.post('api/customer', { lastname: 'Streng-Geheim' }).subscribe();
    httpMock.expectOne('api/customer').flush({ data: { lastname: 'Streng-Geheim' } });

    expect(loggedText()).not.toContain('Streng-Geheim');
  });
});
