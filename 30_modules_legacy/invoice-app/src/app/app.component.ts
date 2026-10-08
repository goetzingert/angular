import { Component } from '@angular/core';
import { Training } from './trainings/training.model';
import { TrainingService } from './trainings/training.service';

@Component({
  selector: 'app-root',
  standalone:false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoice-app';
  public nextTraining?: Training;

	constructor(private trainingService: TrainingService) {
		trainingService.getNext().subscribe((nextTr)=> {
			this.nextTraining = nextTr;
		});
	}
}
