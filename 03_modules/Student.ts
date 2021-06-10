export class Student{
    private label: number = 0;

    getLabel(label?: number) : string{
        if(label)
            this.label = label;
        return "Matrikelnummer " + this.label;
    }
}


