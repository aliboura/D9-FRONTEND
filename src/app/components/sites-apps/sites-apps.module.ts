import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SitesAppsRoutingModule} from "./sites-apps-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {SitesAppsComponent} from "./sites-apps.component";


@NgModule({
  declarations: [SitesAppsComponent],
  imports: [
    CommonModule,
    SitesAppsRoutingModule,
    SharedModule
  ]
})
export class SitesAppsModule {
}
