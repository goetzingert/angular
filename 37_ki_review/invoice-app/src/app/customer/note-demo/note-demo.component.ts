import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Lehrbeispiel für Übung 36: Drei Arten, eine Kunden-Notiz anzuzeigen.
 *
 *   1. Interpolation {{ }}                 -> sicher: Angular gibt Text aus (escaped)
 *   2. [innerHTML]                         -> Angular bereinigt das HTML (Skripte und Event-Handler fliegen raus)
 *   3. [innerHTML] + bypassSecurityTrustHtml -> BEWUSST UNSICHER, nur als Gegenbeispiel
 *
 * Variante 3 ist keine Empfehlung. Sie ist nur hier, damit man sehen kann, was passiert, wenn man
 * Angulars Schutz aushebelt. Sie ist standardmäßig ausgeschaltet und läuft nur nach Klick auf die Checkbox.
 */
@Component({
  selector: 'note-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './note-demo.component.html'
})
export class NoteDemoComponent {

  note = input<string>();

  // Schalter für die unsichere Variante: standardmäßig AUS
  showUnsafe = signal(false);

  private readonly sanitizer = inject(DomSanitizer);

  // REVIEW-ALARM: bypassSecurityTrustHtml schaltet die Prüfung von Angular für diesen Wert ab.
  // Das ist nur vertretbar für HTML, das wir selbst kontrollieren, NIEMALS für Nutzereingaben
  // oder Daten aus dem Backend. Hier ist es ein bewusst unsicheres Beispiel.
  unsafeNote = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.note() ?? ''));

  toggleUnsafe(event: Event): void {
    this.showUnsafe.set((event.target as HTMLInputElement).checked);
  }
}
