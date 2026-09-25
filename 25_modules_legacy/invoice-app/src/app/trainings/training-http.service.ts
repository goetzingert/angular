import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Training } from './training.model';
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
@Injectable()
export class TrainingService {

  trainingsSubject : ReplaySubject<Training[]>;
  constructor(private httpClient : HttpClient) {
    this.trainingsSubject = new ReplaySubject<Training[]>()

  }

  public getAll() : Observable<Training[]> {
   return this.httpClient.get<ResponseArray>("api/training").pipe(map(
     object => object.data.map(training => this.mapNextRun(training))
   ));
  }

  getById(id: number): Observable<Training>{
    return this.httpClient.get<Response>("api/training/"+id)
    .pipe(map(object => this.mapNextRun(<Training>object.data)));
  }

  insert(training: Training){
    this.httpClient.post("api/training",training);
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
