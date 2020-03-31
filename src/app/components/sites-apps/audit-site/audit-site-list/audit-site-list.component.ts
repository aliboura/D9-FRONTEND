import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {MatTableDataSource} from "@angular/material/table";
import {Site} from "../../../../business/models/sites/site";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {merge, Observable, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {StatusEnum} from "../../../../business/models/referencial/status.enum";

@Component({
  selector: 'app-audit-site-list',
  templateUrl: './audit-site-list.component.html'
})
export class AuditSiteListComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private audiSiteService: AuditSiteService,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.screenSpinnerService.show();
    this.spinner.show();
    this.emptyData = true;
  }

  datasource: MatTableDataSource<AuditSite>;
  displayedColumns: string[] = ["auditDate", "userId", "siteCode", "description", "currentSatusLabel"];
  columnsToDisplay: string[];
  emptyData: boolean;

  resultsLength = 0;
  pagesLength = 10;
  isLoadingResults = true;
  isRateLimitReached = false;
  statusEnums = StatusEnum;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.columnsToDisplay = this.displayedColumns.slice();
    this.columnsToDisplay.unshift("id");
    this.columnsToDisplay.push("action");
  }

  ngAfterViewInit(): void {
    this.loadAllData();
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
    this.router.navigate(["sites-apps/audit/search"]);
    this.loadSpinner(200);
  }

  showEdit(id: string) {
    this.router.navigate(["sites-apps/audit/edit", btoa("" + id)]);
    this.loadSpinner(200);
  }

  private loadAllData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.audiSiteService.findLazyData(
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
          this.pagesLength = this.paginator.pageSize;
          return data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.datasource = new MatTableDataSource<AuditSite>(data);
        this.emptyData = data.length === 0;
        this.datasource.sort = this.sort;
        setTimeout(() => {
          this.spinner.hide();
          this.screenSpinnerService.hide();
        }, 200);
      });
  }


}
