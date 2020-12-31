import {Inject, Injectable} from '@angular/core';
import {STATIC_DATA} from "../tools/static-data";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {API_URLs} from "../tools/api-url";
import {NgForm} from "@angular/forms";
import {NOTYF} from "../tools/notyf.token";
import Notyf from "notyf/notyf";
import {TranslateService} from "@ngx-translate/core";
import {ROLES_CODES} from "../tools/roles-codes";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Role} from "../business/models/admin/role";
import {JwtToken} from "../business/models/admin/jwt-token";
import {CookieService} from "ngx-cookie-service";
import {UserService} from "../business/services/admin/user.service";
import {ScreenSpinnerService} from "../business/services/apps/screen-spinner.service";
import {Base64} from 'js-base64';
import {EncrDecrService} from "./encr-decr.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private jwtToken: JwtToken;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private translate: TranslateService,
    private cookieService: CookieService,
    private encrDecrService: EncrDecrService,
    private screenSpinnerService: ScreenSpinnerService,
    @Inject(NOTYF) private notyf: Notyf
  ) {
  }

  postLogin(user: NgForm) {
    return this.http.post<JwtToken>(API_URLs.AUTH_URL + "/login", user);
  }

  onRefresh() {
    return this.http
      .post<JwtToken>(API_URLs.AUTH_URL + "/refresh", {}, {withCredentials: true})
      .pipe(
        map((jwtToken) => {
            if (jwtToken.success) {
              this.saveToken(this.jwtToken);
              this.notyf.success('Token Refresh');
              return jwtToken;
            }
          }
        ));
  }


  public saveToken(jwt: JwtToken) {
    this.clearCookies();
    const token = jwt.body;
    const jwtHelper = new JwtHelperService();
    const username = jwtHelper.decodeToken(token).sub;
    const fullName = jwtHelper.decodeToken(token).name;
    this.cookieService.set(STATIC_DATA.TOKEN, token);
    this.userService.findByUserName(username).subscribe(user => {
      if (user) {
        if (user.enabled) {
          if (user.roleSet && user.roleSet.length > 0) {
            this.cookieService.set(STATIC_DATA.USER_NAME, username);
            this.cookieService.set(STATIC_DATA.FULL_NAME, fullName);
            const roles = user.roleSet.map(role => Base64.encode('ROLE_' + role.label));
            this.cookieService.set(STATIC_DATA.ROLES, roles.toString());
            this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
            this.router.navigateByUrl('/home');
          } else {
            this.notyf.error(`Veuillez contactez l'adminstrateur pour vous affeter un role`);
            this.cookieService.deleteAll();
          }
        } else {
          this.notyf.error(`l'utilisateur : ${user.fullName} est désactivé`);
          this.cookieService.deleteAll();
        }
      } else {
        this.notyf.error(`cet utilisateur n'a pas un accés veuillez contacter l'admin`);
        this.cookieService.deleteAll();
      }
    });
  }


  public getUserName() {
    return this.cookieService.get(STATIC_DATA.USER_NAME);
  }

  private checkAdmin(roles: Role[]): boolean {
    if (roles) {
      return roles.filter(x => x.authority === ROLES_CODES.ADMIN_ROLE).length > 0;
    }
    return false;
  }

  public clearCookies() {
    this.cookieService.deleteAll();
  }

  public onLogOut() {
    this.router.navigate(['login']).then(r => {
      this.jwtToken = null;
      this.clearCookies();
    });
  }


  private refreshTokenTimeout;

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = this.cookieService.get(STATIC_DATA.TOKEN);

    // set a timeout to refresh the token a minute before it expires
    const jwtHelper = new JwtHelperService();
    const expires = new Date(jwtHelper.decodeToken(jwtToken).exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.onRefresh().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

}
