import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatusRoutingModule} from "./status-routing.module";
import {StatusComponent} from './status.component';
import {StatusListComponent} from './status-list/status-list.component';
import {StatusAddComponent} from './status-add/status-add.component';
import {StatusEditComponent} from './status-edit/status-edit.component';
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../importes/material/material.module";


@NgModule({
  declarations: [StatusComponent, StatusListComponent, StatusAddComponent, StatusEditComponent],
    imports: [
        CommonModule,
        StatusRoutingModule,
        SharedModule,
        MaterialModule
    ]
})
export class StatusModule {
}
