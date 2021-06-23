import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingListComponent } from './training-list/training-list.component';
import { TrainingDetailsComponent } from './training-details/training-details.component';
import { FormsModule } from '@angular/forms';
import { TrainingService } from './training.service';



@NgModule({
  declarations: [
    TrainingListComponent,
    TrainingDetailsComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],

  providers:[TrainingService],
  exports: [
    TrainingListComponent,
    TrainingDetailsComponent
  ]
})
export class TrainingsModule { }
