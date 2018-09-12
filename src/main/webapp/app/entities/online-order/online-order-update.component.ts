import { OnlineOrderItemService } from './../online-order-item/online-order-item.service';
import { IOnlineOrderItem } from './../../shared/model/online-order-item.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { OnlineOrderService } from './online-order.service';
import { ICity } from 'app/shared/model/city.model';
import { CityService } from 'app/entities/city';
import { IClient } from 'app/shared/model/client.model';
import { ClientService } from 'app/entities/client';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'jhi-online-order-update',
    templateUrl: './online-order-update.component.html'
})
export class OnlineOrderUpdateComponent implements OnInit, OnDestroy {
    private _onlineOrder: IOnlineOrder;
    isSaving: boolean;

    cities: ICity[];

    clients: IClient[];

    onlineOrderItems: IOnlineOrderItem[];

    data;

    eventSubscriber: Subscription;
    eventSubscriberTotal: Subscription;

    constructor(
        private jhiAlertService: JhiAlertService,
        private onlineOrderService: OnlineOrderService,
        private cityService: CityService,
        private clientService: ClientService,
        private onlineOrderItemService: OnlineOrderItemService,
        private activatedRoute: ActivatedRoute,
        private eventManager: JhiEventManager,
        private route: Router
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ onlineOrder }) => {
            this.onlineOrder = onlineOrder;
        });

        this.eventSubscriber = this.eventManager.subscribe('onlineOrderItemModification', response => this.save());

        this.eventSubscriberTotal = this.eventManager.subscribe('onlineOrderItemTotalPrice', response => {
            this.onlineOrder.totalPrice = response.content;
        });

        this.cityService.query().subscribe(
            (res: HttpResponse<ICity[]>) => {
                this.cities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.clientService.query().subscribe(
            (res: HttpResponse<IClient[]>) => {
                this.clients = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.onlineOrderItemService.query().subscribe(
            (res: HttpResponse<IOnlineOrderItem[]>) => {
                this.onlineOrderItems = res.body;
                this.data = new LocalDataSource();
                for (const onlineOrderItem of res.body) {
                    if (onlineOrderItem.article) {
                        onlineOrderItem.articleName = onlineOrderItem.article.name;
                        onlineOrderItem.articlePrice = onlineOrderItem.article.price;
                    } else {
                        onlineOrderItem.articleName = 'N/A';
                        onlineOrderItem.articlePrice = 0;
                    }
                    this.data.add(onlineOrderItem);
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        // this.onlineOrderItemService.getByOrderId(this._onlineOrder.id).subscribe(
        //     (res: HttpResponse<IOnlineOrderItem[]>) => {
        //         this.onlineOrderItems = res.body;
        //         this._onlineOrder.totalPrice = 0;
        //         for (const onlineOrderItem of res.body) {
        //             this._onlineOrder.totalPrice += onlineOrderItem.orderedAmount * onlineOrderItem.article.price;
        //         }
        //     },
        //     (res: HttpErrorResponse) => this.onError(res.message)
        // );
    }

    checkIfRouteContainsEdit() {
        if (this.route.url.includes('new')) {
            return false;
        }
        return true;
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.eventManager.destroy(this.eventSubscriberTotal);
    }

    save() {
        this.isSaving = true;
        if (this.onlineOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.onlineOrderService.update(this.onlineOrder));
        } else {
            this.subscribeToSaveResponse(this.onlineOrderService.create(this.onlineOrder));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOnlineOrder>>) {
        result.subscribe((res: HttpResponse<IOnlineOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackCityById(index: number, item: ICity) {
        return item.id;
    }

    trackClientById(index: number, item: IClient) {
        return item.id;
    }

    trackOnlineOrderItemtById(index: number, item: IOnlineOrderItem) {
        return item.id;
    }

    get onlineOrder() {
        return this._onlineOrder;
    }

    set onlineOrder(onlineOrder: IOnlineOrder) {
        this._onlineOrder = onlineOrder;
    }
}
