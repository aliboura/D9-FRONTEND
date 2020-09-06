import {Injectable} from '@angular/core';
import {ROLES_CODES} from "../../../tools/roles-codes";
import {CookieService} from "ngx-cookie-service";
import {STATIC_DATA} from "../../../tools/static-data";
import * as jwt_decode from "jwt-decode";
import {RoleService} from "../admin/role.service";

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

   constructor(private roleService: RoleService,
              private cookieService: CookieService) {
  }


  public getToken() {
    return this.cookieService.get(STATIC_DATA.TOKEN);
  }

  public isSiteEngineer(): boolean {
    const roles = this.getUserRole();
    if (roles) {
      return roles.filter(x => x === ROLES_CODES.ENGINEER_SITE).length > 0;
    }
    return false;
  }

  public isAdmin(): boolean {
    const roles = this.getUserRole();
    if (roles) {
      return roles.filter(x => x === ROLES_CODES.ADMIN_ROLE).length > 0;
    }
    return false;
  }

  public isOMEngineer(): boolean {
    const roles = this.getUserRole();
    if (roles) {
      return roles.filter(x => x === ROLES_CODES.ENGINEER_OM).length > 0;
    }
    return false;
  }

  public isResponsible(): boolean {
    const roles = this.getUserRole();
    if (roles) {
      return roles.filter(x => x === ROLES_CODES.RESPONSABLE).length > 0;
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

  getUserRole() {
    if (this.cookieService.check(STATIC_DATA.ROLES)) {
      return this.cookieService.get(STATIC_DATA.ROLES).split(',');
    }
    return [];
  }

}
