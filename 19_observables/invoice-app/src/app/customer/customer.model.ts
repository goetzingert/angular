let trainingCounter = 0;

export class Customer {
  public id: string;

  constructor(
    public firstname: string,
    public lastname: string,
    public street?: string,
    public zip?: string,
    public city?: string,
    public imageUrl?:string,
    public discontinued?: boolean,
    public lastOrderDate?: Date
  ) {
    this.id = crypto.randomUUID();
  }
}
