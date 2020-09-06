import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./importes/material/material.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {ReferencialModule} from "./components/referencial/referencial.module";
import {SharedModule} from "./shared/shared.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {NOTYF, notyfFactory} from "./tools/notyf.token";
import {NgxCoolDialogsService} from "ngx-cool-dialogs";
import {ClarityModule} from '@clr/angular';
import {DatePipe, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {LoginComponent} from './security/login/login.component';
import {AuthGuardService} from "./security/auth-guard.service";
import {CookieService} from "ngx-cookie-service";
import {HttpClientInterceptor} from "./http.client.interceptor";
import {LoadGuardService} from "./security/load-guard.service";
import {ExceptionsComponent} from "./exceptions/exceptions.component";
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import {JwtTokenService} from "./business/services/apps/jwt-token.service";
import {TemplatesModule} from "./templates/templates.module";
import {FullLayoutComponent} from "./templates/full-layout/full-layout.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ExceptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ClarityModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgxSpinnerModule,
    ReferencialModule,
    NgSelectModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxChartsModule,
    ClarityModule,
    PdfJsViewerModule,
    TemplatesModule
  ],
  providers: [
    JwtTokenService,
    AuthGuardService,
    LoadGuardService,
    NgxCoolDialogsService,
    DatePipe,
    {provide: NOTYF, useFactory: notyfFactory},
    CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpClientInterceptor, multi: true},
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: 'fr'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


