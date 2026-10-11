

export class Customer {
  public id: string;
  // Freitext-Notiz. Das Backend kennt dieses Feld nicht (siehe CustomerService, Übung 36).
  public note?: string;

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
