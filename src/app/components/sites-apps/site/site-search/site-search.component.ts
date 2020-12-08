import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SiteService} from "../../../../business/services/sites/site.service";
import {SiteSearch} from "../../../../business/models/sites/site-search";
import {Site} from "../../../../business/models/sites/site";
import {MatTableDataSource} from "@angular/material/table";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../../../../business/services/apps/screen-spinner.service";
import {DatePipe} from "@angular/common";
import {WilayaService} from "../../../../business/services/referencial/wilaya.service";
import {Wilaya} from "../../../../business/models/referencial/wilaya";
import {TypeSiteService} from "../../../../business/services/referencial/type-site.service";
import {SiteType} from "../../../../business/models/sites/SiteType";
import {RegionService} from "../../../../business/services/referencial/region.service";
import {Region} from "../../../../business/models/referencial/region";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {UserService} from "../../../../business/services/admin/user.service";
import {WilayaRegion} from "../../../../business/models/referencial/wilaya-region";
import {User} from "../../../../business/models/admin/user";
import {merge, of as observableOf} from "rxjs";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-site-search',
  templateUrl: './site-search.component.html',
  providers: [DatePipe]
})
export class SiteSearchComponent implements OnInit {

  searchSite: SiteSearch;
  dataSource: MatTableDataSource<Site>;
  regionOptions: string[] = [];
  wilayaOptions: WilayaRegion[];
  typeSiteOptions: SiteType[];
  user: User;
  region: string;

  pagesLength;
  resultsLength = 0;
  emptyData: boolean;
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @Input() pageSize;
  @Input() showBtn;
  @Output() pushDataEvent = new EventEmitter();
  @Output() showEvent = new EventEmitter();
  @Output() noDataEvent = new EventEmitter();

  constructor(private datePipe: DatePipe,
              private siteService: SiteService,
              private userService: UserService,
              private regionService: RegionService,
              private typeSiteService: TypeSiteService,
              private jwtTokenService: JwtTokenService,
              private screenSpinnerService: ScreenSpinnerService) {
    this.dataSource = new MatTableDataSource<Site>();
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.searchSite = new SiteSearch();
    this.userService.findByUserName(this.jwtTokenService.getUserName()).subscribe(data => {
      this.user = data;
      this.wilayaOptions = this.user.wilayaSet;
      this.region = this.user.regionId;
    });
    this.typeSiteService.findAll().subscribe(data => {
      this.typeSiteOptions = data;
    });
  }

  public filter() {
    this.screenSpinnerService.show();
    let search = this.getQuery(this.searchSite);
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

  private loadSiteData(search: string) {
    this.screenSpinnerService.show();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith(null),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.siteService.searchLazyData(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            "desc",
            "dateD1",
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
        this.dataSource = new MatTableDataSource<Site>(data);
        this.emptyData = data.length === 0;
        this.dataSource.sort = this.sort;
        this.screenSpinnerService.hide(200);
      });
  }

  public reset() {
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

  private getQuery(searchSite: SiteSearch): string {
    let search = '';
    search = search + "regionId==" + searchSite.regionId + ";wilaya.id=in=(" + this.wilayaOptions.map(x => x.id).toString() + ")";
    if (searchSite) {
      if (searchSite.codeSite) {
        search = search + "codeSite==" + searchSite.codeSite + ",";
      }
      if (searchSite.numSite) {
        search = search + "numSite==" + searchSite.numSite + ",";
      }
      if (searchSite.nomSite) {
        search = search + "nomSite==" + searchSite.nomSite + ",";
      }
      if (searchSite.dateD1) {
        search = search + "dateD1==" + this.datePipe.transform(searchSite.dateD1, 'yyyy-MM-dd') + ",";
      }

      if (searchSite.typeSiteId) {
        search = search + "typeSite.id==" + searchSite.typeSiteId + ",";
      }
    }

    return search.substring(0, search.length - 2);
  }

}
