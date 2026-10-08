import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {Training} from '../training.model';
import {TrainingService} from '../training.service';

@Component({
  selector: 'training-list',
  standalone:false,
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
})
export class TrainingListComponent implements OnInit, OnDestroy {

  private selectedTraining : Training | undefined;
  trainings : Training[] | undefined;
  @Output() trainingSelected : EventEmitter<Training> = new EventEmitter<Training>();
  subscription: any;
  trainingObservable: Subscription | undefined;
  constructor(private readonly trainingService : TrainingService){

  }
  ngOnDestroy(): void {
    this.trainingObservable?.unsubscribe();
  }

  ngOnInit(): void {
    this.trainingObservable = this.trainingService.getAll().subscribe(listeTrainings =>
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
