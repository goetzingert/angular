export class Student{

    constructor(private name: string, private studentNumber: number){
    }

    getLabel() : string{
        return "Student " + this.name + " mit Matrikelnummer: " + this.studentNumber;
    }
}
