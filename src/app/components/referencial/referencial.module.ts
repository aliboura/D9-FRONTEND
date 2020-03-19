import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReferencialRoutingModule} from "./referencial-routing.module";
import {ReferencialComponent} from './referencial.component';
import {MaterialModule} from "../../importes/material/material.module";


@NgModule({
  declarations: [ReferencialComponent],
    imports: [
        CommonModule,
        ReferencialRoutingModule,
        MaterialModule
    ]
})
export class ReferencialModule {
}
