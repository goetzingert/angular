Der Fehler lag im html file der details Compoenent. 
Da hab ich bei den input Feldern formGroupName statt formControlName geschrieben.

Daher das Problem. 

Ich hab noch ein paar Sachen umgebaut, und http hinterlegt. 

Anstarten bitte mit:  ng serve --proxy-config dev.proxy.json
Vorher im server Verzeichnis npm install und danach node server.js
