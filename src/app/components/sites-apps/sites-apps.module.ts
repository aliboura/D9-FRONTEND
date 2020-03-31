import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SitesAppsRoutingModule} from "./sites-apps-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {SitesAppsComponent} from "./sites-apps.component";
import {MaterialModule} from "../../importes/material/material.module";
import { BadgeStatusComponent } from './badge-status/badge-status.component';


@NgModule({
    declarations: [SitesAppsComponent, BadgeStatusComponent],
    exports: [
        BadgeStatusComponent
    ],
    imports: [
        CommonModule,
        SitesAppsRoutingModule,
        SharedModule
    ]
})
export class SitesAppsModule {
}
