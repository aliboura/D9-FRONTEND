import {Inject, Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from "rxjs/operators";
import {NOTYF} from "./tools/notyf.token";
import Notyf from "notyf/notyf";
import {Router} from "@angular/router";
import {JwtTokenService} from "./business/services/apps/jwt-token.service";
import {LoginService} from "./security/login.service";
import {CookieService} from "ngx-cookie-service";
import {STATIC_DATA} from "./tools/static-data";

@Injectable({
  providedIn: 'root'
})
export class HttpClientInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private loginService: LoginService,
    private jwtTokenService: JwtTokenService,
    private cookieService: CookieService,
    @Inject(NOTYF) private notyf: Notyf) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let jwtToken = this.cookieService.get(STATIC_DATA.TOKEN);
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
        type = 2;
      } else if (error.status === 404) {
        type = 3;
      }
      this.router.navigate(['apps-exceptions', type]);
      this.notyf.error(`Error Code : ${error.status}\nMessage: ${error.message}`);
      return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
    }

  }
}
