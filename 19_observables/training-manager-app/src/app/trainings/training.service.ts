import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { TRAININGS } from './training.mock';
import { Training } from './training.model';

@Injectable()
export class TrainingService {
  trainingsSubject : ReplaySubject<Training[]>;
  constructor() { 
    this.trainingsSubject = new ReplaySubject<Training[]>()
    
  }

  public getAll() : Observable<Training[]>{
    setInterval(() => {
      this.trainingsSubject.next(TRAININGS);
    },3000);
    return this.trainingsSubject.asObservable();
  }
}
