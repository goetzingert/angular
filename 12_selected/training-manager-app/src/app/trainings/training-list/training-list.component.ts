import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Training } from '../training.model';

@Component({
  selector: 'training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
})
export class TrainingListComponent implements OnInit {

  private selectedTraining : Training | undefined;
  @Input() trainings : Training[] = [];
  @Output() trainingSelected : EventEmitter<Training> = new EventEmitter<Training>();
  constructor(){
    
  }

  ngOnInit(): void {
  }

  listItemClicked(event: MouseEvent, training: Training){
    this.selectedTraining = training;
    this.trainingSelected.emit(this.selectedTraining);
  }

  isSelectedTraining(training:Training) : boolean{
    return this.selectedTraining === training;
  }


}
