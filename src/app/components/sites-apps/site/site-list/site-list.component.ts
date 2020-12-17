import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Site} from "../../../../business/models/sites/site";
import {SiteService} from "../../../../business/services/sites/site.service";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {merge, of as observableOf} from "rxjs";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {UserService} from "../../../../business/services/admin/user.service";
import {User} from "../../../../business/models/admin/user";
import {WilayaRegion} from "../../../../business/models/referencial/wilaya-region";
import {UtilsService} from "../../../../tools/utils.service";

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html'
})
export class SiteListComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private siteService: SiteService,
              private utilsService: UtilsService,
              private jwtTokenService: JwtTokenService,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  datasource: MatTableDataSource<Site>;
  displayedColumns: string[] = ["codeSite", "dateD1", "nomSite", "numSite", "typeSiteLib", "wilayaLabel", "userV1", "userOMV1"];
  columnsToDisplay: string[];

  resultsLength = 0;
  pagesLength = 10;
  isLoadingResults = true;
  isRateLimitReached = false;
  user: User;
  wilayaItems: WilayaRegion[];
  codeSite: string;
  wilayaFilterItems: WilayaRegion[] = [];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.columnsToDisplay = this.displayedColumns.slice();
    this.columnsToDisplay.unshift("id");
    this.columnsToDisplay.push("action");
  }

  ngAfterViewInit(): void {
    this.userService.findByUserName(this.jwtTokenService.getUserName()).subscribe(data => {
      this.user = data;
      this.wilayaItems = this.user.wilayaSet;
      let search = 'regionId==' + this.user.regionId + ';wilaya.id=in=(' + this.wilayaItems.map(x => x.id).toString() + ')';
      this.loadAllData(search);
    });
  }

  showMySites(event) {
    let search = '';
    if (event.checked) {
      if (this.jwtTokenService.isSiteEngineer()) {
        search = 'visitPlanningList.engineerSiteV1==' + this.jwtTokenService.getUserName();
      } else if (this.jwtTokenService.isOMEngineer() && !this.jwtTokenService.isSiteEngineer()) {
        search = 'visitPlanningList.engineerOMV1==' + this.jwtTokenService.getUserName();
      }
    } else {
      search = 'regionId==' + this.user.regionId + ';wilaya.id=in=(' + this.wilayaItems.map(x => x.id).toString() + ')';
    }
    this.loadAllData(search);
  }

  filter() {
    let search = 'regionId==' + this.user.regionId;
    if (this.codeSite) {
      search = search + ';codeSite==' + this.codeSite;
    }
    if (this.wilayaFilterItems.length > 0) {
      search = search + ';wilaya.id=in=(' + this.wilayaFilterItems.toString() + ')';
    } else {
      search = search + ';wilaya.id=in=(' + this.wilayaItems.map(x => x.id).toString() + ')';
    }
    this.loadAllData(search);
  }

  reset() {
    this.codeSite = "";
    this.wilayaFilterItems = [];
    let search = 'regionId==' + this.user.regionId + ';wilaya.id=in=(' + this.wilayaItems.map(x => x.id).toString() + ')';
    this.loadAllData(search);
  }

  showEdit(id: string) {
    this.router.navigate([btoa("" + id)], {relativeTo: this.route});
  }

  goToForms(id: string) {
    this.router.navigate(['forms', btoa("" + id)], {relativeTo: this.route});
  }


  private loadAllData(search: string) {
    this.screenSpinnerService.show();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.siteService.searchLazyData(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            "desc",
            "dateD1",
            search
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
        this.screenSpinnerService.hide(200);
      });
  }

  disabledUploadBtn(site: Site): boolean {
    if (this.utilsService.equalsWithIgnoreCase(site.userV1, this.jwtTokenService.getUserName())) {
      return false;
    }

    if (this.utilsService.equalsWithIgnoreCase(site.userV1, this.jwtTokenService.getUserName())) {
      return false;
    }
    return true;
  }

  showAdd() {
    this.router.navigate(['add'], {relativeTo: this.route});
    this.screenSpinnerService.show();
  }

  isEngineer() {
    return this.jwtTokenService.isSiteEngineer();
  }
}
