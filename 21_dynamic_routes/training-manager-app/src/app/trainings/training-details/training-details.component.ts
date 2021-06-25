import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Training } from '../training.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.css']
})
export class TrainingDetailsComponent implements OnInit {

  public training: Training | undefined;

  constructor(private activatedRoute: ActivatedRoute,
    private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this.getTrainingById(params['id']);
      }
    )
  }
  getTrainingById(id:string) {
    this.training = this.trainingService.getById(parseInt(id))
  }

}
