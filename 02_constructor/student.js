"use strict";
class Student {
    constructor(private studentNumber : number) {
    }
    getLabel(label) {
        if (label)
            this.label = label;
        return "Matrikelnummer " + this.label;
    }
}
let s = new Student();
let label = s.getLabel();
console.log(label);
