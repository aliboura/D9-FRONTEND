import {Component, OnInit} from '@angular/core';
import {ReportsName} from "../../../business/models/sites/reports-name";
import {JwtTokenService} from "../../../business/services/apps/jwt-token.service";
import {UserService} from "../../../business/services/admin/user.service";
import {WilayaRegion} from "../../../business/models/referencial/wilaya-region";
import {StatusService} from "../../../business/services/referencial/status.service";
import {Status} from "../../../business/models/referencial/status";
import {Observable} from "rxjs";

@Component({
  selector: 'app-reporting-view',
  templateUrl: './reporting-view.component.html'
})
export class ReportingViewComponent implements OnInit {

  constructor(
    private userService: UserService,
    private statusService: StatusService,
    private jwtTokenService: JwtTokenService) {
  }

  reports: ReportsName[];
  statusItems: Observable<Status[]>;
  type: ReportsName;
  cityItems: WilayaRegion[];
  regionId: string;

  ngOnInit() {
    this.userService.findByUserName(this.jwtTokenService.getUserName()).subscribe(data => {
      this.regionId = data.regionId;
      this.cityItems = data.wilayaSet;
    });
    this.statusItems = this.statusService.findAll();
    this.reports = this.loadData();
  }

  loadData(): ReportsName[] {
    return [{
      id: 1,
      label: 'Par Status'
    }, {
      id: 2,
      label: 'Par Wilaya'
    }, {
      id: 3,
      label: 'Par Status et Wilaya'
    }, {
      id: 4,
      label: 'Par Visite'
    }, {
      id: 5,
      label: 'Par Ingénieur'
    }];
  }

}
