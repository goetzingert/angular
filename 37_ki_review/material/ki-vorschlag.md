# Beispielergebnis einer KI (Material für Übung 37)

> Dieses Ergebnis wurde **nicht** von einem Menschen geprüft. Es ist für die Übung vorbereitet und enthält
> absichtlich Fehler. Prüfe es wie ein fremdes Pull Request mit der Review-Checkliste aus Kapitel 7 (Folie 7.5).
> Dokumentiere mindestens fünf Befunde.

## Auftrag (Prompt)

```
Kontext:   Angular 21 App "invoice-app", Feature customer (Liste, Details, CustomerStore mit Signals).
Aufgabe:   Ergänze eine Funktion "Kunden als CSV exportieren" und eine Komponente CustomerExportButton,
           die die angezeigten Kunden als Datei herunterlädt.
Vorgaben:  Standalone-Komponenten, Signals, keine neuen Pakete.
Abnahme:   Button lädt eine CSV-Datei herunter; ein Test ist vorhanden.
```

## Antwort der KI

Ich habe den CSV-Export und eine Button-Komponente ergänzt. Die Komponente zeigt nach dem Klick an,
wie viele Kunden exportiert wurden. Außerdem habe ich einen Test hinzugefügt.

### `customer/customer-export.ts`

```ts
import { Customer } from './customer.model';

export function exportCustomers(customers: any[]): string {
  let csv = 'id,firstname,lastname,street,zip,city,lastOrderDate\n';

  for (const c of customers) {
    csv += c.id + ',' + c.firstname + ',' + c.lastname + ',' + c.street + ',' + c.zip + ',' + c.city + ',' + c.lastOrderDate + '\n';
  }

  return csv;
}
```

### `customer/customer-export-button/customer-export-button.component.ts`

```ts
import { Component, Input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { exportCustomers } from '../customer-export';

@Component({
  selector: 'customer-export-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="export()">CSV exportieren</button>
    <div *ngIf="message()" [innerHTML]="message()"></div>
  `
})
export class CustomerExportButtonComponent {
  @Input() customers: any;

  count = signal(0);
  message = signal('');

  constructor() {
    effect(() => {
      this.count.set(this.customers ? this.customers.length : 0);
    });

    effect(() => {
      this.message.set('<b>' + this.count() + '</b> Kunden exportiert');
    });
  }

  export() {
    const csv = exportCustomers(this.customers);
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + csv;
    link.download = 'kunden.csv';
    link.click();
  }
}
```

### Verwendung in `customer-list.component.html`

```html
<customer-export-button [customers]="store.filtered()"></customer-export-button>
```

### `customer/customer-export-button/customer-export-button.component.spec.ts`

```ts
import { TestBed } from '@angular/core/testing';
import { CustomerExportButtonComponent } from './customer-export-button.component';
import { exportCustomers } from '../customer-export';

describe('CustomerExportButtonComponent', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(CustomerExportButtonComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should export customers', () => {
    const csv = exportCustomers([{ id: '1', firstname: 'Hans', lastname: 'Meyer' }]);
    expect(csv).toBeTruthy();
  });
});
```

Der Export sollte jetzt funktionieren. Ich habe außerdem darauf geachtet, dass die Komponente moderne Angular-Features nutzt.

---

## Aufgabe für dich

1. Lies den Vorschlag und prüfe ihn mit der Checkliste. Dokumentiere mindestens fünf Befunde (Stelle, Problem, Regel).
2. Formuliere einen zweiten Prompt, der die Befunde konkret zurückspielt („Behebe: …“).
3. Prüfe das neue Ergebnis erneut. Was wurde behoben, was ist neu kaputt gegangen?
