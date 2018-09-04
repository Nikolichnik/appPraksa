import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IArticle } from 'app/shared/model/article.model';
import { Principal } from 'app/core';
import { ArticleService } from './article.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-article',
    templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit, OnDestroy {
    articles: IArticle[];
    currentAccount: any;
    eventSubscriber: Subscription;

    data: LocalDataSource;

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
            addButtonContent: 'Create new Article'
        },
        columns: {
            id: {
                title: 'ID'
            },
            name: {
                title: 'Full Name'
            },
            articleNumber: {
                title: 'Article number'
            },
            availableAmount: {
                title: 'Available amount'
            },
            price: {
                title: 'Price'
            },
            articleType: {
                title: 'Type'
            }
        }
    };

    // settings = Object.assign({}, this.newSettings);

    constructor(
        private articleService: ArticleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
                this.data = new LocalDataSource();
                for (const article of res.body) {
                    if (article.type) {
                        article.articleType = article.type.name;
                    } else {
                        article.articleType = 'N/A';
                    }
                    this.data.add(article);
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
        this.registerChangeInArticles();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IArticle) {
        return item.id;
    }

    registerChangeInArticles() {
        this.eventSubscriber = this.eventManager.subscribe('articleListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    add() {
        this.router.navigateByUrl('/article/new');
    }

    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`);

        if (event.action === 'view') {
            this.router.navigateByUrl('article/' + event.data.id + '/view');
        } else if (event.action === 'edit') {
            this.router.navigateByUrl('article/' + event.data.id + '/edit');
        } else if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'article/' + event.data.id + '/delete' } }]);
        }
    }
}
