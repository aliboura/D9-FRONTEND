import {Inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {STATIC_DATA} from "../tools/static-data";
import {CookieService} from "ngx-cookie-service";
import {JwtTokenService} from "../business/services/apps/jwt-token.service";
import {LoginService} from "./login.service";
import {NOTYF} from "../tools/notyf.token";
import Notyf from "notyf/notyf";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router,
              private jwtTokenService: JwtTokenService,
              private loginService: LoginService,
              private  cookieService: CookieService,
              @Inject(NOTYF) private notyf: Notyf) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {

    if (this.cookieService.check(STATIC_DATA.TOKEN)) {
      if (this.jwtTokenService.isTokenNotExpired(this.cookieService.get(STATIC_DATA.TOKEN))) {
        return true;
      } else {
        this.notyf.error("Token expired");
      }
    }
    this.loginService.onLogOut();
    return false;
  }

}
