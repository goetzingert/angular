var randomNumber = guessNumber();
function guessNumber(){
    let newRandomNumber = Math.floor(Math.random()* 100);
    console.log(newRandomNumber);
    return newRandomNumber;
}

//Browser ruft onload funktion auf, wenn HTML Gerüst komplett geparsed
window.onload = () => {

    //1. aus dem document das inputElement holen. input.value --> Number

    let numberInput: HTMLInputElement = document.getElementById("numberInput") as HTMLInputElement;

    let helpSpan: HTMLElement = document.getElementById("hint") as HTMLElement;

    //DOM Button mit der id check
    let button : HTMLButtonElement  = document.getElementById("check") as HTMLButtonElement;
    button.addEventListener("click", (event)=>{
        console.log("button geklicked");
        
        let currentNumber : number = numberInput.valueAsNumber;
        //oder alternativ
        let currentInput : string = numberInput.value;
        let currentInputAsNumber : number = parseInt(currentInput);


        //2. Entscheidung zu klein oder zu groß oder richtig
        //if else 
        //innerHtml mit der richtigen Ausgabe


        if(isNaN(currentNumber)){
            helpSpan.innerHTML = "<b>Keine Zahl eingegeben</b>";
        }
        else if(randomNumber > currentNumber)
            helpSpan.innerHTML = "<b>Zu klein</b>";
        else if (randomNumber < currentNumber)
            helpSpan.innerHTML = "<b>Zu groß</b>";
        else
            helpSpan.innerHTML = "RICHTIG!";
        
    });
    let resetButton : HTMLButtonElement  = document.getElementById("reset") as HTMLButtonElement;
    resetButton.addEventListener("click", (event)=>
    {
        randomNumber = guessNumber();
        helpSpan.innerHTML = "";
    });
    //3.Zusatzaufgabe
    //Button reset. --> generiert neue randomNumber und cleared den text im element hint

}