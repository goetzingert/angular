import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '../customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  @Input() public customer : Customer | undefined;
  public customerForm: FormGroup;
  

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly customerService: CustomerService, private readonly router: Router,  private fb: UntypedFormBuilder) {
      this.customerForm = this.fb.group({
        firstname:[''],
        lastname: [''],
        street: [''],
        city: [''],
        zip: [''],
        lastOrderDate: [new Date().toISOString().substring(0, 10)],
      });}


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this.getCustomerById(params['id']);
      }
    )
  }
  getCustomerById(id:string) {
    this.customer = this.customerService.getById(id);
    if (this.customer) {
      console.log("Patch it", this.customer);
      this.customerForm.patchValue(this.customer);
      this.customerForm.patchValue({lastOrderDate : this.customer.lastOrderDate?.toISOString().substring(0, 10)});

    }
  }

  goBack() : void{
    this.router.navigate(['/customer']);
  }

}
