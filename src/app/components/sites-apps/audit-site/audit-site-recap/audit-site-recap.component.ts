import {Component, Input, OnInit} from '@angular/core';
import {AuditSiteService} from "../../../../business/services/sites/audit-site.service";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {AuditSite} from "../../../../business/models/sites/audit-site";
import {DecisionService} from "../../../../business/services/referencial/decision.service";
import {MatTableDataSource} from "@angular/material";
import {AuditSiteLine} from "../../../../business/models/sites/audit-site-line";
import {Group} from "../../../../business/models/referencial/group";

@Component({
  selector: 'app-audit-site-recap',
  templateUrl: './audit-site-recap.component.html'
})
export class AuditSiteRecapComponent implements OnInit {


  constructor(
    private decisionService: DecisionService,
    private auditSiteService: AuditSiteService,
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

  @Input() auditSite: AuditSite;
  recapAudit: AuditSite;
  public dataSource = new MatTableDataSource<AuditSiteLine | Group>([]);
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];

  ngOnInit() {
    this.recapAudit = this.auditSite;
    this.dataSource = new MatTableDataSource<AuditSiteLine | Group>(this.addGroups(this.auditSite.auditSiteLineDtoList, this.groupByColumns));
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    this.dataSource.filter = performance.now().toString();
    this.screenSpinnerService.hide(200);
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

}
