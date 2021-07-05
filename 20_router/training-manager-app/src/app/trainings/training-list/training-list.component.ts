import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Training } from '../training.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
})
export class TrainingListComponent implements OnInit, OnDestroy {

  private selectedTraining: Training | undefined;
  trainings: Training[] | undefined;
  @Output() trainingSelected: EventEmitter<Training> = new EventEmitter<Training>();
  subscription: any;
  trainingObservable: Subscription | undefined;
  constructor(private readonly trainingService: TrainingService, readonly router: Router) {

  }
  ngOnDestroy(): void {
    this.trainingObservable?.unsubscribe();
  }

  ngOnInit(): void {
    this.trainingObservable = this.trainingService.getAll().subscribe(listeTrainings => { this.trainings = listeTrainings; })
  }

  listItemClicked(event: MouseEvent, training: Training) {
    this.selectedTraining = training;
    this.trainingSelected.emit(this.selectedTraining);
    this.router.navigate([this.selectedTraining.id])//trainings/5
  }

  isSelectedTraining(training: Training): boolean {
    return this.selectedTraining === training;
  }

}
