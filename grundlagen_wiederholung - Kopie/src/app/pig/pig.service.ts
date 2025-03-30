import { Injectable } from "@angular/core";
import { Observable, of, ReplaySubject } from "rxjs";
import { Pig } from "./pig.model";
import { INHABITANTS } from "./pig.mock";

@Injectable({
	providedIn: "root"
})
export class PigService {

	private data: Pig[] = [];
	private dataSubject: ReplaySubject<Pig[]> = new ReplaySubject<Pig[]>();

	constructor() {
		this.data = INHABITANTS;


	}

	public getAll(): Observable<Pig[]> {
		setTimeout(() => this.dataSubject.next(this.data), 2000);
		return this.dataSubject.asObservable();

	}

	public getById(id: number): Observable<Pig> {
		return of(this.data.filter(tr => tr.id === id)[0]);
	}
}
