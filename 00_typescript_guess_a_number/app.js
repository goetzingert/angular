"use strict";
var randomNumber = guessNumber();
function guessNumber() {
    var newRandomNumber = Math.floor(Math.random() * 100);
    console.log(newRandomNumber);
    return newRandomNumber;
}
//Browser ruft onload funktion auf, wenn HTML Gerüst komplett geparsed
window.onload = function () {
    //1. aus dem document das inputElement holen. input.value --> Number
    var numberInput = document.getElementById("numberInput");
    var helpSpan = document.getElementById("hint");
    //DOM Button mit der id check
    var button = document.getElementById("check");
    button.addEventListener("click", function (event) {
        console.log("button geklicked");
        var currentNumber = numberInput.valueAsNumber;
        //oder alternativ
        var currentInput = numberInput.value;
        var currentInputAsNumber = parseInt(currentInput);
        //2. Entscheidung zu klein oder zu groß oder richtig
        //if else 
        //innerHtml mit der richtigen Ausgabe
        if (isNaN(currentNumber)) {
            helpSpan.innerHTML = "<b>Keine Zahl eingegeben</b>";
        }
        else if (randomNumber > currentNumber)
            helpSpan.innerHTML = "<b>Zu klein</b>";
        else if (randomNumber < currentNumber)
            helpSpan.innerHTML = "<b>Zu groß</b>";
        else
            helpSpan.innerHTML = "RICHTIG!";
    });
    var resetButton : HTMLButtonElement = <HTMLButtonElement>document.getElementById("reset");
    resetButton.addEventListener("click", function (event) {
        randomNumber = guessNumber();
        helpSpan.innerHTML = "";
    });
    //3.Zusatzaufgabe
    //Button reset. --> generiert neue randomNumber und cleared den text im element hint
};
