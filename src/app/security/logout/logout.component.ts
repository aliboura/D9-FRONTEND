import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LogoutService} from "./logout.service";
import {CountdownComponent} from "ngx-countdown";
import {LoginService} from "../login.service";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(private logoutService: LogoutService,
              private loginService: LoginService,
              private screenSpinnerService: ScreenSpinnerService) {
  }

  @Input()
  showLogout: boolean;

  @ViewChild('cd', {static: false}) private countdown: CountdownComponent;

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
    this.loginService.onRefresh();
    this.screenSpinnerService.hide(200);
    setTimeout(() => {
      this.logoutService.hide();
    }, 300);

  }

}
