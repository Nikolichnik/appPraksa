import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { OnlineOrderItemService } from './online-order-item.service';
import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { OnlineOrderService } from 'app/entities/online-order';

@Component({
    selector: 'jhi-online-order-item-update',
    templateUrl: './online-order-item-update.component.html'
})
export class OnlineOrderItemUpdateComponent implements OnInit {
    private _onlineOrderItem: IOnlineOrderItem;
    isSaving: boolean;

    onlineorders: IOnlineOrder[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private onlineOrderItemService: OnlineOrderItemService,
        private onlineOrderService: OnlineOrderService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ onlineOrderItem }) => {
            this.onlineOrderItem = onlineOrderItem;
        });
        this.onlineOrderService.query().subscribe(
            (res: HttpResponse<IOnlineOrder[]>) => {
                this.onlineorders = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.onlineOrderItem.id !== undefined) {
            this.subscribeToSaveResponse(this.onlineOrderItemService.update(this.onlineOrderItem));
        } else {
            this.subscribeToSaveResponse(this.onlineOrderItemService.create(this.onlineOrderItem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOnlineOrderItem>>) {
        result.subscribe((res: HttpResponse<IOnlineOrderItem>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackOnlineOrderById(index: number, item: IOnlineOrder) {
        return item.id;
    }
    get onlineOrderItem() {
        return this._onlineOrderItem;
    }

    set onlineOrderItem(onlineOrderItem: IOnlineOrderItem) {
        this._onlineOrderItem = onlineOrderItem;
    }
}
