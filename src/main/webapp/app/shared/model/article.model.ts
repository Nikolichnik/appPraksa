export interface IArticle {
    id?: number;
    name?: string;
    articleNumber?: string;
    availableAmount?: number;
    price?: number;
}

export class Article implements IArticle {
    constructor(
        public id?: number,
        public name?: string,
        public articleNumber?: string,
        public availableAmount?: number,
        public price?: number
    ) {}
}
