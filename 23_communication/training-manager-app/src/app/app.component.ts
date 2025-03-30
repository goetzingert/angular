import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Training } from './trainings/training.model';
import { TrainingService } from './trainings/training.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'training-manager-app';
  public nextTraining?: Training;

	constructor(private trainingService: TrainingService) {
		trainingService.getNext().subscribe((nextTr)=> {
			this.nextTraining = nextTr;
		});
	}
}
