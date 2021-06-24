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

  public trainingsMockList$ : Observable<Training[]> | undefined;
  public selectedTraining: Training | undefined;
  constructor(private readonly trainingService : TrainingService){
   

  }

  newTrainingSelected(selectedTraining : Training){
    this.selectedTraining = selectedTraining;
    console.log(selectedTraining);
    
  }
  public ngOnInit(){
    this.trainingsMockList$ = this.trainingService.getAll();
    this.trainingsMockList$.subscribe(data =>
      console.log(data));
  }
}
