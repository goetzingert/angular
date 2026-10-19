class Student{

    // "Parameter properties": deklariert und setzt die Attribute direkt im Konstruktor
    constructor(private name: string, private studentNumber: number){
    }

    getLabel() : string{
        return "Student " + this.name + " mit Matrikelnummer: " + this.studentNumber;
    }
}

let s: Student = new Student("Max", 123456);
let label : string = s.getLabel();
console.log(label);   // "Student Max mit Matrikelnummer: 123456"
