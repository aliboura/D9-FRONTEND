import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "./business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {LogoutService} from "./security/logout/logout.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'network-acceptance';

  constructor(private spinner: NgxSpinnerService,
              private translate: TranslateService,
              public logoutService: LogoutService,
              public screenSpinnerService: ScreenSpinnerService) {

    translate.addLangs(['fr']);
    translate.setDefaultLang('fr');
    const browserLang = translate.getBrowserLang();
    translate.use('fr');
    registerLocaleData(localeFr, 'fr');
  }

  ngOnInit(): void {
    this.screenSpinnerService.show();
    this.screenSpinnerService.hide(200);
  }
}
