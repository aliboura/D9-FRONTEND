import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {StatusEnum} from "../../../../business/models/referencial/status.enum";
import {STATIC_DATA} from "../../../../tools/static-data";
import {CookieService} from "ngx-cookie-service";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {UserService} from "../../../../business/services/admin/user.service";
import {User} from "../../../../business/models/admin/user";

@Component({
  selector: 'app-audit-site-list',
  templateUrl: './audit-site-list.component.html'
})
export class AuditSiteListComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private audiSiteService: AuditSiteService,
              private userService: UserService,
              private cookieService: CookieService,
              private jwtTokenService: JwtTokenService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.emptyData = true;
  }

  datasource: MatTableDataSource<AuditSite>;
  displayedColumns: string[] = ["id", "typeAuditSiteLabel", "auditDate", "userId", "siteCode", "description", "currentSatusLabel", "action"];
  emptyData: boolean;

  resultsLength = 0;
  pagesLength = 10;
  isLoadingResults = true;
  isRateLimitReached = false;
  isEngineer: boolean;
  user: User = new User();


  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    const token: string = this.cookieService.get(STATIC_DATA.TOKEN);
    this.isEngineer = this.jwtTokenService.isSiteEngineer(token);

  }

  ngAfterViewInit(): void {
    this.userService.findByUserName('ryadh.boumendjas').subscribe(data => {
      this.user = data;
      this.loadAllData(this.user);
    });
  }

  showAdd() {
    this.router.navigate(['search'], {relativeTo: this.route});
    this.screenSpinnerService.show();
  }

  showEdit(id: string) {
    this.router.navigate(['edit', btoa("" + id)], {relativeTo: this.route});
    this.screenSpinnerService.show();
  }

  private loadAllData(user: User) {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    let search = "regionId==" + this.user.regionId;
    if (user.wilayaSet.length > 0) {
      search = search + ";wilayaId=in=(" + user.wilayaSet.map(x => x.id).toString() + ")";
    }
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.audiSiteService.searchLazyData(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            "desc",
            "id",
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
        this.datasource = new MatTableDataSource<AuditSite>(data);
        this.emptyData = data.length === 0;
        this.datasource.sort = this.sort;
        this.screenSpinnerService.hide(200);
      });
  }

  disabledValidateBtn(element: AuditSite): boolean {
    return element.lastStep &&
      (element.currentSatusLabel === StatusEnum.InProgressValidate || element.currentSatusLabel === StatusEnum.InProgressValidateV2
        || element.currentSatusLabel === StatusEnum.ValidateBySiteEngineer);
  }

  public goToValidate(id: number) {
    this.router.navigate(['finish', btoa("" + id)], {relativeTo: this.route});
  }

}
