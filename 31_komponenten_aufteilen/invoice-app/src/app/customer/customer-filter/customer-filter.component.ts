import { Component, ElementRef, input, output, viewChild } from '@angular/core';

// Darstellungskomponente: kennt weder Kundendaten noch Services.
// Sie bekommt den Text per input() und meldet Änderungen per output() nach oben.
@Component({
  selector: 'customer-filter',
  standalone: true,
  templateUrl: './customer-filter.component.html'
})
export class CustomerFilterComponent {

  value = input('');
  changed = output<string>();
  cleared = output<void>();

  // Der Fokus-Mechanismus (viewChild) ist mit dem Eingabefeld hierher gewandert.
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  onInput(event: Event): void {
    this.changed.emit((event.target as HTMLInputElement).value);
  }

  clear(): void {
    this.cleared.emit();
    this.searchInput()?.nativeElement.focus();
  }
}
