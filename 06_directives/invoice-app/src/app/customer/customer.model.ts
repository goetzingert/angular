let trainingCounter = 0;

export class Customer {
  public id: string;

  constructor(
    public firstname: string,
    public lastname: string,
    public street?: string,
    public zip?: string,
    public city?: string
  ) {
    this.id = crypto.randomUUID();
  }
}
