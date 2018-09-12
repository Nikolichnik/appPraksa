import { IOnlineOrderItem } from './../../shared/model/online-order-item.model';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { Principal } from 'app/core';
import { OnlineOrderService } from './online-order.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'jhi-online-order',
    templateUrl: './online-order.component.html'
})
export class OnlineOrderComponent implements OnInit, OnDestroy {
    onlineOrders: IOnlineOrder[];
    currentAccount: any;
    eventSubscriber: Subscription;

    data: LocalDataSource;

    @Input() totalPrice: number;

    eventSubscriberTotal: Subscription;

    settings = {
        actions: {
            edit: false,
            delete: false,
            custom: [
                {
                    name: 'view',
                    title: 'View '
                },
                {
                    name: 'edit',
                    title: 'Edit '
                },
                {
                    name: 'delete',
                    title: 'Delete'
                }
            ],
            columnTitle: ''
        },
        mode: 'external',
        add: {
            create: true,
            addButtonContent: 'Create new Online Order'
        },
        columns: {
            id: {
                title: 'ID',
                width: '70px'
            },
            clientName: {
                title: 'Client'
            },
            cityName: {
                title: 'City'
            },
            address: {
                title: 'Address'
            },
            phoneNumber: {
                title: 'Phone number'
            },
            totalPrice: {
                title: 'Total price'
            }
        }
    };

    constructor(
        private onlineOrderService: OnlineOrderService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.onlineOrderService.query().subscribe(
            (res: HttpResponse<IOnlineOrder[]>) => {
                this.onlineOrders = res.body;
                this.data = new LocalDataSource();
                for (const onlineOrder of res.body) {
                    if (onlineOrder.city) {
                        onlineOrder.cityName = onlineOrder.city.zipcode + ' ' + onlineOrder.city.name;
                        this.eventSubscriberTotal = this.eventManager.subscribe('onlineOrderItemTotalPrice', response => {
                            onlineOrder.totalPrice = response.content;
                        });
                    }
                    if (onlineOrder.client) {
                        onlineOrder.clientName = onlineOrder.client.name;
                    }
                    this.data.add(onlineOrder);
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInOnlineOrders();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.eventManager.destroy(this.eventSubscriberTotal);
    }

    trackId(index: number, item: IOnlineOrder) {
        return item.id;
    }

    registerChangeInOnlineOrders() {
        this.eventSubscriber = this.eventManager.subscribe('onlineOrderListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    add() {
        this.router.navigateByUrl('/online-order/new');
    }

    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`);

        if (event.action === 'view') {
            this.router.navigateByUrl('online-order/' + event.data.id + '/view');
        } else if (event.action === 'edit') {
            this.router.navigateByUrl('online-order/' + event.data.id + '/edit');
        } else if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'online-order/' + event.data.id + '/delete' } }]);
        }
    }
}
