import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SiteService} from "../../../../business/services/sites/site.service";
import {Site} from "../../../../business/models/sites/site";
import {SelectionModel} from "@angular/cdk/collections";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";

@Component({
  selector: 'app-audit-site-search',
  templateUrl: './audit-site-search.component.html'
})
export class AuditSiteSearchComponent implements OnInit {

  constructor(private router: Router,
              private siteService: SiteService,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.screenSpinnerService.show();
    this.spinner.show();
  }

  emptyData: boolean;
  showBackBtn = false;

  datasource: MatTableDataSource<Site> = new MatTableDataSource<Site>();
  displayedColumns: string[] = ["codeSite", "dateD1", "nomSite", "numSite", "typeSiteLib", "regionId", "wilayaLabel"];
  columnsToDisplay: string[];
  pagesLength = 5;
  resultsLength = 0;
  idSite: number;

  public selectedSite = new SelectionModel<Site>(false);

  ngOnInit() {
    this.columnsToDisplay = this.displayedColumns.slice();
    this.columnsToDisplay.unshift("id");
    this.emptyData = true;
    setTimeout(() => {
      this.spinner.hide();
      this.screenSpinnerService.hide();
    }, 200);
  }

  goToNext() {
    if (this.selectedSite.hasValue()) {
      this.idSite = this.selectedSite.selected[0].id;
      this.router.navigate(["sites-apps/audit/add", this.idSite]);
    }
  }

}
