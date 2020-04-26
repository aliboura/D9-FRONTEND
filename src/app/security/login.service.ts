import {Inject, Injectable} from '@angular/core';
import {STATIC_DATA} from "../tools/static-data";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
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

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private jwtToken: JwtToken;


  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private cookieService: CookieService,
    @Inject(NOTYF) private notyf: Notyf
  ) {
  }


  public onLogin(user: NgForm) {
    return this.http
      .post<JwtToken>(API_URLs.AUTH_URL + "/login", user, {
        observe: "response"
      })
      .subscribe(
        data => {
          this.jwtToken = data.body;
          if (this.jwtToken !== null) {
            this.saveToken(this.jwtToken);
            this.router.navigate(["apps/home"]).then(r => this.router.initialNavigation());
            this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
          }
        },
        error => {
          this.notyf.error(error.error.message);
        }
      );
  }

  public saveToken(jwt: JwtToken) {
    if (jwt) {
      const token = "Bearer-" + jwt.jwttoken;
      const jwtHelper = new JwtHelperService();
      this.cookieService.set(STATIC_DATA.TOKEN, token);
      this.cookieService.set(STATIC_DATA.USER_NAME, jwtHelper.decodeToken(token).sub);
      this.cookieService.set(STATIC_DATA.FULL_NAME, jwt.currentUser);
    }
  }

  public getToken() {
    return this.cookieService.get(STATIC_DATA.TOKEN);
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

}
