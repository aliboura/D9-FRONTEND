import {Injectable} from '@angular/core';
import {ROLES_CODES} from "../../../tools/roles-codes";
import {STATIC_DATA} from "../../../tools/static-data";
import {Base64} from 'js-base64';
import {JwtHelperService} from "@auth0/angular-jwt";
import {CookieService} from "ngx-cookie";

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor(private cookieService: CookieService) {
  }


  public getToken() {
    return this.cookieService.get(STATIC_DATA.TOKEN);
  }

  public isSiteEngineer(): boolean {
    const roles = this.getUserRole();
    if (roles) {
      return roles.filter(x => Base64.decode(x) === ROLES_CODES.ENGINEER_SITE).length > 0;
    }
    return false;
  }

  public isAdmin(): boolean {
    const roles = this.getUserRole();
    if (roles) {
      return roles.filter(x => Base64.decode(x) === ROLES_CODES.ADMIN_ROLE).length > 0;
    }
    return false;
  }

  public isOMEngineer(): boolean {
    const roles = this.getUserRole();
    if (roles) {
      return roles.filter(x => Base64.decode(x) === ROLES_CODES.ENGINEER_OM).length > 0;
    }
    return false;
  }

  public isResponsible(): boolean {
    const roles = this.getUserRole();
    if (roles) {
      return roles.filter(x => Base64.decode(x) === ROLES_CODES.RESPONSABLE).length > 0;
    }
    return false;
  }

  public getFullName(): string {
    if (this.cookieService.hasKey(STATIC_DATA.FULL_NAME)) {
      return this.cookieService.get(STATIC_DATA.FULL_NAME);
    }
  }

  public getUserName(): string {
    if (this.cookieService.hasKey(STATIC_DATA.USER_NAME)) {
      return this.cookieService.get(STATIC_DATA.USER_NAME);
    }
  }

  isTokenExpired(token: string, offsetSeconds?: number): boolean {
    if (!token) {
      return true;
    }
    const jwtHelper = new JwtHelperService();
    return jwtHelper.isTokenExpired(token, offsetSeconds);
  }

  getExpired(token: string) {
    if (token) {
      const jwtHelper = new JwtHelperService();
      const date = new Date(0);
      date.setUTCSeconds(jwtHelper.decodeToken(token).exp);
      return date;
    }
  }

  isTokenNotExpired(token: string): boolean {
    return !this.isTokenExpired(token);
  }

  getUserRole() {
    if (localStorage.getItem(STATIC_DATA.ROLES)) {
      return localStorage.getItem(STATIC_DATA.ROLES).split(',');
    }
    return [];
  }

  sessionExpired(token): boolean {
    const date = this.getExpired(token);
    if (date) {
      return date.valueOf() < new Date().valueOf();
    } else {
      return true;
    }
  }

}
