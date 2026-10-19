"use strict";
class Student {
    getLabel(studentNumber) {
        return "Student mit Matrikelnummer: " + studentNumber;
    }
}
let s = new Student();
let label = s.getLabel(123456);
console.log(label); // "Student mit Matrikelnummer: 123456"
