import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Training } from '../training.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
})
export class TrainingListComponent implements OnInit {

  private selectedTraining : Training | undefined;
  trainings : Training[] | undefined;
  @Output() trainingSelected : EventEmitter<Training> = new EventEmitter<Training>();
  subscription: any;
  trainingObservable: Observable<Training[]> | undefined;
  constructor(private readonly trainingService : TrainingService){
    
  }

  ngOnInit(): void {
    this.trainingObservable = this.trainingService.getAll();
    this.trainingObservable.subscribe(listeTrainings => 
      {this.trainings = listeTrainings;})
    }

  listItemClicked(event: MouseEvent, training: Training){
    this.selectedTraining = training;
    this.trainingSelected.emit(this.selectedTraining);
  }

  isSelectedTraining(training:Training) : boolean{
    return this.selectedTraining === training;
  }

}
