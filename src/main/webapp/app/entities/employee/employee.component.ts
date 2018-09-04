import { Position } from './../../shared/model/position.model';
import { IEmployee } from './../../shared/model/employee.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Principal } from 'app/core';
import { EmployeeService } from './employee.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
    selector: 'jhi-employee',
    templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit, OnDestroy {
    employees: IEmployee[];
    currentAccount: any;
    eventSubscriber: Subscription;

    data: LocalDataSource;

    settings = {
        columns: {
            id: {
                title: 'ID',
                width: '70px'
            },
            fullName: {
                title: 'Full name'
            },
            // lastName: {
            //     title: 'Last name'
            // },
            positionName: {
                title: 'Position'
            }
        }
    };

    constructor(
        private employeeService: EmployeeService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.employeeService.query().subscribe(
            (res: HttpResponse<IEmployee[]>) => {
                this.employees = res.body;
                this.data = new LocalDataSource();
                for (const employee of res.body) {
                    if (employee.firstName && employee.lastName) {
                        employee.fullName = employee.firstName + ' ' + employee.lastName;
                    } else {
                        employee.fullName = 'N/A';
                    }
                    if (employee.position) {
                        employee.positionName = employee.position.name;
                    } else {
                        employee.positionName = 'N/A';
                    }
                    this.data.add(employee);
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
        this.registerChangeInEmployees();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IEmployee) {
        return item.id;
    }

    registerChangeInEmployees() {
        this.eventSubscriber = this.eventManager.subscribe('employeeListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
