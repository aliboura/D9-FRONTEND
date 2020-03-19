import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SiteService} from "../../../../business/services/sites/site.service";
import {Site} from "../../../../business/models/sites/site";
import {SelectionModel} from "@angular/cdk/collections";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-audit-site-search',
  templateUrl: './audit-site-search.component.html'
})
export class AuditSiteSearchComponent implements OnInit {

  constructor(private router: Router,
              private siteService: SiteService) {
  }

  datasource: MatTableDataSource<Site> = new MatTableDataSource<Site>();
  noData = this.datasource.connect().pipe(map(d => d.length === 0));
  displayedColumns: string[] = ["codeSite", "dateD1", "nomSite", "numSite", "typeSiteId", "regionId", "wilayaLabel"];
  columnsToDisplay: string[];
  pagesLength = 5;
  resultsLength = 0;
  idSite: number;

  public selectedSite = new SelectionModel<Site>(false);

  ngOnInit() {
    this.columnsToDisplay = this.displayedColumns.slice();
    this.columnsToDisplay.unshift("id");
  }

  goToNext() {
    if (this.selectedSite.hasValue()) {
      this.idSite = this.selectedSite.selected[0].id;
      this.router.navigate(["sites-apps/audit/add", this.idSite]);
    }
  }

}
