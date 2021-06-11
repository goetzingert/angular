import { Component, Input, OnInit } from '@angular/core';
import { Training } from '../training.model';

@Component({
  selector: 'training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
})
export class TrainingListComponent implements OnInit {

  @Input() trainings : Training[] = [];
  constructor(){
    
  }

  ngOnInit(): void {
  }

}
