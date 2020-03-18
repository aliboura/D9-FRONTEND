import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuditSiteComponent} from './audit-site.component';
import {AuditSiteRoutingModule} from "./audit-site-routing.module";
import {SharedModule} from "../../../shared/shared.module";
import { AuditSiteListComponent } from './audit-site-list/audit-site-list.component';
import { AuditSiteAddComponent } from './audit-site-add/audit-site-add.component';
import { AuditSiteEditComponent } from './audit-site-edit/audit-site-edit.component';


@NgModule({
  declarations: [AuditSiteComponent, AuditSiteListComponent, AuditSiteAddComponent, AuditSiteEditComponent],
  imports: [
    CommonModule,
    AuditSiteRoutingModule,
    SharedModule
  ]
})
export class AuditSiteModule {
}
