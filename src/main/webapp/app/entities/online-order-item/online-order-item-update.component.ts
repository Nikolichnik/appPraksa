import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { OnlineOrderItemService } from './online-order-item.service';
import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { OnlineOrderService } from 'app/entities/online-order';
import { IArticle } from 'app/shared/model/article.model';
import { ArticleService } from 'app/entities/article';

@Component({
    selector: 'jhi-online-order-item-update',
    templateUrl: './online-order-item-update.component.html'
})
export class OnlineOrderItemUpdateComponent implements OnInit {
    private _onlineOrderItem: IOnlineOrderItem;
    isSaving: boolean;

    onlineorders: IOnlineOrder[];

    articles: IArticle[];

    isNext: boolean;

    constructor(
        private jhiAlertService: JhiAlertService,
        private onlineOrderItemService: OnlineOrderItemService,
        private onlineOrderService: OnlineOrderService,
        private articleService: ArticleService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.isNext = false;

        this.activatedRoute.data.subscribe(({ onlineOrderItem }) => {
            this.onlineOrderItem = onlineOrderItem;
        });

        this.activatedRoute.params.subscribe(param => {
            this.onlineOrderItem.onlineOrderId = +param['onlineOrderId'];
        });

        console.log('this.onlineOrderItem.onlineOrderId: ' + this.onlineOrderItem.onlineOrderId);

        this.onlineOrderService.find(this.onlineOrderItem.onlineOrderId).subscribe(
            (res: HttpResponse<IOnlineOrder>) => {
                this.onlineOrderItem.onlineOrder = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );

        this.onlineOrderService.query().subscribe(
            (res: HttpResponse<IOnlineOrder[]>) => {
                this.onlineorders = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        // window.history.back();
        this.router.navigateByUrl('online-order/' + this.onlineOrderItem.onlineOrderId + '/edit');
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
        if (this.isNext) {
            this.isNext = false;
            this.router
                .navigateByUrl('', { skipLocationChange: true })
                .then(() => this.router.navigate(['/online-order/' + this.onlineOrderItem.onlineOrderId + '/online-order-item/new']));
        } else {
            this.previousState();
        }
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

    trackArticleById(index: number, item: IArticle) {
        return item.id;
    }
    get onlineOrderItem() {
        return this._onlineOrderItem;
    }

    set onlineOrderItem(onlineOrderItem: IOnlineOrderItem) {
        this._onlineOrderItem = onlineOrderItem;
    }

    onNgChange() {
        if (this._onlineOrderItem.article && this._onlineOrderItem.orderedAmount) {
            this._onlineOrderItem.itemPrice = this._onlineOrderItem.article.price * this._onlineOrderItem.orderedAmount;
        } else {
            this._onlineOrderItem.itemPrice = 0;
        }
    }

    next() {
        this.isNext = true;
        this.save();
    }
}
