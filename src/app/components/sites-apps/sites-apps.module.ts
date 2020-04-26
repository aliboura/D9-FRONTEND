import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SitesAppsRoutingModule} from "./sites-apps-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {SitesAppsComponent} from "./sites-apps.component";
import {BadgeStatusComponent} from './badge-status/badge-status.component';
import {TemplatesModule} from "../../templates/templates.module";


@NgModule({
    declarations: [SitesAppsComponent, BadgeStatusComponent],
    exports: [
        BadgeStatusComponent
    ],
    imports: [
        CommonModule,
        SitesAppsRoutingModule,
        SharedModule,
        TemplatesModule
    ]
})
export class SitesAppsModule {
}
