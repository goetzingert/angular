"use strict";
var randomNumber = Math.floor(Math.random() * 100);
console.log(randomNumber);
//Browser ruft onload funktion auf, wenn HTML Gerüst komplett geparsed
window.onload = function () {
    //1. aus dem document das inputElement holen. input.value --> Number
    var helpSpan = document.getElementById("hint");
    //DOM Button mit der id check
    var button = document.getElementById("check");
    button.addEventListener("click", function (event) {
        console.log("button geklicked");
        //2. Entscheidung zu klein oder zu groß oder richtig
        //if else 
        //innerHtml mit der richtigen Ausgabe
        helpSpan.innerHTML = "<b>Zu groß</b>";
    });
    //3.Zusatzaufgabe
    //Button reset. --> generiert neue randomNumber und cleared den text im element hint
};
