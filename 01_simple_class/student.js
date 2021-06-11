"use strict";
class Student {
    constructor() {
        this.label = 0;
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
