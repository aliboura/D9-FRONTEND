import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../../business/services/admin/user.service";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {VisitPlanning} from "../../../../business/models/sites/visit-planning";
import {VisitPlanningService} from "../../../../business/services/sites/visit-planning.service";

@Component({
  selector: 'app-affectation-second',
  templateUrl: './affectation-second.component.html'
})
export class AffectationSecondComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private visitPlanningService: VisitPlanningService,
              private userService: UserService,
              private auditSiteService: AuditSiteService,
              private jwtTokenService: JwtTokenService,
              private screenSpinnerService: ScreenSpinnerService,
              @Inject(NOTYF) private notyf: Notyf) {
    this.datasource = new MatTableDataSource<VisitPlanning>();
  }

  datasource: MatTableDataSource<VisitPlanning>;
  displayedColumns: string[] = ["id", "siteCode", "dateD1", "typeSiteId", "wilayaLabel", "engineerSiteV1", "engineerSiteDateV1", "engineerSiteV2", "engineerSiteDateV2", "action"];
  pagesLength;
  resultsLength = 0;
  emptyData: boolean;

  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.pagesLength = 10;
  }

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
    this.loadSiteData(this.jwtTokenService.getUserName());
  }

  private loadSiteData(username: string) {
    this.screenSpinnerService.show();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    let search = "engineerSiteV1==" + username + ",engineerOMV1==" + username + ",engineerSiteV2==" + username + ",engineerOMV2==" + username;
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.visitPlanningService.searchLazyData(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            "desc",
            "engineerSiteDateV1",
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
        this.datasource = new MatTableDataSource<VisitPlanning>(data);
        this.emptyData = data.length === 0;
        this.datasource.sort = this.sort;
        this.screenSpinnerService.hide(200);
      });
  }

  goToAdd(id: number) {
    this.screenSpinnerService.show();
    this.router.navigate(['/sites-apps/audit/add', btoa('' + id)]);
  }

}
