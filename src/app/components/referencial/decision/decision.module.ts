import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DecisionComponent} from './decision.component';
import {DecisionListComponent} from './decision-list/decision-list.component';
import {DecisionAddComponent} from './decision-add/decision-add.component';
import {DecisionEditComponent} from './decision-edit/decision-edit.component';
import {DecisionRoutingModule} from "./decision-routing.module";
import {SharedModule} from "../../../shared/shared.module";
import {MaterialModule} from "../../../importes/material/material.module";


@NgModule({
  declarations: [DecisionComponent, DecisionListComponent, DecisionAddComponent, DecisionEditComponent],
    imports: [
        CommonModule,
        DecisionRoutingModule,
        SharedModule,
        MaterialModule
    ]
})
export class DecisionModule {
}
