import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '../customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  @Input() public customer : Customer | undefined;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly customerService: CustomerService, private readonly router: Router) { }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this.getCustomerById(params['id']);
      }
    )
  }
  getCustomerById(id:string) {
    this.customer = this.customerService.getById(id);
  }

  goBack() : void{
    this.router.navigate(['/customer']);
  }

}
