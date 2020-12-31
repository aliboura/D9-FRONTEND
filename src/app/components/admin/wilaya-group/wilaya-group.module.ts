import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WilayaGroupRoutingModule } from './wilaya-group-routing.module';
import { WilayaGroupListComponent } from './wilaya-group-list/wilaya-group-list.component';
import {SharedModule} from "../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import { WilayaGroupComponent } from './wilaya-group.component';
import {TemplatesModule} from "../../../templates/templates.module";
import { WilayaGroupEditComponent } from './wilaya-group-edit/wilaya-group-edit.component';
import {MaterialModule} from "../../../importes/material/material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ClrModalModule} from "@clr/angular";


@NgModule({
  declarations: [WilayaGroupListComponent, WilayaGroupComponent, WilayaGroupEditComponent],
  imports: [
    CommonModule,
    WilayaGroupRoutingModule,
    SharedModule,
    TranslateModule,
    TemplatesModule,
    MaterialModule,
    ReactiveFormsModule,
    ClrModalModule
  ]
})
export class WilayaGroupModule { }
