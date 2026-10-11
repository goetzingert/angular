Übung 22: Kunde bearbeiten (Template-Driven Form)

Dieser Stand arbeitet noch mit Mock-Daten (CustomerService). Ein Backend wird erst ab Übung 23 benötigt.

Starten (im Ordner invoice-app):
  npm install
  ng serve
  ng test          (Vitest)

Ab Übung 23 (HTTP-Anbindung) zusätzlich:
  1. Backend im Ordner server/ (Repo-Wurzel) starten:
       cd server
       npm install
       node server.js       (läuft auf http://localhost:3000)
  2. App mit Proxy starten:
       ng serve --proxy-config dev.proxy.json
