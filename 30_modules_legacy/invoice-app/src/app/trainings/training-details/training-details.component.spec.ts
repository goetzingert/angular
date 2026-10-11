import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrainingsModule } from '../trainings.module';
import { TrainingDetailsComponent } from './training-details.component';

describe('TrainingDetailsComponent', () => {
  let fixture: ComponentFixture<TrainingDetailsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TrainingDetailsComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should patch the form with the loaded training', () => {
    httpMock.expectOne('api/training').flush({ data: [] });
    // Beachte: Die Komponente und die async-Pipe abonnieren beide training$, daher gehen zwei Requests raus.
    const requests = httpMock.match('api/training/1');
    expect(requests.length).toBe(2);
    requests.forEach(request => request.flush({ data: { id: 1, name: 'Angular', description: 'Kurs' } }));

    expect(fixture.componentInstance.trainingForm.value).toEqual({ name: 'Angular', description: 'Kurs' });
  });
});
