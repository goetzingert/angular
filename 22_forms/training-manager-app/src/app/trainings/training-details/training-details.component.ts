import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Training } from '../training.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.css']
})
export class TrainingDetailsComponent implements OnInit {

  public training: Training | undefined;
  public training$: Observable<Training> | undefined;
  public trainingForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
    private trainingService: TrainingService,
    private fb: FormBuilder) {
    this.trainingForm = this.fb.group({
      name:[''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this.getTrainingById(params['id']);
      }
    )
  }
  getTrainingById(id: string) {
    this.training$ = this.trainingService.getById(parseInt(id))
    this.training$.subscribe(training => {
      this.training = training;

      if (this.training) {
        console.log("Pathc it", this.training);
        this.trainingForm.patchValue(this.training);

      }
    });
  }

}
