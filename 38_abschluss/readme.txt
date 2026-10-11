Startanleitung

1. Backend starten (Ordner server/ im Repo-Wurzelverzeichnis, einmalig npm install):
     cd server
     npm install
     node server.js          (läuft auf http://localhost:3000)

2. App starten (im Ordner invoice-app):
     npm install
     ng serve --proxy-config dev.proxy.json
   Aufruf im Browser: http://localhost:4200  (zuerst "Einloggen")

3. Tests ausführen (Vitest):
     ng test

4. Neu in Übung 38: Dashboard unter http://localhost:4200/dashboard (Link "Dashboard" im Kopfbereich).
