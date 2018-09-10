import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IVehicle } from 'app/shared/model/vehicle.model';
import { Principal } from 'app/core';
import { VehicleService } from './vehicle.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'jhi-vehicle',
    templateUrl: './vehicle.component.html'
})
export class VehicleComponent implements OnInit, OnDestroy {
    vehicles: IVehicle[];
    currentAccount: any;
    eventSubscriber: Subscription;

    isSaving: boolean;

    vehicle: IVehicle;

    settings = {
        attr: {
            class: 'smart-table'
        },
        actions: {
            delete: false,
            custom: [
                {
                    name: 'view',
                    title: '<img src="../../../content/images/view.png">'
                },
                {
                    name: 'delete',
                    title: '<img src="../../../content/images/delete.png">'
                }
            ],
            columnTitle: ''
        },
        // mode: 'inline',
        add: {
            create: true,
            confirmCreate: true,
            addButtonContent: 'Add new Vehicle',
            createButtonContent: 'Create',
            cancelButtonContent: 'Cancel'
        },
        edit: {
            editButtonContent: '<img src="../../../content/images/edit.png">',
            confirmSave: true
        },
        columns: {
            id: {
                title: 'ID',
                width: '70px',
                editable: false,
                addable: false
            },
            vehicleNumber: {
                title: 'Vehicle number'
            },
            brand: {
                title: 'Brand'
            },
            model: {
                title: 'Model'
            }
        }
    };

    constructor(
        private vehicleService: VehicleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router,
        private _sanitizer: DomSanitizer
    ) {}

    loadAll() {
        this.vehicleService.query().subscribe(
            (res: HttpResponse<IVehicle[]>) => {
                this.vehicles = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInVehicles();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IVehicle) {
        return item.id;
    }

    registerChangeInVehicles() {
        this.eventSubscriber = this.eventManager.subscribe('vehicleListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    onCustom(event) {
        if (event.action === 'view') {
            this.router.navigateByUrl('vehicle/' + event.data.id + '/view');
        }
        if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'vehicle/' + event.data.id + '/delete' } }]);
        }
    }

    onEditConfirm(event) {
        if (window.confirm('Are you sure you want to edit this Vehicle?')) {
            this.vehicle = event.newData;
            if (this.validate(this.vehicle)) {
                this.save();
                event.confirm.resolve(event.newData);
            } else {
                window.alert('Invalid input data! Vehicle was NOT edited.');
            }
        } else {
            event.confirm.reject();
        }
    }

    onCreateConfirm(event) {
        if (window.confirm('Are you sure you want to create this Vehicle?')) {
            this.vehicle = event.newData;
            if (this.validate(this.vehicle)) {
                this.save();
                event.confirm.resolve(event.newData);
            } else {
                window.alert('Invalid input data! Vehicle was NOT created.');
            }
        } else {
            event.confirm.reject();
        }
    }

    validate(vehicle: IVehicle): boolean {
        const regexVehicleNumber = /^[1-9][0-9][0-9]/g;
        const regexFirstLetter = /^[A-Z][A-Z a-z]{2,19}$/;

        if (regexVehicleNumber.test(vehicle.vehicleNumber) && regexFirstLetter.test(vehicle.brand)) {
            return true;
        } else {
            return false;
        }
    }

    save() {
        this.isSaving = true;
        if (this.vehicle.id) {
            this.subscribeToSaveResponse(this.vehicleService.update(this.vehicle));
        } else {
            this.subscribeToSaveResponse(this.vehicleService.create(this.vehicle));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IVehicle>>) {
        result.subscribe((res: HttpResponse<IVehicle>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
    }

    previousState() {
        window.history.back();
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
