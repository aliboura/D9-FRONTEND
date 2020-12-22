import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from "@angular/router";
import {Observable} from "rxjs";
import {LoginService} from "./login.service";
import {JwtTokenService} from "../business/services/apps/jwt-token.service";
import {CookieService} from "ngx-cookie-service";
import {STATIC_DATA} from "../tools/static-data";

@Injectable()
export class LoadGuardService implements CanLoad {

  constructor(private router: Router,
              private cookieService: CookieService,
              private jwtTokenService: JwtTokenService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    console.log('path: ', route.path);
    let check = true;
    if (route.path === 'referencial' || route.path === 'admin') {
      if (this.jwtTokenService.isAdmin()) {
        check = true;
      } else {
        check = false;
      }
    } else if (route.path === 'sites-apps' || route.path === 'reporting') {
      if (this.jwtTokenService.isSiteEngineer()) {
        check = true;
      } else if (this.jwtTokenService.isOMEngineer()) {
        check = true;
      } else if (this.jwtTokenService.isResponsible()) {
        check = true;
      } else {
        check = false;
      }
    }
    if (!check) {
      this.router.navigate(['apps-exceptions', '2']);
    }
    return check;
  }
}
