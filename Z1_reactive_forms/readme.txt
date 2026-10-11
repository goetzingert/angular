Wahlübung Z1: Reactive Forms (eigenständiges Wahlthema)

Dieser Ordner ist die frühere Übung 22 ("Formulare mit FormBuilder und Validierung").
Im Hauptpfad wird das Formular seit Übung 22 als einfaches Template-Driven Form
(FormsModule/ngModel) umgesetzt; Reactive Forms sind hier als Wahlthema abgelegt.

Aufbauend auf: dem Stand von Übung 21 (21_dynamic_routes). Der Ordner enthält den Code der alten
Übung 22 unverändert: ReactiveFormsModule und FormBuilder mit den Feldern des Kunden
(Aufgaben 1-2). Die Validierung (Validators.required/pattern, Fehlermeldungen; Aufgaben 3-5)
ist im Code NICHT enthalten, sie ist der Teil der Wahlübung zum Selbermachen.
Der Ordner ist KEINE Basis für Übung 23 ff. (dort wird mit dem Template-Driven Form aus
22_forms weitergearbeitet).

Starten:
  cd invoice-app
  npm install
  ng serve          (Mock-Daten, kein Backend nötig)
  ng test           (Vitest)
