import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Training} from '../training.model';
import {TrainingService} from '../training.service';

@Component({
  selector: 'training-details',
  standalone: false,
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.css']
})
export class TrainingDetailsComponent implements OnInit {

  public training: Training | undefined;
  public training$: Observable<Training> | undefined;
  public trainingForm: UntypedFormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private trainingService: TrainingService,
              private fb: UntypedFormBuilder) {
    this.trainingForm = this.fb.group({
      name: [''],
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
