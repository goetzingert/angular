import { Component } from '@angular/core';
import { Training } from './trainings/training.model';
import { TrainingService } from './trainings/training.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'training-manager-app';

  public trainingsMockList : Training[];
  public selectedTraining: Training | undefined;
  constructor(private readonly trainingService : TrainingService){
    this.trainingsMockList = trainingService.getAll();
  }

  newTrainingSelected(selectedTraining : Training){
    this.selectedTraining = selectedTraining;
    console.log(selectedTraining);
  }
}
