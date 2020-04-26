import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Role} from "../../models/admin/role";
import {ROLES_CODES} from "../../../tools/roles-codes";
import {CookieService} from "ngx-cookie-service";
import {STATIC_DATA} from "../../../tools/static-data";
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor(private cookieService: CookieService) {
  }

  public isAdmin(token: string): boolean {
    const jwtHelper = new JwtHelperService();
    const roles: Role[] = jwtHelper.decodeToken(token).roles;
    if (roles) {
      return roles.filter(x => x.authority === ROLES_CODES.ADMIN_ROLE).length > 0;
    }
    return false;
  }

  public isSiteEngineer(token: string): boolean {
    const jwtHelper = new JwtHelperService();
    const roles: Role[] = jwtHelper.decodeToken(token).roles;
    if (roles) {
      return roles.filter(x => x.authority === ROLES_CODES.ENGINEER_SITE).length > 0;
    }
    return false;
  }

  public isOMEngineer(token: string): boolean {
    const jwtHelper = new JwtHelperService();
    const roles: Role[] = jwtHelper.decodeToken(token).roles;
    if (roles) {
      return roles.filter(x => x.authority === ROLES_CODES.ENGINEER_OM).length > 0;
    }
    return false;
  }

  public getFullName(): string {
    if (this.cookieService.check(STATIC_DATA.FULL_NAME)) {
      return this.cookieService.get(STATIC_DATA.FULL_NAME);
    }
  }

  public getUserName(): string {
    if (this.cookieService.check(STATIC_DATA.USER_NAME)) {
      return this.cookieService.get(STATIC_DATA.USER_NAME);
    }
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  isTokenNotExpired(token: string): boolean {
    return !this.isTokenExpired(token);
  }

}
