var randomNumber = Math.floor(Math.random()* 100);
console.log(randomNumber);

//Browser ruft onload funktion auf, wenn HTML Gerüst komplett geparsed
window.onload = () => {

    //1. aus dem document das inputElement holen. input.value --> Number

    let helpSpan: HTMLElement = <HTMLElement> document.getElementById("hint");

    //DOM Button mit der id check
    let button : HTMLButtonElement  = <HTMLButtonElement>document.getElementById("check");
    button.addEventListener("click", (event)=>{
        console.log("button geklicked");

        let currentNumber : number = parseInt("22");
        //2. Entscheidung zu klein oder zu groß oder richtig
        //if else 
        //innerHtml mit der richtigen Ausgabe
        helpSpan.innerHTML = "<b>Zu groß</b>"
    });

    //3.Zusatzaufgabe
    //Button reset. --> generiert neue randomNumber und cleared den text im element hint

}