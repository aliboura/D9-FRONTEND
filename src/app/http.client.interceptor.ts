import {Inject, Injectable, Injector} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {STATIC_DATA} from "./tools/static-data";
import {catchError, retry} from "rxjs/operators";
import {NOTYF} from "./tools/notyf.token";
import Notyf from "notyf/notyf";
import {Router} from "@angular/router";
import {JwtTokenService} from "./business/services/apps/jwt-token.service";
import {LoginService} from "./security/login.service";
import {JwtToken} from "./business/models/admin/jwt-token";

@Injectable({
  providedIn: 'root'
})
export class HttpClientInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private loginService: LoginService,
    private jwtTokenService: JwtTokenService,
    @Inject(NOTYF) private notyf: Notyf) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let jwtToken = this.loginService.getToken();
    // if (this.jwtTokenService.getToken() && this.jwtTokenService.isTokenExpired(jwtToken)) {
    //   this.loginService.onRefresh(new JwtToken(jwtToken, this.jwtTokenService.getFullName()));
    //   jwtToken = this.loginService.getToken();
    // }
    const cloned = req.clone({
      headers: req.headers.set('Authorization',
        jwtToken)
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
        type = 2;
        console.log('403');
      } else if (error.status === 404) {
        type = 3;
        console.log('404');
      }
      console.log('500');
      this.router.navigate(['apps-exceptions', type]);
      this.notyf.error(`Error Code : ${error.status}\nMessage: ${error.message}`);
      return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
    }

  }
}
