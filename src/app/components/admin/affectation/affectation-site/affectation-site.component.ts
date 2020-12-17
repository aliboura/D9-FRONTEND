import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {UserService} from "../../../../business/services/admin/user.service";
import {User} from "../../../../business/models/admin/user";
import {MatTableDataSource} from "@angular/material/table";
import {SiteService} from "../../../../business/services/sites/site.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {WilayaRegion} from "../../../../business/models/referencial/wilaya-region";
import {ActivatedRoute, Router} from "@angular/router";
import {VisitPlanning} from "../../../../business/models/sites/visit-planning";
import {VisitPlanningService} from "../../../../business/services/sites/visit-planning.service";
import {DatePipe} from "@angular/common";
import {ROLES_CODES} from "../../../../tools/roles-codes";

@Component({
  selector: 'app-affectation-site',
  templateUrl: './affectation-site.component.html'
})
export class AffectationSiteComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private userService: UserService,
    private siteService: SiteService,
    private visitPlanningService: VisitPlanningService,
    private jwtTokenService: JwtTokenService,
    private screenSpinnerService: ScreenSpinnerService,
    @Inject(NOTYF) private notyf: Notyf) {
    this.datasource = new MatTableDataSource<VisitPlanning>();
  }

  datasource: MatTableDataSource<VisitPlanning>;
  displayedColumns: string[] = ["id", "siteCode", "dateD1", "typeSiteId", "regionId", "wilayaLabel", "engineerSiteV1", "engineerSiteDateV1", "engineerSiteV2", "engineerSiteDateV2", "action"];
  pagesLength;
  resultsLength = 0;
  emptyData: boolean;
  userItems: User[];
  userEngineerItems: User[];
  wilayaItems: WilayaRegion[];
  user: User;
  wilayaSelected: number[] = [];
  private cities: number[] = [];

  regionId: string;
  codeSite: string;
  advSearch: boolean;
  secondVisit: boolean;
  fromDate: Date;
  toDate: Date;


  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.pagesLength = 10;
    this.advSearch = false;
    this.secondVisit = false;
  }

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
    this.userService.findByUserName(this.jwtTokenService.getUserName()).subscribe(data => {
      this.regionId = data.regionId;
      this.wilayaItems = data.wilayaSet;
      this.loadSiteData("");
      this.loadUserItems(data.regionId);
    });
  }

  loadUserItems(regionId: string) {
    this.userService.findAll().subscribe(users => {
      this.userItems = users.filter(x => x.regionId === regionId);
    });
  }

  goToFirstVisit() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }

  showEdit(id: string) {
    this.router.navigate([btoa("" + id)], {relativeTo: this.route});
  }

  onSelectUser(event) {
    if (event) {
      this.user = event;
      this.wilayaItems = this.user.wilayaSet;
      this.wilayaSelected = [];
    }
  }

  checkSecondVisit() {
    if (this.secondVisit) {
      this.userEngineerItems = this.userItems.filter(x => this.checkRoles(x, ROLES_CODES.ENGINEER_OM));
    } else {
      this.userEngineerItems = this.userItems.filter(x => this.checkRoles(x, ROLES_CODES.ENGINEER_SITE));
    }
  }

  private checkRoles(user: User, role: string): boolean {
    return user.roleSet.filter(x => 'ROLE_' + x.label === role).length > 0;
  }

  showAdvSearch() {
    this.advSearch = true;
    this.userEngineerItems = this.userItems.filter(x => this.checkRoles(x, ROLES_CODES.ENGINEER_SITE));
  }

  hideAdvSearch() {
    this.advSearch = false;
  }

  filter() {
    if (this.wilayaSelected.length === 0) {
      this.cities = this.wilayaItems.map(x => x.id);
    }
    if (this.codeSite) {
      this.loadSiteData("1");
    }
  }

  advFilter() {
    if (this.wilayaSelected.length === 0) {
      this.wilayaSelected = this.wilayaItems.map(x => x.id);
    }
    if (this.secondVisit) {
      this.loadSiteData("3");
    } else {
      this.loadSiteData("2");
    }
  }

  reset() {
    this.user = null;
    this.wilayaSelected = [];
    this.codeSite = "";
    this.fromDate = null;
    this.toDate = null;
    this.loadSiteData("");
  }


  private loadSiteData(type: string) {
    this.screenSpinnerService.show();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          switch (type) {
            case "1":
              return this.findByCode(
                this.wilayaSelected.length === 0 ? this.cities : this.wilayaSelected,
                this.codeSite
              );
            case "2":
              return this.findFirstVisitPlannings(
                this.wilayaSelected,
                this.user.username,
                this.fromDate,
                this.toDate);
            case "3":
              return this.findSecondVisitPlannings(
                this.wilayaSelected,
                this.user.username,
                this.fromDate,
                this.toDate);
            default:
              return this.findByCities(
                this.wilayaItems
              );
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
        this.datasource = new MatTableDataSource<VisitPlanning>(data);
        this.emptyData = data.length === 0;
        this.datasource.sort = this.sort;
        this.screenSpinnerService.hide(200);
      });
  }

  findByCities(wilayaSet: WilayaRegion[]) {
    return this.visitPlanningService.findByCities(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      "desc",
      "site.dateD1",
      wilayaSet.map(x => x.id).toString()
    );
  }

  findByCode(wilayaSet: number[], codeSite: string) {
    return this.visitPlanningService.findByCode(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      "desc",
      "site.dateD1",
      codeSite,
      wilayaSet.toString()
    );
  }

  findFirstVisitPlannings(wilayaSet: number[], codeSite: string, fromDate: Date, toDate: Date) {
    return this.visitPlanningService.findFirstVisitPlannings(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      "desc",
      "site.dateD1",
      codeSite,
      this.getDateFormat(fromDate),
      this.getDateFormat(toDate),
      wilayaSet.toString()
    );
  }

  findSecondVisitPlannings(wilayaSet: number[], codeSite: string, fromDate: Date, toDate: Date) {
    return this.visitPlanningService.findSecondVisitPlannings(
      this.paginator.pageIndex,
      this.paginator.pageSize,
      "desc",
      "site.dateD1",
      codeSite,
      this.getDateFormat(fromDate),
      this.getDateFormat(toDate),
      wilayaSet.toString()
    );
  }

  private getDateFormat(myDate: Date): string {
    return this.datePipe.transform(myDate, 'dd-MM-yyyy');
  }

}
