import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SiteService} from "../../../../business/services/sites/site.service";
import {SiteSearch} from "../../../../business/models/sites/site-search";
import {Site} from "../../../../business/models/sites/site";
import {MatTableDataSource} from "@angular/material/table";
import {map, switchMap} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";

@Component({
  selector: 'app-site-search',
  templateUrl: './site-search.component.html'
})
export class SiteSearchComponent implements OnInit {

  searchSite: SiteSearch;
  dataSource: MatTableDataSource<Site>;

  @Output() pushDataEvent = new EventEmitter();

  constructor(private siteService: SiteService,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  ngOnInit() {
    this.searchSite = new SiteSearch();
  }


  public filter() {
    this.spinner.show();
    this.screenSpinnerService.show();
    let search = "";
    if (this.searchSite) {
      if (this.searchSite.codeSite) {
        if (search === "") {
          search = search + "codeSite==" + this.searchSite.codeSite;
        } else {
          search = search + ",codeSite==" + this.searchSite.codeSite;
        }
      }
      if (this.searchSite.numSite) {
        if (search === "") {
          search = search + "numSite==" + this.searchSite.numSite;
        } else {
          search = search + ",numSite==" + this.searchSite.numSite;
        }
      }
      if (this.searchSite.nomSite) {
        if (search === "") {
          search = search + "nomSite==" + this.searchSite.nomSite;
        } else {
          search = search + ",nomSite==" + this.searchSite.nomSite;
        }
      }
    }
    this.siteService.searchLazyData(0, 10, "asc", "id", search)
      .pipe(
        map(dt => {
          return dt.content;
        })
      )
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Site>(data);
        this.pushDataEvent.emit(this.dataSource);
        setTimeout(() => {
          this.spinner.hide();
          this.screenSpinnerService.hide();
        }, 200);
      });
  }

  public reset() {
    this.searchSite = null;
    this.searchSite = new SiteSearch();
  }

}
