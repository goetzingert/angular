import { Component, Input, OnInit } from '@angular/core';
import { Training } from '../training.model';

@Component({
  selector: 'training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
})
export class TrainingListComponent implements OnInit {

  private selectedTraining : Training | undefined;
  @Input() trainings : Training[] = [];
  constructor(){
    
  }

  ngOnInit(): void {
  }

  listItemClicked(event: MouseEvent, training: Training){
    this.selectedTraining = training;
    console.log(event, training);
  }

}
