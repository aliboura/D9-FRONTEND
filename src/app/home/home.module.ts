import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {TranslateModule} from "@ngx-translate/core";
import {MaterialModule} from "../importes/material/material.module";
import {HomeComponent} from "./home.component";
import {AppModule} from "../app.module";
import {TemplatesModule} from "../templates/templates.module";


@NgModule({
  declarations: [DashboardComponent, HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgxChartsModule,
    TranslateModule,
    MaterialModule,
    TemplatesModule
  ]
})
export class HomeModule {
}
