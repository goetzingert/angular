class Student{

    constructor(private name: string, private studentNumber : number){

    }
    getLabel() : string{
        return "Student " + this.name +" mit Matrikelnummer " + this.studentNumber;
    }
}

let s: Student = new Student();
let label : string = s.getLabel();
console.log(label);
