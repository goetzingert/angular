"use strict";
var Student = /** @class */ (function () {
    function Student() {
        this.label = 0;
    }
    Student.prototype.getLabel = function (label) {
        if (label)
            this.label = label;
        return "Matrikelnummer " + this.label;
    };
    return Student;
}());
var s = new Student();
var label = s.getLabel(12345);
console.log(label);
