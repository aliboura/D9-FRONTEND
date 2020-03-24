import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild
} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmationService, MessageService} from "primeng/api";
import {merge, Observable, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";

import {Parents} from "../model-generic/parents";
import {GenericService} from "../service-generic/generic.service";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-list-generic",
  templateUrl: "./list-generic.component.html",
  styleUrls: ["./list-generic.component.css"]
})
export class ListGenericComponent<T extends Parents>
  implements OnInit, AfterViewInit {
  constructor(
    private spinner: NgxSpinnerService,
    private screenSpinnerService: ScreenSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.screenSpinnerService.show();
    this.spinner.show();
    this.emptyData = true;
  }

  datasource: MatTableDataSource<T>;
  @Input() service: GenericService<T>;
  @Input() columnsToDisplay: string[];
  @Input() object: string;
  @Input() title: string;
  @Input() matSortActive: string;
  @Input() matSortDirection: string;

  displayedColumns: string[] = [];

  resultsLength = 0;
  emptyData: boolean;
  isLoadingResults = true;
  isRateLimitReached = false;

  // tslint:disable-next-line: variable-name
  viewDirection_: Observable<string>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.displayedColumns = this.columnsToDisplay.slice();
    this.displayedColumns.unshift("id");
    this.displayedColumns.push("action");
  }

  private loadSpinner(timeout: number) {
    this.screenSpinnerService.show();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.screenSpinnerService.hide();
    }, timeout);
  }

  showAdd() {
    this.router.navigate([this.object + "/add"]);
    this.loadSpinner(200);
  }

  showEdit(id: string) {
    this.router.navigate([this.object, id]);
    this.loadSpinner(200);
  }

  ngAfterViewInit(): void {
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
        setTimeout(() => {
          this.spinner.hide();
          this.screenSpinnerService.hide();
        }, 200);
      });
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
    if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    }
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
    this.confirmationService.confirm({
      message: this.translate.instant("COMMUN.CONFIRM_MSG"),
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.delete(data);
        this.messageService.add({
          severity: "success",
          summary: "Opération effectué avec succée."
        });
      }
    });
  }
}
