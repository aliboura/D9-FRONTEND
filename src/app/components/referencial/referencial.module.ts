import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReferencialRoutingModule} from "./referencial-routing.module";
import {ReferencialComponent} from './referencial.component';
import {MaterialModule} from "../../importes/material/material.module";
import {TemplatesModule} from "../../templates/templates.module";


@NgModule({
  declarations: [ReferencialComponent],
    imports: [
        CommonModule,
        ReferencialRoutingModule,
        MaterialModule,
        TemplatesModule
    ]
})
export class ReferencialModule {
}
