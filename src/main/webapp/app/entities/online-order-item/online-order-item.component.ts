import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOnlineOrderItem, OnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { Principal } from 'app/core';
import { OnlineOrderItemService } from './online-order-item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Column } from 'ng2-smart-table/lib/data-set/column';

@Component({
    selector: 'jhi-online-order-item',
    templateUrl: './online-order-item.component.html'
})
export class OnlineOrderItemComponent implements OnInit, OnDestroy {
    @Input() column: Column;
    @Input() data: LocalDataSource;
    @Input() inputClass: String;

    onlineOrderItems: IOnlineOrderItem[];
    currentAccount: any;
    eventSubscriber: Subscription;

    onlineOrderId: number;

    message = this.onlineOrderItems;
    private onlineOrderItem = new OnlineOrderItem();

    totalPrice: number;

    // totalPrice = new Observable(observer => setInterval(() => observer.next(this.totalPrice), 100));

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
            create: true,
            addButtonContent: 'Create new Online Order Item'
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
        private router: Router
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
                    item.itemPrice = item.orderedAmount * item.article.price;
                    this.totalPrice += item.itemPrice;
                    item.onlineOrder.totalPrice += item.itemPrice;
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
        this.router.navigateByUrl('/online-order-item/new');
    }

    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`);

        if (event.action === 'view') {
            this.router.navigateByUrl('online-order-item/' + event.data.id + '/view');
        } else if (event.action === 'edit') {
            this.router.navigateByUrl('online-order-item/' + event.data.id + '/edit');
        } else if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'online-order-item/' + event.data.id + '/delete' } }]);
        }
    }
}
