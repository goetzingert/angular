import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerService } from './customer.service';



@NgModule({
  declarations: [
    CustomerListComponent, CustomerDetailsComponent
  ],
  imports: [
    CommonModule
  ],
  providers:[CustomerService],
  exports: [
    CustomerListComponent, CustomerDetailsComponent
  ]
})
export class CustomerModule { }
