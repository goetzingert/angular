import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, tap } from "rxjs";
import { Training } from './training';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map} from "rxjs/operators";

interface ResponseArray {
  data:Training[];
}
interface SingleResponse {
  data:Training;
}
interface Response{
  data : any;
}
@Injectable({
  providedIn:"root"
    }
)
export class TrainingHttpService {
  
  trainingsSubject : ReplaySubject<Training[]>;
  constructor(private httpClient : HttpClient) { 
    this.trainingsSubject = new ReplaySubject<Training[]>()
    this.reloadData();
  }

  private reloadData(): void {
    this.httpClient.get<ResponseArray>("api/training").pipe(map(
        object => object.data.map(training => this.mapNextRun(training))
    )).subscribe(trainings => this.trainingsSubject.next(trainings));
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

  update(training: Training){
    return this.httpClient.put<Response>("api/training/" + training.id, training).pipe(tap(() => this.reloadData()),
        map(response =>  this.mapNextRun(<Training>response.data)));

  }
  insert(training: Training){
    return this.httpClient.post<Response>("api/training",training).pipe(tap(() => this.reloadData()),
        map(response =>  this.mapNextRun(<Training>response.data)));
  }
  /**
   * Next Run from server is a string --> Map it to Date
   * @param training 
   * @returns 
   */
  mapNextRun(training: Training): Training {
    if (training.nextRun) {
      training.nextRun = new Date(training.nextRun);

    }
    return training;
  }
}
