import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Customer } from '../customer.model';

// Darstellungskomponente für eine Zeile der Kundenliste.
// Der Selektor ist ein Attribut-Selektor auf li, damit im Elternteil weiterhin
// ein gültiges <ul><li>-Gerüst entsteht: <li customer-list-item [customer]="..."></li>
@Component({
  selector: 'li[customer-list-item]',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-list-item.component.html',
  styleUrls: ['./customer-list-item.component.css'],
  host: {
    '[class.discontinued]': 'customer().discontinued',
    '[class.selected]': 'selected()',
    '(click)': 'chosen.emit(customer())'
  }
})
export class CustomerListItemComponent {

  customer = input.required<Customer>();
  selected = input(false);
  chosen = output<Customer>();
}
