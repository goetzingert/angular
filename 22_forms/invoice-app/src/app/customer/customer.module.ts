import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerService } from './customer.service';
import { CurrentActiveCustomersPipe } from './current-active-customers-pipe';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CustomerListComponent, CustomerDetailsComponent, CurrentActiveCustomersPipe
  ],
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule
  ],
  providers:[CustomerService],
  exports: [
    CustomerListComponent, CustomerDetailsComponent
  ]
})
export class CustomerModule { }
