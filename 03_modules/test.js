define(["require", "exports", "./Student"], function (require, exports, Student_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var s = new Student_1.Student("Max", 123456);
    var label = s.getLabel();
    console.log(label); // "Student Max mit Matrikelnummer: 123456"
});
