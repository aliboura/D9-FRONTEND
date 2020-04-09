import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FullLayoutComponent} from './templates/full-layout/full-layout.component';
import {FooterComponent} from './templates/footer/footer.component';
import {LeftMenuComponent} from './templates/left-menu/left-menu.component';
import {MaterialModule} from "./importes/material/material.module";
import {PrimengModule} from "./importes/primeng/primeng.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {ReferencialModule} from "./components/referencial/referencial.module";
import {SharedModule} from "./shared/shared.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgSelectModule} from "@ng-select/ng-select";
import {HomeComponent} from './home/home.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {NOTYF, notyfFactory} from "./tools/notyf.token";
import {NgxCoolDialogsService} from "ngx-cool-dialogs";

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    FooterComponent,
    LeftMenuComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    PrimengModule,
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
    NgxChartsModule
  ],
  providers: [
    NgxCoolDialogsService,
    {provide: NOTYF, useFactory: notyfFactory}
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
