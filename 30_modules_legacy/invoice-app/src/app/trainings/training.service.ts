import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Training } from './training.model';
import { HttpClient } from "@angular/common/http";
import {map, tap} from "rxjs/operators";


interface ResponseArray {
  data:Training[];
}
interface SingleResponse {
  data:Training;
}
interface Response{
  data : any;
}
@Injectable()
export class TrainingService {

  trainingsSubject : ReplaySubject<Training[]>;
  constructor(private httpClient : HttpClient) {
    this.trainingsSubject = new ReplaySubject<Training[]>()
    this.reloadData().subscribe(trainings => this.trainingsSubject.next(trainings));
  }

  public reloadData() : Observable<Training[]> {
   return this.httpClient.get<ResponseArray>("api/training").pipe(map(
     object => object.data.map(training => this.mapNextRun(training))
   ));
  }

  public getAll() : Observable<Training[]> {
    return this.trainingsSubject.asObservable();
   }


  public getNext(): Observable<Training> {
    return this.getAll().pipe(map(trainings =>
        trainings.slice().sort( (tr1 : Training,tr2: Training)=> {
          if(!tr1.nextRun)
            return 1;
          if(!tr2.nextRun)
            return -1;
          return tr1.nextRun.getTime()  - tr2.nextRun.getTime();
        })[0]));

  }

  getById(id: number): Observable<Training>{
    return this.httpClient.get<Response>("api/training/"+id)
    .pipe(map(object => this.mapNextRun(<Training>object.data)));
  }

  insert(training: Training): Observable<Training>{
    return this.httpClient.post<SingleResponse>("api/training",training).pipe(map(tr => tr.data), tap((tr) => this.mapNextRun(tr)));;
  }

  update(training: Training): Observable<Training>{
    return this.httpClient.put<Response>("api/training/" + training.id, training).pipe(map(tr => tr.data), tap((tr) => this.mapNextRun(tr)));

  }
  /**
   * Next Run from server is a string --> Map it to Date
   * @param training
   * @returns
   */
  mapNextRun(training: Training): Training {
    console.log("Map it")
    if (training.nextRun) {
      training.nextRun = new Date(training.nextRun);

    }
    return training;
  }
}
