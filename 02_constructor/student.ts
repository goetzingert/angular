class Student{

    constructor(private name: string, private studentNumber : number){

    }
    getLabel() : string{
        return "Student " + this.name +" mit Matrikelnummer " + this.studentNumber;
    }
}

let s: Student = new Student("Max",123456);
let label : string = s.getLabel();
console.log(label);
