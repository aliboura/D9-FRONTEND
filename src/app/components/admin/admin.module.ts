import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {TemplatesModule} from "../../templates/templates.module";


@NgModule({
  declarations: [AdminComponent],
    imports: [
        CommonModule,
        AdminRoutingModule,
        TemplatesModule
    ]
})
export class AdminModule { }
