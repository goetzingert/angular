export interface Labelled {
  getLabel(): string;
}

export class Customer implements Labelled {
  constructor(
    public firstname: string,
    public lastname: string,
  ) {}

  getLabel(): string {
    return `Kunde: ${this.firstname} ${this.lastname}`;
  }
}
