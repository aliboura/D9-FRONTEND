import {Inject, Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, filter, retry} from "rxjs/operators";
import {NOTYF} from "./tools/notyf.token";
import Notyf from "notyf/notyf";
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import {JwtTokenService} from "./business/services/apps/jwt-token.service";
import {LoginService} from "./security/login.service";
import {STATIC_DATA} from "./tools/static-data";
import {LogoutService} from "./security/logout/logout.service";
import {CookieService} from "ngx-cookie";

@Injectable({
  providedIn: 'root'
})
export class HttpClientInterceptor implements HttpInterceptor {

  currentPath: string;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private logOutService: LogoutService,
    private cookieService: CookieService,
    private jwtTokenService: JwtTokenService,
    @Inject(NOTYF) private notyf: Notyf) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: RouterEvent) => {
      this.currentPath = event.url;
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let jwtToken = this.cookieService.get(STATIC_DATA.TOKEN);
    if (jwtToken && this.logOutService.showLogout.value === false && this.jwtTokenService.isTokenExpired(jwtToken, 59)) {
      if (this.currentPath && this.currentPath !== '/login') {
        this.logOutService.show();
      }
      return;
    }
    let reqOptions = new HttpHeaders().set('Content-Type', 'application/json');
    const cloned = req.clone({
      headers: jwtToken ? reqOptions.set('Authorization', `DjezzyDevs-${jwtToken}`) : reqOptions
    });
    return next.handle(cloned).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  private handleError(error) {
    if (error instanceof ErrorEvent) {
      this.notyf.error(`Error: ${error.message}`);
      return throwError(`Error: ${error.message}`);
    } else {
      let type = 1;
      if (error.status === 403) {
        this.loginService.onLogOut();
      } else if (error.status === 404) {
        type = 3;
      }
      this.router.navigate(['apps-exceptions', type]);
      this.notyf.error(`Error Code : ${error.status}\nMessage: ${error.message}`);
      return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
    }

  }
}
