"use strict";
class Student {
    constructor() {
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
