import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';


export const routes : Routes = [
  {path:"customer" , component:CustomerListComponent},//localhost../customer
  {path:"customer/:id" , component:CustomerDetailsComponent},//localhost../customer
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
