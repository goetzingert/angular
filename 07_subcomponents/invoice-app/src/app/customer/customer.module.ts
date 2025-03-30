import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingListComponent } from './customer-list/customer-list.component';



@NgModule({
  declarations: [
    TrainingListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TrainingListComponent
  ]
})
export class CustomerModule { }
