import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Customer } from '../customer.model';
import { toCsv } from '../export/customer-csv';

// Button, der die übergebenen Kunden als CSV-Datei herunterlädt.
@Component({
  selector: 'customer-export-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-export-button.component.html'
})
export class CustomerExportButtonComponent {

  customers = input.required<readonly Customer[]>();

  // Anzahl der zuletzt exportierten Kunden (undefined = noch nichts exportiert)
  exportedCount = signal<number | undefined>(undefined);

  export(): void {
    const customers = this.customers();
    // BOM (﻿), damit Excel die Datei als UTF-8 erkennt (Umlaute)
    const blob = new Blob(['﻿' + toCsv(customers)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'kunden.csv';
    link.click();

    URL.revokeObjectURL(url);
    this.exportedCount.set(customers.length);
  }
}
