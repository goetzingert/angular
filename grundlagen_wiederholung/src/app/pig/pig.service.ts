import { Injectable } from '@angular/core';
import { Training } from "./training";
import { map, Observable, of, ReplaySubject, timeout } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private data : Training[] = [];
  private dataSubject : ReplaySubject<Training[]> = new ReplaySubject<Training[]>()

  constructor() {
    this.data = [
        new Training("Angular Grundlagen",false, "Grundlagen Angular Schulung","assets/images/trainings/angular2-shield.svg"
            ,new Date(2023,11,24)),
      new Training("Typescript",false, undefined,"assets/images/trainings/typescript-logo.svg",new Date(2023,11,23)),
      new Training("Angular JS",true, "Grundlagen Angular JS Schulung","assets/images/trainings/angularjs-shield.svg"
          ,new Date(2022,11,24))
    ]


  }

  public getAll():Observable<Training[]>{
    setTimeout(()=>  this.dataSubject.next(this.data),2000)
    return this.dataSubject.asObservable();

  }

  public getById(id: number): Observable<Training> {
    return of(this.data.filter(tr => tr.id === id)[0]);
  }
}
