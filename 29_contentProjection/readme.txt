Startanleitung

1. Backend starten (Ordner server/ im Repo-Wurzelverzeichnis, einmalig npm install):
     cd server
     npm install
     node server.js          (läuft auf http://localhost:3000)

2. App starten (im Ordner invoice-app):
     npm install
     ng serve --proxy-config dev.proxy.json
   Aufruf im Browser: http://localhost:4200

3. Tests ausführen (Vitest):
     ng test
