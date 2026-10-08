import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingListComponent } from './trainings/training-list/training-list.component';
import { RouterModule, Routes } from '@angular/router';
import { TrainingDetailsComponent } from './trainings/training-details/training-details.component';


export const routes : Routes = [
  {path:"trainings" , component:TrainingListComponent},//localhost../trainings
  {path:"trainings/:id" , component:TrainingDetailsComponent},//localhost../trainings
  {path:"**", redirectTo:"/trainings"}//localhost:4200/ --> localhost:4200/trainings
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
