import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SiteComponent} from './site.component';
import {SiteListComponent} from './site-list/site-list.component';
import {SiteViewComponent} from './site-view/site-view.component';
import {SiteRoutingModule} from "./site-routing.module";
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../importes/material/material.module";
import { SiteSearchComponent } from './site-search/site-search.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {ClarityModule} from "@clr/angular";
import { SiteFormsComponent } from './site-forms/site-forms.component';
import {TemplatesModule} from "../../../templates/templates.module";
import {AuditSiteModule} from "../audit-site/audit-site.module";


@NgModule({
  declarations: [SiteComponent, SiteListComponent, SiteViewComponent, SiteSearchComponent, SiteFormsComponent],
  exports: [
    SiteSearchComponent
  ],
    imports: [
        CommonModule,
        SiteRoutingModule,
        SharedModule,
        MaterialModule,
        FormsModule,
        TranslateModule,
        ClarityModule,
        ReactiveFormsModule,
        TemplatesModule,
        AuditSiteModule
    ]
})
export class SiteModule {
}
