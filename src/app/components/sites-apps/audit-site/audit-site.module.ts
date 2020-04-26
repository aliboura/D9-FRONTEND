import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuditSiteComponent} from './audit-site.component';
import {AuditSiteRoutingModule} from "./audit-site-routing.module";
import {SharedModule} from "../../../shared/shared.module";
import {AuditSiteListComponent} from './audit-site-list/audit-site-list.component';
import {AuditSiteAddComponent} from './audit-site-add/audit-site-add.component';
import {AuditSiteEditComponent} from './audit-site-edit/audit-site-edit.component';
import {MaterialModule} from "../../../importes/material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {AuditSiteSearchComponent} from './audit-site-search/audit-site-search.component';
import {SiteModule} from "../site/site.module";
import {FormsModule} from "@angular/forms";
import {AuditSiteStepsComponent} from './audit-site-steps/audit-site-steps.component';
import {AuditSiteFinishComponent} from './audit-site-finish/audit-site-finish.component';
import {SitesAppsModule} from "../sites-apps.module";
import {FilterPipe} from './filter.pipe';
import {AuditSiteSecondVisitComponent} from './audit-site-second-visit/audit-site-second-visit.component';
import {ClrDatagridModule, ClrIconModule, ClrInputModule, ClrSpinnerModule} from "@clr/angular";
import {TemplatesModule} from "../../../templates/templates.module";


@NgModule({
  declarations: [AuditSiteComponent,
    AuditSiteListComponent,
    AuditSiteAddComponent,
    AuditSiteEditComponent,
    AuditSiteSearchComponent,
    AuditSiteStepsComponent,
    AuditSiteFinishComponent,
    FilterPipe,
    AuditSiteSecondVisitComponent],
    imports: [
        CommonModule,
        AuditSiteRoutingModule,
        SharedModule,
        MaterialModule,
        TranslateModule,
        SiteModule,
        FormsModule,
        SitesAppsModule,
        ClrDatagridModule,
        ClrIconModule,
        ClrSpinnerModule,
        ClrInputModule,
        TemplatesModule
    ]
})
export class AuditSiteModule {
}
