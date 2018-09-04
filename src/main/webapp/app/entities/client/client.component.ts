import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IClient } from 'app/shared/model/client.model';
import { Principal } from 'app/core';
import { ClientService } from './client.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'jhi-client',
    templateUrl: './client.component.html'
})
export class ClientComponent implements OnInit, OnDestroy {
    clients: IClient[];
    currentAccount: any;
    eventSubscriber: Subscription;
    settings = {
        columns: {
            id: {
                title: 'ID',
                editable: 'false'
            },
            name: {
                title: 'Name'
            },
            address: {
                title: 'Address'
            },
            phoneNumber: {
                title: 'Phone number'
            },
            email: {
                title: 'Email'
            },
            cityName: {
                title: 'City'
            }
        }
    };
    data;

    // settings = Object.assign({}, this.newSettings);

    constructor(
        private clientService: ClientService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.clientService.query().subscribe(
            (res: HttpResponse<IClient[]>) => {
                this.clients = res.body;
                this.data = new LocalDataSource();
                for (const client of res.body) {
                    if (client.city) {
                        client.cityName = client.city.name;
                    } else {
                        client.cityName = 'N/A';
                    }
                    this.data.add(client);
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
        this.registerChangeInClients();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IClient) {
        return item.id;
    }

    registerChangeInClients() {
        this.eventSubscriber = this.eventManager.subscribe('clientListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
