import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Site} from "../../../../business/models/sites/site";
import {SelectionModel} from "@angular/cdk/collections";
import {SiteService} from "../../../../business/services/sites/site.service";
import {map} from "rxjs/operators";
import {sha1} from "@angular/compiler/src/i18n/digest";
import {UserService} from "../../../../business/services/admin/user.service";
import {JwtTokenService} from "../../../../business/services/apps/jwt-token.service";
import {User} from "../../../../business/models/admin/user";

@Component({
  selector: 'app-users-site',
  templateUrl: './users-site.component.html'
})
export class UsersSiteComponent implements OnInit {

  constructor(private siteService: SiteService,
              private userService: UserService,
              private jwtTokenService: JwtTokenService) {
  }

  showDlg = false;
  datasource: MatTableDataSource<Site> = new MatTableDataSource<Site>();
  displayedColumns: string[] = ["codeSite", "dateD1", "typeSiteLib", "regionId", "wilayaLabel"];
  pagesLength = 5;
  resultsLength = 0;
  idSite: number;
  emptyData: boolean;


  ngOnInit() {
    this.emptyData = true;
  }

  findSite() {
    this.showDlg = true;
    this.userService.findByUserName(this.jwtTokenService.getUserName()).subscribe(data => {
      this.loadSiteData(data);
    });
  }

  loadSiteData(user: User) {
    let search = "audited==false;regionId==" + user.regionId;
    if (user.wilayaSet.length > 0) {
      search = search + ";wilaya.id=in=(" + user.wilayaSet.map(x => x.id).toString() + ")";
    }
    this.siteService.searchLazyData(0, this.pagesLength, "asc", "id", search)
      .pipe(
        map(dt => {
          return dt.content;
        })
      )
      .subscribe(data => {
        this.datasource = new MatTableDataSource<Site>(data);
        this.emptyData = false;
      });
  }

}
