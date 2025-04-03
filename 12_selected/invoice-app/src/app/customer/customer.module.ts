import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';



@NgModule({
  declarations: [
    CustomerListComponent, CustomerDetailsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomerListComponent, CustomerDetailsComponent
  ]
})
export class CustomerModule { }
