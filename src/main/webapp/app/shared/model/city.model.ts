export interface ICity {
    id?: number;
    name?: string;
    zip?: number;
    state?: string;
}

export class City implements ICity {
    constructor(public id?: number, public name?: string, public zip?: number, public state?: string) {}
}
