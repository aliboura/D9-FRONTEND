import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from './admin.component';
import {TemplatesModule} from "../../templates/templates.module";
import {MaterialModule} from "../../importes/material/material.module";


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TemplatesModule,
    MaterialModule
  ]
})
export class AdminModule {
}
