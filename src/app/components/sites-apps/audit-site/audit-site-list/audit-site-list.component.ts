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
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {UserService} from "../../../../business/services/admin/user.service";
import {User} from "../../../../business/models/admin/user";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-audit-site-list',
  templateUrl: './audit-site-list.component.html'
})
export class AuditSiteListComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private audiSiteService: AuditSiteService,
              private userService: UserService,
              public jwtTokenService: JwtTokenService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.emptyData = true;
  }

  dataSource: MatTableDataSource<AuditSite>;
  displayedColumns: string[] = ["id", "siteCode", "auditDate", "typeSiteId", "siteUserV1", "siteUserOMV1", "currentSatusLabel", "action"];
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
    this.isEngineer = this.jwtTokenService.isSiteEngineer();
    this.screenSpinnerService.hide(200);
  }

  ngAfterViewInit(): void {
    this.loadAllData(this.jwtTokenService.getUserName());
  }

  showAdd() {
    this.router.navigate(['search'], {relativeTo: this.route});
    this.screenSpinnerService.show();
  }

  showEdit(id: string) {
    this.router.navigate(['edit', btoa("" + id)], {relativeTo: this.route});
    this.screenSpinnerService.show();
  }

  private loadAllData(username: string) {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.audiSiteService.findByEngineerSite(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            "desc",
            "id",
            username
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
        this.dataSource = new MatTableDataSource<AuditSite>(data);
        this.emptyData = data.length === 0;
        this.dataSource.sort = this.sort;
        this.screenSpinnerService.hide(200);
      });
  }

  disabledValidateBtn(element: AuditSite) {
    return element.lastStep &&
      (element.currentSatusLabel === StatusEnum.InProgressValidate
        || element.currentSatusLabel === StatusEnum.InProgressValidateV2
        || element.currentSatusLabel === StatusEnum.ValidateBySiteEngineer
        || element.currentSatusLabel === StatusEnum.ValidateByOMEngineer);
  }

  public goToValidate(id: number) {
    this.router.navigate(['finish', btoa("" + id)], {relativeTo: this.route});
  }

  exportToPdf(auditSite: AuditSite) {
    this.screenSpinnerService.show();
    this.audiSiteService.exportToPdf(auditSite.id).subscribe(x => {
      const blob = new Blob([x, 'application/pdf'], {type: 'application/pdf'});
      const file = new File([blob], "Forms-D9-" + auditSite.siteCode + ".pdf", {type: 'application/pdf'});
      saveAs(file);
      this.screenSpinnerService.hide(100);
    });
  }

  exportToExcel(auditSite: AuditSite) {
    this.screenSpinnerService.show();
    this.audiSiteService.exportToExcel(auditSite.id).subscribe(x => {
      const blob = new Blob([x, 'application/vnd.ms-excel'], {type: 'application/vnd.ms-excel'});
      const file = new File([blob], "Forms-D9-" + auditSite.siteCode + ".xls", {type: 'application/vnd.ms-excel'});
      saveAs(file);
      this.screenSpinnerService.hide(100);
    });
  }
}
