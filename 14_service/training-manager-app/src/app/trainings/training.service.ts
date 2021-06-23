import { Injectable } from '@angular/core';
import { trainingsMockList } from './training.mock';
import { Training } from './training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor() { }

  public getAll() : Training[]{
    return trainingsMockList;
  }
}
