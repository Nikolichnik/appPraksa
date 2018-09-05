export interface IOnlineOrder {
    id?: number;
    address?: string;
    phoneNumber?: string;
    totalPrice?: number;
}

export class OnlineOrder implements IOnlineOrder {
    constructor(public id?: number, public address?: string, public phoneNumber?: string, public totalPrice?: number) {}
}
