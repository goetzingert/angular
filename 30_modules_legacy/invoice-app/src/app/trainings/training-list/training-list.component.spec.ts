import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { TrainingsModule } from '../trainings.module';
import { TrainingListComponent } from './training-list.component';

describe('TrainingListComponent', () => {
  let fixture: ComponentFixture<TrainingListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Klassisch deklarierte Komponenten testet man ueber das Modul, das sie deklariert.
    await TestBed.configureTestingModule({
      imports: [TrainingsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TrainingListComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the trainings loaded from the backend', () => {
    httpMock.expectOne('api/training').flush({
      data: [{ id: 1, name: 'Angular' }, { id: 2, name: 'TypeScript', description: 'Grundlagen' }]
    });
    fixture.detectChanges();

    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[1].textContent).toContain('TypeScript');
  });
});
