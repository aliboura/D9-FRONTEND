import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';
import {TemplatesModule} from "../../templates/templates.module";
import { ReportingByStatusComponent } from './reporting-by-status/reporting-by-status.component';
import { ReportingByWilayaComponent } from './reporting-by-wilaya/reporting-by-wilaya.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MaterialModule} from "../../importes/material/material.module";
import {ClarityModule} from "@clr/angular";
import { ReportingViewComponent } from './reporting-view/reporting-view.component';
import {PdfJsViewerModule} from "ng2-pdfjs-viewer";
import { ReportingByStatusWilayaComponent } from './reporting-by-status-wilaya/reporting-by-status-wilaya.component';
import { ReportingAuditGridComponent } from './reporting-audit-grid/reporting-audit-grid.component';
import { ReportingByVisitComponent } from './reporting-by-visit/reporting-by-visit.component';
import { ReportingByUsersComponent } from './reporting-by-users/reporting-by-users.component';


@NgModule({
  declarations: [ReportingComponent, ReportingByStatusComponent, ReportingByWilayaComponent, ReportingViewComponent, ReportingByStatusWilayaComponent, ReportingAuditGridComponent, ReportingByVisitComponent, ReportingByUsersComponent],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    TemplatesModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    MaterialModule,
    ClarityModule,
    PdfJsViewerModule
  ]
})
export class ReportingModule { }
