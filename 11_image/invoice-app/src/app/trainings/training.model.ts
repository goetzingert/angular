let trainingCounter = 0;

export class Training {
  public id: number;

  constructor(
    public name: string,
    public description?: string,
    public imageUrl?:string
  ) {
    this.id = trainingCounter;
    trainingCounter++;
  }
}
