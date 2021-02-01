import {Component, HostListener, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ScreenSpinnerService} from "./business/services/apps/screen-spinner.service";
import {TranslateService} from "@ngx-translate/core";
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {LogoutService} from "./security/logout/logout.service";
import {Subject} from "rxjs";
import {JwtTokenService} from "./business/services/apps/jwt-token.service";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'network-acceptance';

  userActivity;

  userInactive: Subject<any> = new Subject();

  constructor(private spinner: NgxSpinnerService,
              private translate: TranslateService,
              public logoutService: LogoutService,
              private jwtTokenService: JwtTokenService,
              public screenSpinnerService: ScreenSpinnerService) {

    translate.addLangs(['fr']);
    translate.setDefaultLang('fr');
    const browserLang = translate.getBrowserLang();
    translate.use('fr');
    registerLocaleData(localeFr, 'fr');
    if (this.jwtTokenService.getToken()) {
      this.setTimeout();
      this.userInactive.subscribe(() => console.log('user has been inactive for 3s'));
    }
  }

  ngOnInit(): void {
    this.screenSpinnerService.show();
    this.screenSpinnerService.hide(200);
  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 60000);
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
}
