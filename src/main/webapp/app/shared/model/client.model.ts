import { ICity } from 'app/shared/model//city.model';

export interface IClient {
    id?: number;
    name?: string;
    city?: string;
    toCity?: ICity;
}

export class Client implements IClient {
    constructor(public id?: number, public name?: string, public city?: string, public toCity?: ICity) {}
}
