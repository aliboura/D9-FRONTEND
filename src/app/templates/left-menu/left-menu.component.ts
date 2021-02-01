import {Component, OnInit} from '@angular/core';
import {RoutingStateService} from "../../business/services/apps/routing-state.service";
import {Router} from "@angular/router";
import {ScreenSpinnerService} from "../../business/services/apps/screen-spinner.service";
import {JwtTokenService} from "../../business/services/apps/jwt-token.service";

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {

  constructor(public jwtTokenService: JwtTokenService,
              private routingStateService: RoutingStateService,
              private screenSpinnerService: ScreenSpinnerService,
              private router: Router) {
    this.routingStateService.loadLastRouting();
    this.admin = this.jwtTokenService.isAdmin();
    this.responsible = this.jwtTokenService.isResponsible();
  }

  admin: boolean;
  responsible: boolean;

  ngOnInit() {
  }

  public navigate(link: string) {
    if (link !== this.activeLink) {
      this.screenSpinnerService.show();
    }
    this.router.navigate([link]);
  }

  public get activeLink() {
    return this.routingStateService.getLastLink();
  }

}
