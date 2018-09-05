import { IOnlineOrder } from 'app/shared/model//online-order.model';

export interface IOnlineOrderItem {
    id?: number;
    orderedAmount?: string;
    itemPrice?: number;
    onlineOrderItem?: IOnlineOrder;
}

export class OnlineOrderItem implements IOnlineOrderItem {
    constructor(public id?: number, public orderedAmount?: string, public itemPrice?: number, public onlineOrderItem?: IOnlineOrder) {}
}
