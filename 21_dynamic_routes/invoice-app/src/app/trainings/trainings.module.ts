import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingListComponent } from './training-list/training-list.component';
import { TrainingDetailsComponent } from './training-details/training-details.component';
import { FormsModule } from '@angular/forms';
import { TrainingService } from './training.service';
import { TakePlaceSoonPipe } from './take-place-soon.pipe';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TrainingListComponent,
    TrainingDetailsComponent,
    TakePlaceSoonPipe
  ],
  imports: [
    CommonModule, FormsModule, RouterModule
  ],

  providers:[TrainingService],
  exports: [
    TrainingListComponent,
    TrainingDetailsComponent
  ]
})
export class TrainingsModule { }
