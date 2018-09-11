import { OnlineOrderItem } from './../shared/model/online-order-item.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    private persons = [] as OnlineOrderItem[];
    private messageSource = new BehaviorSubject<OnlineOrderItem[]>(this.persons);
    currentMessage = this.messageSource.asObservable();

    constructor() {}

    changeMessage(message: any) {
        this.messageSource.next(message);
    }
}
