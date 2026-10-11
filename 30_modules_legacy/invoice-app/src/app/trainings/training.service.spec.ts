import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TrainingService } from './training.service';

describe('TrainingService', () => {
  let service: TrainingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // TrainingService ist nur im TrainingsModule registriert, daher hier explizit.
      providers: [TrainingService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TrainingService);
    httpMock = TestBed.inject(HttpTestingController);
    // Der Konstruktor laedt die Liste sofort
    httpMock.expectOne('api/training').flush({ data: [] });
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map nextRun from string to Date in getById', () => {
    let result: Date | undefined;
    service.getById(1).subscribe(training => (result = training.nextRun));

    httpMock.expectOne('api/training/1').flush({ data: { id: 1, name: 'Angular', nextRun: '2030-01-02T00:00:00.000Z' } });

    expect(result).toBeInstanceOf(Date);
  });
});
