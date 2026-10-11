import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Customer } from '../customer.model';

// Darstellungskomponente für eine Zeile der Kundenliste.
// Der Selektor ist ein Attribut-Selektor, damit die Zeile in beliebigen Elementen stecken kann,
// z. B. <div customer-list-item [customer]="..."></div> innerhalb des Virtual-Scroll-Viewports.
@Component({
  selector: '[customer-list-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-list-item.component.html',
  styleUrls: ['./customer-list-item.component.css'],
  host: {
    'role': 'listitem',
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
