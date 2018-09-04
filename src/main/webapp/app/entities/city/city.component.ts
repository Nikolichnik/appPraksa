import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICity } from 'app/shared/model/city.model';
import { Principal } from 'app/core';
import { CityService } from './city.service';

@Component({
    selector: 'jhi-city',
    templateUrl: './city.component.html'
})
export class CityComponent implements OnInit, OnDestroy {
    cities: ICity[];
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
            addButtonContent: 'Create new City'
        },
        columns: {
            id: {
                title: 'ID'
            },
            name: {
                title: 'Name'
            },
            zipcode: {
                title: 'Zipcode'
            }
        }
    };

    constructor(
        private cityService: CityService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.cityService.query().subscribe(
            (res: HttpResponse<ICity[]>) => {
                this.cities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCities();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICity) {
        return item.id;
    }

    registerChangeInCities() {
        this.eventSubscriber = this.eventManager.subscribe('cityListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    add() {
        this.router.navigateByUrl('/city/new');
    }

    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`);

        if (event.action === 'view') {
            this.router.navigateByUrl('city/' + event.data.id + '/view');
        } else if (event.action === 'edit') {
            this.router.navigateByUrl('city/' + event.data.id + '/edit');
        } else if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'city/' + event.data.id + '/delete' } }]);
        }
    }
}
