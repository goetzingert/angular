import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Training } from './trainings/training.model';
import { TrainingService } from './trainings/training.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'training-manager-app';

  public trainingsMockList$ : Observable<Training[]>;
  public selectedTraining: Training | undefined;
  constructor(private readonly trainingService : TrainingService){
    this.trainingsMockList$ = this.trainingService.getAll();

  }

  newTrainingSelected(selectedTraining : Training){
    this.selectedTraining = selectedTraining;
    console.log(selectedTraining);
    
  }
  public ngOnInit(){
   
  }
}
