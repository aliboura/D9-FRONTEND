import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Site} from "../../../../business/models/sites/site";
import {SiteService} from "../../../../business/services/sites/site.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {merge, of as observableOf} from "rxjs";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {catchError, map, startWith, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html'
})
export class SiteListComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private siteService: SiteService,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.screenSpinnerService.show();
    this.spinner.show();
  }

  datasource: MatTableDataSource<Site>;
  displayedColumns: string[] = ["codeSite", "dateD1", "nomSite", "numSite", "typeSiteId", "regionId", "wilayaLabel"];
  columnsToDisplay: string[];

  resultsLength = 0;
  pagesLength = 10;
  isLoadingResults = true;
  isRateLimitReached = false;
  showAdvanced = false;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.columnsToDisplay = this.displayedColumns.slice();
    this.columnsToDisplay.unshift("id");
    this.columnsToDisplay.push("action");
  }

  private loadSpinner(timeout: number) {
    this.screenSpinnerService.show();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.screenSpinnerService.hide();
    }, timeout);
  }

  showEdit(id: string) {
    this.router.navigate(["sites", id]);
    this.loadSpinner(200);
  }

  ngAfterViewInit(): void {
    this.loadAllData();
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      const search = "codeSite==" + filterValue.trim().toLowerCase() + ",numSite==" + filterValue.trim().toLowerCase() +
        ",nomSite==" + filterValue.trim().toLowerCase() + ",regionId==" + filterValue.trim().toLowerCase()
        + ",typeSite.id==" + filterValue.trim().toLowerCase();
      this.filter(search);
    } else {
      this.loadAllData();
    }
  }

  showAdvancedSearch() {
    this.showAdvanced = true;
  }

  private loadAllData() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.siteService.findLazyData(
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
        this.datasource = new MatTableDataSource<Site>(data);
        this.datasource.sort = this.sort;
        setTimeout(() => {
          this.spinner.hide();
          this.screenSpinnerService.hide();
        }, 200);
      });
  }

  private filter(search: string) {
    this.siteService.searchLazyData(0, this.pagesLength, "asc", "id", search)
      .pipe(
        map(dt => {
          return dt.content;
        })
      )
      .subscribe(data => {
        this.datasource = new MatTableDataSource<Site>(data);
        this.datasource.paginator.firstPage();
      });
  }

}
