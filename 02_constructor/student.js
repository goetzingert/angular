"use strict";
class Student {
    // "Parameter properties": deklariert und setzt die Attribute direkt im Konstruktor
    constructor(name, studentNumber) {
        this.name = name;
        this.studentNumber = studentNumber;
    }
    getLabel() {
        return "Student " + this.name + " mit Matrikelnummer: " + this.studentNumber;
    }
}
let s = new Student("Max", 123456);
let label = s.getLabel();
console.log(label); // "Student Max mit Matrikelnummer: 123456"
