import {Student} from './Student';

let s: Student = new Student("Max", 123456);
let label : string = s.getLabel();
console.log(label);   // "Student Max mit Matrikelnummer: 123456"
