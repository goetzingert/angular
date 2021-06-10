define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Student = void 0;
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
    exports.Student = Student;
});
