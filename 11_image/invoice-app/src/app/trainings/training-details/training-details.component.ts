import { Component, Input, OnInit } from '@angular/core';
import { Training } from '../training.model';

@Component({
  selector: 'training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.css']
})
export class TrainingDetailsComponent implements OnInit {

  @Input() public training : Training | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
