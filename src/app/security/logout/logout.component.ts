import {Component, Inject, Input, OnInit} from '@angular/core';
import {LogoutService} from "./logout.service";
import {LoginService} from "../login.service";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";
import {JwtTokenService} from "../../business/services/apps/jwt-token.service";
import {Router} from "@angular/router";
import {NOTYF} from "../../tools/notyf.token";
import Notyf from "notyf/notyf";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(
    private route: Router,
    private logoutService: LogoutService,
    private loginService: LoginService,
    private translate: TranslateService,
    private jwtTokenService: JwtTokenService,
    private screenSpinnerService: ScreenSpinnerService,
    @Inject(NOTYF) private notyf: Notyf) {
  }

  @Input()
  showLogout: boolean;

  ngOnInit() {
  }

  hide() {
    this.logoutService.hide();
    this.loginService.onLogOut();
  }

  show() {
    this.logoutService.show();
  }

  onRefresh() {
    this.screenSpinnerService.show();
    this.loginService.onRefresh().subscribe(jwtToken => {
      if (jwtToken.success) {
        this.loginService.saveRefreshToken(jwtToken.body);
        this.notyf.success('Token Refresh');
        this.logoutService.hide();
        this.screenSpinnerService.hide(200);
        //window.location.reload();
      } else {
        this.notyf.error(jwtToken.message);
      }
    });
  }

  async reload(url: string): Promise<boolean> {
    await this.route.navigateByUrl('.', {skipLocationChange: true});
    return this.route.navigateByUrl(url);
  }


}
