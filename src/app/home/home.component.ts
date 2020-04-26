import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "../business/services/apps/screen-spinner.service";
import {SiteService} from "../business/services/sites/site.service";
import {AuditSiteService} from "../business/services/sites/audit-site.service";
import {StatusEnum} from "../business/models/referencial/status.enum";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }


}
