import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrentActiveCustomersPipe } from '../current-active-customers-pipe';
import { CustomerStore } from '../customer.store';

const ACTIVE_DAYS = 7;
const UNKNOWN_CITY = 'Unbekannt';

// Kunden-Dashboard: Alle Kennzahlen sind computed-Signals, die aus dem CustomerStore abgeleitet werden.
// Die Komponente hält keinen eigenen Zustand und enthält keine HTTP-Aufrufe.
@Component({
  selector: 'customer-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent {

  protected readonly store = inject(CustomerStore);

  // Die vorhandene Pipe-Logik wird wiederverwendet (die Pipe ist eine reine Funktion ohne Abhängigkeiten).
  private readonly currentActive = new CurrentActiveCustomersPipe();

  readonly total = computed(() => this.store.customers().length);

  readonly activeLast7Days = computed(() =>
    this.store.customers().filter(customer => this.currentActive.transform(customer.lastOrderDate, ACTIVE_DAYS)).length
  );

  // Kunden pro Stadt, absteigend nach Anzahl, bei Gleichstand alphabetisch
  readonly customersPerCity = computed(() => {
    const counts = new Map<string, number>();
    for (const customer of this.store.customers()) {
      const city = customer.city?.trim() || UNKNOWN_CITY;
      counts.set(city, (counts.get(city) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
  });

  constructor() {
    this.store.load();
  }
}
