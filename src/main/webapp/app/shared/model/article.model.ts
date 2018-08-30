export interface IArticle {
    id?: number;
    name?: string;
    amount?: number;
}

export class Article implements IArticle {
    constructor(public id?: number, public name?: string, public amount?: number) {}
}
