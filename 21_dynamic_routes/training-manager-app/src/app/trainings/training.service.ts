import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { TRAININGS1, TRAININGS2, TRAININGS3} from './training.mock';
import { Training } from './training.model';

@Injectable()
export class TrainingService {
  
  trainingsSubject : ReplaySubject<Training[]>;
  constructor() { 
    this.trainingsSubject = new ReplaySubject<Training[]>()
    
  }

  public getAll() : Observable<Training[]>{
    setTimeout(() => {
      this.trainingsSubject.next(TRAININGS1);
    },3000);
    setTimeout(() => {
      this.trainingsSubject.next(TRAININGS2);
    },5000);
    setTimeout(() => {
      this.trainingsSubject.next(TRAININGS3);
    },8000);
    return this.trainingsSubject.asObservable();
  }

  getById(id: number): Training | undefined {
    return TRAININGS3.find(tra => tra.id === id );
    /*for (let index = 0; index < TRAININGS3.length; index++) {
      const element = TRAININGS3[index];
      if(element.id ===  id)
        return element;
    }
    return undefined;*/
  }
}
