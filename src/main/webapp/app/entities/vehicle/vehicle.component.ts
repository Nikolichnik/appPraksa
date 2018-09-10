import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
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

    settings = {
        attr: {
            class: 'smart-table'
        },
        actions: {
            // edit: false,
            delete: false,
            custom: [
                {
                    name: 'view',
                    title: '<img src="../../../content/images/view.png">'
                },
                // title: this._sanitizer.bypassSecurityTrustHtml('<i class="fa fa-eye"></i>')
                // {
                //     name: 'edit',
                //     title: 'Edit '
                // },
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

    // add() {
    //     this.router.navigateByUrl('/vehicle/new');
    // }

    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`);

        if (event.action === 'view') {
            this.router.navigateByUrl('vehicle/' + event.data.id + '/view');
        }
        // else if (event.action === 'edit') {
        //     this.router.navigateByUrl('vehicle/' + event.data.id + '/edit');
        // } else
        if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'vehicle/' + event.data.id + '/delete' } }]);
        }
    }

    onEditConfirm(event) {
        if (window.confirm('Are you sure you want to edit this Vehicle?')) {
            if (this.validate(event.newData)) {
                // console.log('Create CONFIRMED');
                event.confirm.resolve(event.newData);
            } else {
                // console.log('Create REJECTED');
                window.alert('Invalid input data! Vehicle was NOT edited.');
            }
        } else {
            event.confirm.reject();
        }
    }

    onCreateConfirm(event) {
        if (window.confirm('Are you sure you want to create this Vehicle?')) {
            if (this.validate(event.newData)) {
                // console.log('Create CONFIRMED');
                event.confirm.resolve(event.newData);
            } else {
                // console.log('Create REJECTED');
                window.alert('Invalid input data! Vehicle was NOT created.');
            }
        } else {
            event.confirm.reject();
        }
    }

    validate(vehicle: IVehicle) {
        // console.log('Enter VALIDATE');
        const regexVehicleNumber = /^[1-9][0-9][0-9]/g;
        const regexFirstLetter = /^[A-Z][A-Za-z]{2,19}$/;

        if (
            regexVehicleNumber.test(vehicle.vehicleNumber) &&
            regexFirstLetter.test(vehicle.brand) &&
            regexFirstLetter.test(vehicle.model)
        ) {
            // console.log('VALIDATE return TRUE');
            return true;
        } else {
            // console.log('VALIDATE return FALSE');
            return false;
        }
    }
}
