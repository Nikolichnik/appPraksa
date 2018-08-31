import { IType } from 'app/shared/model//type.model';

export interface IArticle {
    id?: number;
    name?: string;
    articleNumber?: string;
    availableAmount?: number;
    price?: number;
    type?: IType;
}

export class Article implements IArticle {
    constructor(
        public id?: number,
        public name?: string,
        public articleNumber?: string,
        public availableAmount?: number,
        public price?: number,
        public type?: IType
    ) {}
}
