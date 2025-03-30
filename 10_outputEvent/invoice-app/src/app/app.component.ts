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
    this.trainingsMockList = [new Training("Angular Grundkurs", "assets/images/")
      ,
      new Training("Angular Fortgeschrittene", "Mehr als im Grundkurs")];

  }

  newTrainingSelected(selectedTraining : Training){
    this.selectedTraining = selectedTraining;
    console.log(selectedTraining);
  }
}
