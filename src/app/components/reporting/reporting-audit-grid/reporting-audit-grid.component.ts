import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ScreenSpinnerService} from "../../../business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {AuditSite} from "../../../business/models/sites/audit-site";
import {AuditSiteService} from "../../../business/services/sites/audit-site.service";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-reporting-audit-grid',
  templateUrl: './reporting-audit-grid.component.html'
})
export class ReportingAuditGridComponent implements OnInit, AfterViewInit {

  constructor(private auditSiteService: AuditSiteService,
              private translate: TranslateService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.emptyData = true;
    registerLocaleData(localeFr);
    this.datasource = new MatTableDataSource<AuditSite>();
  }

  datasource: MatTableDataSource<AuditSite>;
  displayedColumns: string[] = ["id", "typeAuditSiteLabel", "auditDate", "siteUserV1", "siteUserV2", "siteCode", "description", "currentSatusLabel"];
  emptyData: boolean;

  resultsLength = 0;
  pagesLength = 10;
  isLoadingResults = true;
  isRateLimitReached = false;

  @Input() search: string;
  @Input() sortField: string;
  @Input() sortBy: string;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @Output() clickShow = new EventEmitter<string>();

  ngOnInit() {
    this.datasource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.loadAllData();
  }

  public showDetail(search: string) {

    this.clickShow.emit(search);
    this.loadAllData();
  }

  private loadAllData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.auditSiteService.searchLazyData(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sortBy,
            this.sortField,
            this.search
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
        this.screenSpinnerService.hide(200);
      });
  }

}
