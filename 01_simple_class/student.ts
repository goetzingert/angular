class Student{

    getLabel(studentNumber: number) : string{
        return "Student mit Matrikelnummer: " + studentNumber;
    }
}

let s: Student = new Student();
let label : string = s.getLabel(123456);
console.log(label);   // "Student mit Matrikelnummer: 123456"
