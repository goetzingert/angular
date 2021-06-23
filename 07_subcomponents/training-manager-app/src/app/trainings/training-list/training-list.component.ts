import { Component, OnInit } from '@angular/core';
import { Training } from '../training.model';

@Component({
  ',selector: 'training-list
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
})
export class TrainingListComponent implements OnInit {

  trainings : Training[];
  constructor(){
    this.trainings = [new Training("Angular Grundkurs")
    ,
    new Training("Angular Fortgeschrittene", "Mehr als im Grundkurs")];
  }

  ngOnInit(): void {
  }

}
