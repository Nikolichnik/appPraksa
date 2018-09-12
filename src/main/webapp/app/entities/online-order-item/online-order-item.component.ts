import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOnlineOrderItem, OnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { Principal } from 'app/core';
import { OnlineOrderItemService } from './online-order-item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Column } from 'ng2-smart-table/lib/data-set/column';

import { OnlineOrderService } from '../online-order/online-order.service';

@Component({
    selector: 'jhi-online-order-item',
    templateUrl: './online-order-item.component.html'
})
export class OnlineOrderItemComponent implements OnInit, OnDestroy {
    onlineOrderItems: IOnlineOrderItem[];
    currentAccount: any;
    eventSubscriber: Subscription;

    onlineOrderId: number;

    message = this.onlineOrderItems;
    private onlineOrderItem = new OnlineOrderItem();

    totalPrice: number;

    data;

    @Output() childSubmit = new EventEmitter<any>();

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
            ]
        },
        mode: 'external',
        add: {
            // create: true,
            addButtonContent: 'Create new Article'
        },
        columns: {
            id: {
                title: 'ID',
                width: '70px'
            },
            articleName: {
                title: 'Article'
            },
            articlePrice: {
                title: 'Article price'
            },
            orderedAmount: {
                title: 'Ordered amount'
            },
            itemPrice: {
                title: 'Total price'
            }
        }
    };

    constructor(
        private onlineOrderItemService: OnlineOrderItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private onlineOrderService: OnlineOrderService
    ) {}

    loadAll() {
        this.activatedRoute.params.subscribe(param => {
            this.onlineOrderId = +param['id'];
        });

        this.onlineOrderItemService.getByOrderId(this.onlineOrderId).subscribe(
            (res: HttpResponse<IOnlineOrderItem[]>) => {
                this.onlineOrderItems = res.body;
                this.data = new LocalDataSource();
                this.totalPrice = 0;
                for (const item of res.body) {
                    item.onlineOrder.totalPrice = 0;
                    item.itemPrice = item.orderedAmount * item.article.price;

                    this.totalPrice += item.itemPrice;

                    this.eventManager.broadcast({
                        name: 'onlineOrderItemTotalPrice',
                        content: this.totalPrice
                    });

                    // item.onlineOrder.totalPrice += item.itemPrice;
                    // this.onlineOrderService.update(item.onlineOrder);

                    if (item.onlineOrder) {
                        item.onlineOrderId = item.onlineOrder.id;
                    }
                    if (item.article) {
                        item.articleName = item.article.name;
                        item.articlePrice = item.article.price;
                    }
                    this.data.add(item);
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );

        // this.onlineOrderItemService.query().subscribe(
        //     (res: HttpResponse<IOnlineOrderItem[]>) => {
        //         this.activatedRoute.params.subscribe(param => {
        //             this.onlineOrderId = +param['id'];
        //         });
        //         this.onlineOrderItems = res.body;
        //         this.data = new LocalDataSource();
        //         for (const item of res.body) {
        //             // item.itemPrice = item.orderedAmount * item.article.price;
        //             // if (item.onlineOrder) {
        //             //     item.onlineOrderId = item.onlineOrder.id;
        //             // }
        //             // if (item.article) {
        //             //     item.articleName = item.article.name;
        //             //     item.articlePrice = item.article.price;
        //             // }
        //             // if (this.onlineOrderId === item.onlineOrderId) {
        //             //     this.data.add(item);
        //             // }
        //         }
        //     },
        //     (res: HttpErrorResponse) => this.onError(res.message)
        // );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInOnlineOrderItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IOnlineOrderItem) {
        return item.id;
    }

    registerChangeInOnlineOrderItems() {
        this.eventSubscriber = this.eventManager.subscribe('onlineOrderItemListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    add() {
        this.eventManager.broadcast({
            name: 'onlineOrderItemModification',
            content: 'Add an Item'
        });
        setTimeout(this.router.navigateByUrl('/online-order-item/new'), 100);
    }

    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`);

        this.eventManager.broadcast({
            name: 'onlineOrderItemModification',
            content: 'Add an Item'
        });

        if (event.action === 'view') {
            this.router.navigateByUrl('online-order-item/' + event.data.id + '/view');
        } else if (event.action === 'edit') {
            this.router.navigateByUrl('online-order-item/' + event.data.id + '/edit');
        } else if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'online-order-item/' + event.data.id + '/delete' } }]);
        }
    }
}
