import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IType } from 'app/shared/model/type.model';
import { Principal } from 'app/core';
import { TypeService } from './type.service';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-type',
    templateUrl: './type.component.html'
})
export class TypeComponent implements OnInit, OnDestroy {
    types: IType[];
    currentAccount: any;
    eventSubscriber: Subscription;
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
            addButtonContent: 'Create new type'
        },
        columns: {
            id: {
                title: 'ID'
            },
            name: {
                title: 'Name'
            },
            description: {
                title: 'Description'
            }
        }
    };
    data;

    constructor(
        private typeService: TypeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.typeService.query().subscribe(
            (res: HttpResponse<IType[]>) => {
                this.data = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTypes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IType) {
        return item.id;
    }

    registerChangeInTypes() {
        this.eventSubscriber = this.eventManager.subscribe('typeListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    add() {
        this.router.navigateByUrl('/type/new');
    }

    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`);

        if (event.action === 'view') {
            this.router.navigateByUrl('type/' + event.data.id + '/view');
        } else if (event.action === 'edit') {
            this.router.navigateByUrl('type/' + event.data.id + '/edit');
        } else if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'type/' + event.data.id + '/delete' } }]);
        }
    }
}
