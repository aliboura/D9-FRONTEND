import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SiteService} from "../../../../business/services/sites/site.service";
import {Site} from "../../../../business/models/sites/site";
import {SelectionModel} from "@angular/cdk/collections";
import {ActivatedRoute, Router} from "@angular/router";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {WilayaRegion} from "../../../../business/models/referencial/wilaya-region";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {User} from "../../../../business/models/admin/user";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {UserService} from "../../../../business/services/admin/user.service";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";

@Component({
  selector: 'app-audit-site-search',
  templateUrl: './audit-site-search.component.html'
})
export class AuditSiteSearchComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private siteService: SiteService,
              private userService: UserService,
              private jwtTokenService: JwtTokenService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.screenSpinnerService.show();
  }

  emptyData: boolean;
  showBackBtn = false;

  datasource: MatTableDataSource<Site> = new MatTableDataSource<Site>();
  displayedColumns: string[] = ["codeSite", "dateD1", "nomSite", "numSite", "typeSiteLib", "regionId", "wilayaLabel"];
  columnsToDisplay: string[];
  pagesLength = 5;
  resultsLength = 0;
  idSite: number;

  isLoadingResults = true;
  isRateLimitReached = false;
  user: User;
  wilayaItems: WilayaRegion[];
  codeSite: string;
  wilayaFilterItems: WilayaRegion[] = [];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  //public selectedSite = new SelectionModel<Site>(false);

  ngOnInit() {
    this.columnsToDisplay = this.displayedColumns.slice();
    this.columnsToDisplay.unshift("id");
    this.columnsToDisplay.push("action");
    this.emptyData = true;
  }

  ngAfterViewInit(): void {
    this.userService.findByUserName(this.jwtTokenService.getUserName()).subscribe(data => {
      this.user = data;
      this.wilayaItems = this.user.wilayaSet;
      this.loadAllData(null, this.wilayaItems, this.user.username, '1');
    });
  }

  goToNext(idSite: number) {
       this.router.navigate(['add', btoa("" + idSite)], {relativeTo: this.route.parent});
  }

  public backToList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  filter() {
    if (this.codeSite && this.wilayaFilterItems.length > 0) {
      this.loadAllData(this.codeSite, this.wilayaItems, this.user.username, '3');
    } else if (this.codeSite && this.wilayaFilterItems.length === 0) {
      this.loadAllData(this.codeSite, null, this.user.username, '2');
    }
  }

  reset() {
    this.codeSite = "";
    this.wilayaFilterItems = [];
    this.loadAllData(null, this.wilayaItems, this.user.username, '1');
  }

  private loadAllData(codeSite: string, wilayaSet: WilayaRegion[], username: string, type: string) {
    this.screenSpinnerService.show();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          switch (type) {
            case '1' :
              return this.findSitesByUserWilayas(wilayaSet, username);
            case '2' :
              return this.findSites(codeSite, username);
            case '3' :
              return this.findSitesWilayas(codeSite, wilayaSet, username);
          }

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
        this.emptyData = data.length === 0;
        this.screenSpinnerService.hide(200);
      });
  }

  findSites(codeSite: string, username: string) {
    return this.siteService.findSites(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      "desc",
      "dateD1",
      codeSite,
      username
    );
  }

  findSitesWilayas(codeSite: string, wilayaSet: WilayaRegion[], username: string) {
    return this.siteService.findSitesWilayas(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      "desc",
      "dateD1",
      codeSite,
      wilayaSet.map(x => x.id).toString(),
      username)
      ;
  }


  findSitesByUserWilayas(wilayaSet: WilayaRegion[], username: string) {
    return this.siteService.findSitesByUserWilayas(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      "desc",
      "dateD1",
      username
    );
  }

}
