// TypeScript-Übung 4: Musterlösung

interface Labelled {
  getLabel(): string;
}

class Customer implements Labelled {
  readonly id: string;

  constructor(
    public firstname: string,
    public lastname: string,
    public city?: string,
  ) {
    this.id = crypto.randomUUID();
  }

  get fullName(): string {
    return this.firstname + " " + this.lastname;
  }

  getLabel(): string {
    return `Kunde: ${this.fullName} (${this.city ?? "unbekannt"})`;
  }
}

class VipCustomer extends Customer {
  constructor(
    firstname: string,
    lastname: string,
    public discount: number,
  ) {
    super(firstname, lastname);
  }

  override getLabel(): string {
    return super.getLabel() + ` - VIP -${this.discount}%`;
  }
}

const lisa = new Customer("Lisa", "Simpson", "Springfield");
const ned = new VipCustomer("Ned", "Flanders", 10);
console.log(lisa.fullName);
console.log(lisa.getLabel());
console.log(ned.getLabel());
console.log(lisa.id === ned.id);

// Macht die Datei zu einem Modul: Namen aus anderen Übungsdateien stören nicht.
export {};
