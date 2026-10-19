define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Student = void 0;
    var Student = /** @class */ (function () {
        function Student(name, studentNumber) {
            this.name = name;
            this.studentNumber = studentNumber;
        }
        Student.prototype.getLabel = function () {
            return "Student " + this.name + " mit Matrikelnummer: " + this.studentNumber;
        };
        return Student;
    }());
    exports.Student = Student;
});
