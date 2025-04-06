import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';


export const routes : Routes = [
  {path:"customer" , component:CustomerListComponent},//localhost../customer
  {path:"**", redirectTo:"/customer"}//localhost:4200/ --> localhost:4200/customer
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
