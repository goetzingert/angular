let trainingCounter = 0;

export class Training {
  public id: number;

  constructor(
    public name: string,
    public description?: string,
    public imageUrl?:string,
    public discontinued?:boolean
  ) {
    this.id = trainingCounter;
    trainingCounter++;
  
  }
}
