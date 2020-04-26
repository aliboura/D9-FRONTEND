import {Component, Inject, OnInit} from '@angular/core';
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {MatTableDataSource} from "@angular/material";
import {AuditSiteLine} from "../../../../business/models/sites/audit-site-line";
import {Group} from "../../../../business/models/referencial/group";
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {Observable} from "rxjs";
import {Decision} from "../../../../business/models/referencial/decision";
import {switchMap} from "rxjs/operators";
import {StatusEnum} from "../../../../business/models/referencial/status.enum";
import {StatusService} from "../../../../business/services/referencial/status.service";
import {NOTYF} from "../../../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-audit-site-second-visit',
  templateUrl: './audit-site-second-visit.component.html'
})
export class AuditSiteSecondVisitComponent implements OnInit {

  constructor(private auditSiteService: AuditSiteService,
              private decisionService: DecisionService,
              private statusService: StatusService,
              private route: ActivatedRoute,
              private router: Router,
              private screenSpinnerService: ScreenSpinnerService,
              private translate: TranslateService,
              @Inject(NOTYF) private notyf: Notyf) {
    this.showSpinner();
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
  success: false;

  auditSite: AuditSite = new AuditSite();
  private obAuditSite: Observable<AuditSite>;
  decisionList: Decision[];

  ngOnInit() {
    this.obAuditSite = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.auditSiteService.findById(atob(params.get("id")))
      )
    );
    this.obAuditSite.subscribe(data => {
      this.auditSite = data;
      const list = this.getSeconVisitItems(data.auditSiteLineDtoList);
      this.dataSource = new MatTableDataSource<AuditSiteLine | Group>(this.addGroups(list, this.groupByColumns));
      this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
      this.dataSource.filter = performance.now().toString();
      this.screenSpinnerService.hide(200);
    }, (err: any) => console.log(err));

    this.decisionService.findAll().subscribe(data => {
      this.decisionList = data.filter(x => x.position === 1);
    });
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

  private showSpinner() {
    this.screenSpinnerService.show();
  }

  private getSeconVisitItems(auditSiteLineDtoList: AuditSiteLine[]): AuditSiteLine[] {
    if (auditSiteLineDtoList) {
      return auditSiteLineDtoList.filter(x => x.firstDecisionLabel !== null &&
        (x.firstDecisionLabel === StatusEnum.NA || x.firstDecisionLabel === StatusEnum.NoConform));
    } else {
      return [];
    }
  }

  public backToEdit() {
    this.router.navigate(['edit', btoa("" + this.auditSite.id)], {relativeTo: this.route});
  }

  public saveSecondVisit() {
    this.auditSiteService.saveSecondVisit(this.auditSite).subscribe(x => {
      this.auditSite = x;
      this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
      this.router.navigate(['edit', btoa("" + this.auditSite.id)], {relativeTo: this.route});
    });
  }

}
