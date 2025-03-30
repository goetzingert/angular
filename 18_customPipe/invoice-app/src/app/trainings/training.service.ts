import { Injectable } from '@angular/core';
import { TRAININGS } from './training.mock';
import { Training } from './training.model';

@Injectable()
export class TrainingService {

  constructor() { }

  public getAll() : Training[]{
    return TRAININGS;
  }
}
