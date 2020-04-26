import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SiteService} from "../../../../business/services/sites/site.service";
import {SiteSearch} from "../../../../business/models/sites/site-search";
import {Site} from "../../../../business/models/sites/site";
import {MatTableDataSource} from "@angular/material/table";
import {map} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {DatePipe} from "@angular/common";
import {WilayaService} from "../../../../business/services/referencial/wilaya.service";
import {Wilaya} from "../../../../business/models/referencial/wilaya";
import {TypeSiteService} from "../../../../business/services/referencial/type-site.service";
import {TypeSite} from "../../../../business/models/referencial/type-site";
import {RegionService} from "../../../../business/services/referencial/region.service";
import {Region} from "../../../../business/models/referencial/region";

@Component({
  selector: 'app-site-search',
  templateUrl: './site-search.component.html',
  providers: [DatePipe]
})
export class SiteSearchComponent implements OnInit {

  searchSite: SiteSearch;
  dataSource: MatTableDataSource<Site>;
  regionOptions: Region[];
  wilayaOptions: Wilaya[];
  typeSiteOptions: TypeSite[];

  @Input() pageSize;
  @Input() showBtn;
  @Output() pushDataEvent = new EventEmitter();
  @Output() showEvent = new EventEmitter();
  @Output() noDataEvent = new EventEmitter();

  constructor(private datePipe: DatePipe,
              private siteService: SiteService,
              private regionService: RegionService,
              private wilayaService: WilayaService,
              private typeSiteService: TypeSiteService,
              private spinner: NgxSpinnerService,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  ngOnInit() {
    this.searchSite = new SiteSearch();
    this.regionService.findAll().subscribe(data => {
      this.regionOptions = data;
    });
    this.wilayaService.findAll().subscribe(data => {
      this.wilayaOptions = data;
    });
    this.typeSiteService.findAll().subscribe(data => {
      this.typeSiteOptions = data;
    });
  }

  onChangeRegion($event) {
    if (this.searchSite.regionId) {
      this.wilayaService.findByRegion(this.searchSite.regionId).subscribe(data => {
        this.wilayaOptions = data;
      });
    }
  }

  onClearRegion($event) {
    this.wilayaService.findAll().subscribe(data => {
      this.wilayaOptions = data;
    });
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
      if (this.searchSite.dateD1) {
        if (search === "") {
          search = search + "dateD1==" + this.datePipe.transform(this.searchSite.dateD1, 'yyyy-MM-dd');
        } else {
          search = search + ",dateD1==" + this.datePipe.transform(this.searchSite.dateD1, 'yyyy-MM-dd');
        }
      }
      if (this.searchSite.wilayaId) {
        if (search === "") {
          search = search + "wilaya.id==" + this.searchSite.wilayaId;
        } else {
          search = search + ",wilaya.id==" + this.searchSite.wilayaId;
        }
      }
      if (this.searchSite.regionId) {
        if (search === "") {
          search = search + "regionId==" + this.searchSite.regionId;
        } else {
          search = search + ",regionId==" + this.searchSite.regionId;
        }
      }
      if (this.searchSite.typeSiteId) {
        if (search === "") {
          search = search + "typeSite.id==" + this.searchSite.typeSiteId;
        } else {
          search = search + ",typeSite.id==" + this.searchSite.typeSiteId;
        }
      }
    }
    if (search !== "") {
      this.siteService.searchLazyData(0, this.pageSize, "asc", "id", search)
        .pipe(
          map(dt => {
            return dt.content;
          })
        )
        .subscribe(data => {
          this.dataSource = new MatTableDataSource<Site>(data);
          this.pushDataEvent.emit(this.dataSource);
          this.noDataEvent.emit(data.length === 0);
          this.screenSpinnerService.hide(200);
        });
    } else {
      this.screenSpinnerService.hide(200);
    }
  }

  public reset() {
    this.spinner.show();
    this.screenSpinnerService.show();
    this.searchSite = null;
    this.searchSite = new SiteSearch();
    this.siteService.findLazyData(0, this.pageSize, "asc", "id")
      .pipe(
        map(dt => {
          return dt.content;
        })
      )
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Site>(data);
        this.pushDataEvent.emit(this.dataSource);
        this.screenSpinnerService.hide(200);
      });
  }

  showAdvancedSearch() {
    this.showEvent.emit(false);
  }

}
