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
    const token = this.cookieService.get(STATIC_DATA.TOKEN);
    if (route.path === 'decisions' || route.path === 'categories' || route.path === 'sub-categories'
      || route.path === 'status' || route.path == 'decisionTypes') {
      if (!this.jwtTokenService.isAdmin(token)) {
        this.router.navigate(['apps-exceptions', '2']);
        return false;
      }
    }
    return true;
  }
}
