import { IOnlineOrderItem } from 'app/shared/model//online-order-item.model';
import { IDeliveryOrder } from 'app/shared/model//delivery-order.model';

export interface IDeliveryOrderItem {
    id?: number;
    preparedAmount?: number;
    deliveredAmount?: number;
    onlineOrderItem?: IOnlineOrderItem;
    deliveryOrder?: IDeliveryOrder;
}

export class DeliveryOrderItem implements IDeliveryOrderItem {
    constructor(
        public id?: number,
        public preparedAmount?: number,
        public deliveredAmount?: number,
        public onlineOrderItem?: IOnlineOrderItem,
        public deliveryOrder?: IDeliveryOrder
    ) {}
}
