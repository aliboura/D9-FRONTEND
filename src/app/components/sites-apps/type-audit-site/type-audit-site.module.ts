import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeAuditSiteRoutingModule } from './type-audit-site-routing.module';
import { TypeAuditSiteComponent } from './type-audit-site.component';
import { TypeAuditSiteListComponent } from './type-audit-site-list/type-audit-site-list.component';
import { TypeAuditSiteAddComponent } from './type-audit-site-add/type-audit-site-add.component';
import { TypeAuditSiteEditComponent } from './type-audit-site-edit/type-audit-site-edit.component';
import {MaterialModule} from "../../../importes/material/material.module";
import {SharedModule} from "../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [TypeAuditSiteComponent, TypeAuditSiteListComponent, TypeAuditSiteAddComponent, TypeAuditSiteEditComponent],
  imports: [
    CommonModule,
    TypeAuditSiteRoutingModule,
    SharedModule,
    MaterialModule,
    TranslateModule
  ]
})
export class TypeAuditSiteModule { }
