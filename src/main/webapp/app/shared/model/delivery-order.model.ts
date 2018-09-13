import { Moment } from 'moment';
import { IOnlineOrder } from 'app/shared/model//online-order.model';
import { IVehicle } from 'app/shared/model//vehicle.model';
import { IEmployee } from 'app/shared/model//employee.model';

export interface IDeliveryOrder {
    id?: number;
    deliveryDate?: Moment;
    status?: string;
    onlineOrder?: IOnlineOrder;
    vehicle?: IVehicle;
    warehouseClerk?: IEmployee;
    driver?: IEmployee;
}

export class DeliveryOrder implements IDeliveryOrder {
    constructor(
        public id?: number,
        public deliveryDate?: Moment,
        public status?: string,
        public onlineOrder?: IOnlineOrder,
        public vehicle?: IVehicle,
        public warehouseClerk?: IEmployee,
        public driver?: IEmployee
    ) {}
}
