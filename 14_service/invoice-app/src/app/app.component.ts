import { Component } from '@angular/core';
import { Training } from './trainings/training.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';

  public trainingsMockList : Training[];
  public selectedTraining: Training | undefined;
  constructor(){
    this.trainingsMockList = [new Training("Angular Grundkurs", undefined, "assets/images/trainings/angularjs-shield.svg",true)
      ,
      new Training("Angular Fortgeschrittene", "Mehr als im Grundkurs", "assets/images/trainings/angular2-shield.svg",false),
      new Training("Typescript", "Javascript nur Besser", "assets/images/trainings/typescript-logo.svg",false)];

  }

  newTrainingSelected(selectedTraining : Training){
    this.selectedTraining = selectedTraining;
    console.log(selectedTraining);
  }
}
