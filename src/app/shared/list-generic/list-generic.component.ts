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

@Component({
  selector: "app-list-generic",
  templateUrl: "./list-generic.component.html",
  styleUrls: ["./list-generic.component.css"]
})
export class ListGenericComponent<T extends Parents>
  implements OnInit, AfterViewInit {
  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
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
  isLoadingResults = true;
  isRateLimitReached = false;

  // tslint:disable-next-line: variable-name
  viewDirection_: Observable<string>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.spinner.show();
    this.displayedColumns = this.columnsToDisplay.slice();
    this.displayedColumns.unshift("id");
    this.displayedColumns.push("action");
  }

  showAdd() {
    this.router.navigate([this.object + "/add"]);
  }

  showEdit(id: string) {
    this.router.navigate([this.object, id]);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.spinner.show();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.spinner.show();
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
        this.spinner.hide();
        this.datasource.sort = this.sort;
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
      message: "Êtes-vous sûr de vouloir suprimer cette ligne?",
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
