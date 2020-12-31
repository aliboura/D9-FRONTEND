import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";

import {Parents} from "../model-generic/parents";
import {GenericService} from "../service-generic/generic.service";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";
import {NOTYF} from "../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {NgxCoolDialogsService} from "ngx-cool-dialogs";
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";

@Component({
    selector: "app-list-generic",
    templateUrl: "./list-generic.component.html",
    styleUrls: ["./list-generic.component.css"]
})
export class ListGenericComponent<T extends Parents>
    implements OnInit, AfterViewInit {
    constructor(
        private screenSpinnerService: ScreenSpinnerService,
        private coolDialogs: NgxCoolDialogsService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        @Inject(NOTYF) private notyf: Notyf) {
        this.emptyData = true;
        registerLocaleData(localeFr);
    }

    datasource: MatTableDataSource<T>;
    @Input() service: GenericService<T>;
    @Input() columnsToDisplay: string[];
    @Input() object: string;
    @Input() title: string;
    @Input() columnsFilter: string[];
    @Input() matSortActive: string;
    @Input() matSortDirection: string;
    @Input() showAddButton: boolean = true;
    @Input() showDeleteButton: boolean = true;

    displayedColumns: string[] = [];

    search: string;
    resultsLength = 0;
    emptyData: boolean;
    isLoadingResults = true;
    isRateLimitReached = false;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    ngOnInit() {
        this.displayedColumns = this.columnsToDisplay.slice();
        this.displayedColumns.unshift("id");
        this.displayedColumns.push("action");
    }

    private loadSpinner(timeout: number) {
        this.screenSpinnerService.show();
        this.screenSpinnerService.hide(timeout);
    }

    showAdd() {
        this.router.navigate(['add'], {relativeTo: this.route});
        this.loadSpinner(200);
    }

    showEdit(id: string) {
        this.router.navigate([btoa("" + id)], {relativeTo: this.route});
        this.loadSpinner(200);
    }

    ngAfterViewInit(): void {
        this.loadAllData();
    }

    applyFilter() {
        if (this.columnsFilter && this.search) {
            let expression = "";
            this.columnsFilter.forEach(x => {
                if (expression === "") {
                    expression = x + "==*" + this.search.trim().toLowerCase() + "*";
                } else {
                    expression = expression + "," + x + "==*" + this.search.trim().toLowerCase() + "*";
                }
            });
            this.filter(expression);
        } else {
            this.loadAllData();
        }
    }

    keyUpFilter() {
        this.applyFilter();
    }

    keyUpReset() {
        this.search = '';
        this.loadAllData();
    }

    private loadAllData() {
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith(null),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.service.findLazyData(
                        this.paginator.pageIndex,
                        this.paginator.pageSize,
                        this.sort.start,
                        "id"
                    );
                }),
                map(data => {
                    this.isLoadingResults = false;
                    this.isRateLimitReached = false;
                    this.resultsLength = data.totalElements;
                    return data.content;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    this.isRateLimitReached = true;
                    return observableOf([]);
                })
            )
            .subscribe(data => {
                this.datasource = new MatTableDataSource<T>(data);
                this.datasource.sort = this.sort;
                this.emptyData = data.length === 0;
                this.screenSpinnerService.hide(10);
            });
    }

    private filter(search: string) {
        this.service.searchLazyData(0, this.paginator.pageSize, "asc", "id", search)
            .pipe(
                map(dt => {
                    this.isLoadingResults = false;
                    this.isRateLimitReached = false;
                    this.resultsLength = dt.totalElements;
                    return dt.content;
                })
            )
            .subscribe(data => {
                this.datasource = new MatTableDataSource<T>(data);
                this.datasource.paginator = this.paginator;
                this.datasource.sort = this.sort;
                this.screenSpinnerService.hide(10);
            });
    }

    resetSearch() {
        this.search = "";
        this.loadAllData();
    }

    delete(model: T) {
        this.service.delete("" + model.id).subscribe(data => {
            const index: number = this.datasource.data.indexOf(model);
            this.datasource.data.splice(index, 1);
            this.datasource = new MatTableDataSource<T>(this.datasource.data);
            this.resultsLength = this.resultsLength - 1;
        });
    }

    confirm(data: T) {
        this.coolDialogs.confirm(this.translate.instant("COMMUN.CONFIRM_MSG"))
            .subscribe(res => {
                if (res) {
                    this.delete(data);
                    this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
                } else {
                    console.log('You clicked Cancel. You smart.');
                }
            });
    }

    typeOf(value) {
        return typeof value;
    }
}
