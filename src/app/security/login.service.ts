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
import {UserService} from "../business/services/admin/user.service";
import {Base64} from 'js-base64';
import {CookieService} from 'ngx-cookie';
import {appCookies} from "../tools/cookies-options";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private jwtToken: JwtToken;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService,
    private translate: TranslateService,
    @Inject(NOTYF) private notyf: Notyf
  ) {
  }

  postLogin(user: NgForm) {
    return this.http.post<JwtToken>(API_URLs.AUTH_URL + "/login", user);
  }

  onRefresh() {
    return this.http.post<JwtToken>(API_URLs.AUTH_URL + "/refresh", this.cookieService.get(STATIC_DATA.USER_NAME), {withCredentials: true});
  }

  public saveRefreshToken(jwt: string) {
    // @ts-ignore
    this.cookieService.put(STATIC_DATA.TOKEN, jwt, appCookies.Options);
  }

  public saveToken(jwt: JwtToken) {
    this.clearCookies();
    const token = jwt.body;
    const jwtHelper = new JwtHelperService();
    const username = jwtHelper.decodeToken(token).sub;
    const options = appCookies.Options;
    // @ts-ignore
    this.cookieService.put(STATIC_DATA.TOKEN, token, options);
    this.userService.findByUserName(username).subscribe(user => {
      if (user) {
        if (user.enabled) {
          if (user.roleSet && user.roleSet.length > 0) {
            // @ts-ignore
            this.cookieService.put(STATIC_DATA.USER_NAME, username, options);
            // @ts-ignore
            this.cookieService.put(STATIC_DATA.FULL_NAME, user.fullName, options);
            const roles = user.roleSet.map(role => Base64.encode('ROLE_' + role.label));
            // @ts-ignore
            this.cookieService.put(STATIC_DATA.ROLES, roles.toString(), options);
            this.notyf.success(this.translate.instant("COMMUN.PERFORMED_MSG"));
            this.router.navigateByUrl('/home');
          } else {
            this.notyf.error(`Veuillez contactez l'adminstrateur pour vous affeter un role`);
            // @ts-ignore
            this.cookieService.removeAll(options);
          }
        } else {
          this.notyf.error(`l'utilisateur : ${user.fullName} est désactivé`);
          // @ts-ignore
          this.cookieService.removeAll(options);
        }
      } else {
        this.notyf.error(`cet utilisateur n'a pas un accés veuillez contacter l'admin`);
        // @ts-ignore
        this.cookieService.removeAll(options);
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
    this.cookieService.removeAll();
  }

  public onLogOut() {
    this.router.navigate(['login']).then(r => {
      this.jwtToken = null;
      this.cookieService.removeAll();
    });
  }

}
