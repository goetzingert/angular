import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingListComponent } from './training-list/training-list.component';
import { TrainingDetailsComponent } from './training-details/training-details.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TrainingListComponent,
    TrainingDetailsComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [
    TrainingListComponent,
    TrainingDetailsComponent
  ]
})
export class TrainingsModule { }
