import {Component, OnInit} from '@angular/core';
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {Observable} from "rxjs";
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {switchMap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuditSiteLine} from "../../../../business/models/sites/audit-site-line";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {Decision} from "../../../../business/models/referencial/decision";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {MatTableDataSource} from "@angular/material";
import {Group} from "../../../../business/models/referencial/group";
import {StatusEnum} from "../../../../business/models/referencial/status.enum";
import {DatePipe} from "@angular/common";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {CookieService} from "ngx-cookie-service";
import {STATIC_DATA} from "../../../../tools/static-data";

@Component({
  selector: 'app-audit-site-edit',
  templateUrl: './audit-site-edit.component.html'
})
export class AuditSiteEditComponent implements OnInit {

  constructor(private auditSiteService: AuditSiteService,
              private decisionService: DecisionService,
              private jwtTokenService: JwtTokenService,
              private cookieService: CookieService,
              private route: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private screenSpinnerService: ScreenSpinnerService) {
    this.columns = [{
      field: 'label',
      flex: '0 0 50%'
    }, {
      field: 'firstDecisionLabel',
      flex: '0 0 15%'
    }, {
      field: 'secondDecisionLabel',
      flex: '0 0 15%'
    }, {
      field: 'observation',
      flex: '0 0 20%'
    }];
    this.displayedColumns = this.columns.map(column => column.field);
    this.groupByColumns = ['categoriesLabel'];
  }

  public dataSource = new MatTableDataSource<AuditSiteLine | Group>([]);
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];
  showNextVisitBtn = true;

  auditSite: AuditSite = new AuditSite();
  private obAuditSite: Observable<AuditSite>;
  decisionList: Decision[];
  statusEnum = StatusEnum;
  isEngineer: boolean;


  ngOnInit() {
    this.obAuditSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.auditSiteService.findById(atob(params.get("id")))
      )
    );
    this.obAuditSite.subscribe(data => {
      this.auditSite = data;
      this.dataSource = new MatTableDataSource<AuditSiteLine | Group>(this.addGroups(data.auditSiteLineDtoList, this.groupByColumns));
      this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
      this.dataSource.filter = performance.now().toString();
      this.showNextVisitBtn = this.getShowSecondVisit();
      this.screenSpinnerService.hide(200);
    }, (err: any) => console.log(err));

    this.decisionService.findAll().subscribe(data => {
      this.decisionList = data.filter(x => x.position === 1);
    });
    const token = this.cookieService.get(STATIC_DATA.TOKEN);
    this.isEngineer = this.jwtTokenService.isSiteEngineer(token) || this.jwtTokenService.isOMEngineer(token);
  }

  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  groupHeaderClick(row) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();  // bug here need to fix
  }

  addGroups(data: AuditSiteLine[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map(
        row => {
          const result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach(group => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) {
          return false;
        }
        let match = true;
        this.groupByColumns.forEach(column => {
          if (!row[column] || !data[column] || row[column] !== data[column]) {
            match = false;
          }
        });
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  public proceed() {
    this.router.navigate(['steps', btoa("" + this.auditSite.id)], {relativeTo: this.route.parent});
  }

  public backToList() {
    this.router.navigate(['.'], {relativeTo: this.route.parent});
  }

  public secondVisit() {
    this.router.navigate(['second', btoa("" + this.auditSite.id)], {relativeTo: this.route.parent});
  }

  public goToValidate() {
    this.router.navigate(['finish', btoa("" + this.auditSite.id)], {relativeTo: this.route.parent});
  }

  showAdd() {
    this.router.navigate(['search'], {relativeTo: this.route.parent});
  }

  getShowSecondVisit(): boolean {
    return (this.auditSite.currentSatusLabel === StatusEnum.Accepted || this.auditSite.currentSatusLabel === StatusEnum.NoConform)
      && this.auditSite.firstVisit && !this.auditSite.secondVisit;
  }

  disabledValidateBtn(): boolean {
    return this.auditSite.lastStep &&
      (this.auditSite.currentSatusLabel === StatusEnum.InProgressValidate
        || this.auditSite.currentSatusLabel === StatusEnum.InProgressValidateV2
        || this.auditSite.currentSatusLabel === StatusEnum.ValidateBySiteEngineer);
  }

  getDateFormat(myDate: Date): string {
    return this.datePipe.transform(myDate, 'dd-MM-yyyy h:mm a');
  }

  get dateAudit(): string {
    if (this.auditSite.auditDate) {
      return this.datePipe.transform(this.auditSite.auditDate, 'dd-MM-yyyy');
    } else {
      return "";
    }
  }

}
