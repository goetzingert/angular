define(["require", "exports", "./Student"], function (require, exports, Student_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var s = new Student_1.Student();
    var label = s.getLabel();
    console.log(label);
});
