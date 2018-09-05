import { IOnlineOrder } from 'app/shared/model//online-order.model';
import { IArticle } from 'app/shared/model//article.model';

export interface IOnlineOrderItem {
    id?: number;
    orderedAmount?: string;
    itemPrice?: number;
    onlineOrder?: IOnlineOrder;
    article?: IArticle;
}

export class OnlineOrderItem implements IOnlineOrderItem {
    constructor(
        public id?: number,
        public orderedAmount?: string,
        public itemPrice?: number,
        public onlineOrder?: IOnlineOrder,
        public article?: IArticle
    ) {}
}
